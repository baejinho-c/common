#!/usr/bin/env bash
# animal-travel.restyart.com — static Animal Travel (동물원 여행)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/edugame/public/minigames/animal-travel"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
DOMAIN="${ANIMAL_TRAVEL_DOMAIN:-animal-travel.restyart.com}"
REMOTE_WWW="/var/www/animal-travel"
CONF="/etc/nginx/conf.d/animal-travel-restyart.conf"

if [ ! -f "$APP_DIR/index.html" ]; then
  echo "[ERROR] missing $APP_DIR/index.html" >&2
  exit 1
fi

STAGE="$(mktemp -d)"
cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

cp "$APP_DIR/index.html" "$STAGE/index.html"
if [ -f "$APP_DIR/mobile-hardening.css" ]; then
  cp "$APP_DIR/mobile-hardening.css" "$STAGE/mobile-hardening.css"
fi
if [ -f "$APP_DIR/styles.css" ]; then
  cp "$APP_DIR/styles.css" "$STAGE/styles.css"
fi
if [ -d "$APP_DIR/assets" ]; then
  mkdir -p "$STAGE/assets"
  rsync -a "$APP_DIR/assets/" "$STAGE/assets/"
fi

ICON_WEBP_SRC=""
ICON_PNG_SRC=""
if [ -f "$APP_DIR/icon.webp" ]; then
  ICON_WEBP_SRC="$APP_DIR/icon.webp"
elif [ -f "$BASE_DIR/edugame/public/icons/animal-travel-v1.webp" ]; then
  ICON_WEBP_SRC="$BASE_DIR/edugame/public/icons/animal-travel-v1.webp"
fi
if [ -f "$APP_DIR/icon.png" ]; then
  ICON_PNG_SRC="$APP_DIR/icon.png"
elif [ -f "$BASE_DIR/edugame/public/icons/animal-travel-v1.png" ]; then
  ICON_PNG_SRC="$BASE_DIR/edugame/public/icons/animal-travel-v1.png"
fi
if [ -n "$ICON_WEBP_SRC" ]; then
  cp "$ICON_WEBP_SRC" "$STAGE/icon.webp"
fi
if [ -n "$ICON_PNG_SRC" ]; then
  cp "$ICON_PNG_SRC" "$STAGE/icon.png"
  cp "$ICON_PNG_SRC" "$STAGE/favicon.ico"
  cp "$ICON_PNG_SRC" "$STAGE/apple-touch-icon.png"
fi
if [ -f "$APP_DIR/favicon.ico" ]; then
  cp "$APP_DIR/favicon.ico" "$STAGE/favicon.ico"
fi
if [ -f "$APP_DIR/apple-touch-icon.png" ]; then
  cp "$APP_DIR/apple-touch-icon.png" "$STAGE/apple-touch-icon.png"
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

echo "[rsync] staged animal-travel -> $HOST:$REMOTE_WWW"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo mkdir -p '$REMOTE_WWW' && sudo chown -R ec2-user:ec2-user '$REMOTE_WWW' && sudo chmod 755 '$REMOTE_WWW'"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  --delete \
  "$STAGE/" "$HOST:$REMOTE_WWW/"
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

write_ssl_conf() {
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
    location = /favicon.ico { try_files \$uri /icon.png =404; }
    location = /apple-touch-icon.png { try_files \$uri /icon.png =404; }
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
}

if [ "$HAS_CERT" -eq 0 ]; then
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
  if ! sudo test -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"; then
    echo "[ERROR] certificate was not issued for ${DOMAIN}; keeping HTTP config" >&2
    sudo nginx -t
    sudo systemctl reload nginx
    exit 1
  fi
fi

write_ssl_conf
sudo nginx -t
sudo systemctl reload nginx
REMOTE

echo "[probe] https://$DOMAIN"
for u in / /icon.png /favicon.ico /robots.txt /sitemap.xml; do
  curl -sS -o /dev/null -w "%{http_code} %{content_type} $u\n" "https://$DOMAIN$u" || true
done
echo "[done] https://$DOMAIN"
