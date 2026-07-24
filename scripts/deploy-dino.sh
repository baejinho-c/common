#!/usr/bin/env bash
# dino.restyart.com — static dino-dig HTML (edugame 공룡 발굴단)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/edugame/public/minigames/dino-dig"
ICON_SRC="$BASE_DIR/edugame/public/icons/dino-dig.png"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
DOMAIN="${DINO_DOMAIN:-dino.restyart.com}"
REMOTE_WWW="/var/www/dino"
CONF="/etc/nginx/conf.d/dino-restyart.conf"

if [ ! -f "$APP_DIR/index.html" ]; then
  echo "[ERROR] missing $APP_DIR/index.html" >&2
  exit 1
fi

STAGE="$(mktemp -d)"
cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

# 게임 HTML + images/ 에셋
cp "$APP_DIR/index.html" "$STAGE/index.html"
if [ -d "$APP_DIR/images" ]; then
  mkdir -p "$STAGE/images"
  rsync -a "$APP_DIR/images/" "$STAGE/images/"
fi
if [ -f "$ICON_SRC" ]; then
  cp "$ICON_SRC" "$STAGE/icon.png"
  mkdir -p "$STAGE/icons"
  cp "$ICON_SRC" "$STAGE/icons/dino-dig.png"
  cp "$ICON_SRC" "$STAGE/favicon.ico"
else
  echo "[WARN] missing icon $ICON_SRC" >&2
fi

cat >"$STAGE/robots.txt" <<EOF
User-agent: *
Allow: /

Sitemap: https://${DOMAIN}/sitemap.xml
EOF

cat >"$STAGE/sitemap.xml" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${DOMAIN}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF

echo "[rsync] staged dino -> $HOST:$REMOTE_WWW"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo mkdir -p '$REMOTE_WWW' && sudo chown -R ec2-user:ec2-user '$REMOTE_WWW' && sudo chmod 755 '$REMOTE_WWW'"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  --delete \
  --exclude 'README.md' \
  "$STAGE/" "$HOST:$REMOTE_WWW/"
# nginx(www)가 읽을 수 있도록 디렉터리 755 / 파일 644 (700이면 403)
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo chown -R ec2-user:ec2-user '$REMOTE_WWW'; find '$REMOTE_WWW' -type d -exec chmod 755 {} +; find '$REMOTE_WWW' -type f -exec chmod 644 {} +"

echo "[nginx] $DOMAIN"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "DOMAIN='$DOMAIN' REMOTE_WWW='$REMOTE_WWW' CONF='$CONF' bash -s" <<'REMOTE'
set -euo pipefail
HAS_CERT=0
if sudo test -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"; then
  HAS_CERT=1
fi

sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};
    root ${REMOTE_WWW};
    index index.html;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = /robots.txt { try_files \$uri =404; }
    location = /sitemap.xml { try_files \$uri =404; }
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp|css|js|map|txt|xml)$ {
        try_files \$uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }
    location / {
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com;" always;
        try_files \$uri \$uri/ /index.html;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}
EOF

# Always write final SSL vhost (certbot may overwrite on first issue)
sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};
    root ${REMOTE_WWW};
    index index.html;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = /robots.txt { try_files \$uri =404; }
    location = /sitemap.xml { try_files \$uri =404; }
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp|css|js|map|txt|xml)$ {
        try_files \$uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }
    location / {
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com;" always;
        try_files \$uri \$uri/ /index.html;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}
EOF

if [ "$HAS_CERT" -eq 0 ]; then
  # bootstrap HTTP for ACME, then issue cert, then restore SSL conf above
  sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${REMOTE_WWW};
    index index.html;
    location / { try_files \$uri \$uri/ /index.html; }
}
EOF
  sudo nginx -t && sudo systemctl reload nginx
  sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
    --register-unsafely-without-email --redirect || true
  # restore our vhost after certbot rewrite
  sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};
    root ${REMOTE_WWW};
    index index.html;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = /robots.txt { try_files \$uri =404; }
    location = /sitemap.xml { try_files \$uri =404; }
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp|css|js|map|txt|xml)$ {
        try_files \$uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }
    location / {
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com;" always;
        try_files \$uri \$uri/ /index.html;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}
EOF
fi
sudo nginx -t
sudo systemctl reload nginx
REMOTE

echo "[probe] https://$DOMAIN"
for u in / /icon.png /icons/dino-dig.png /robots.txt /sitemap.xml /favicon.ico; do
  curl -sS -o /dev/null -w "%{http_code} %{content_type} $u\n" "https://$DOMAIN$u" || true
done
echo "[done] https://$DOMAIN"
