#!/usr/bin/env bash
# roleplay.restyart.com — English Role Play (edugame)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/edugame/public/minigames/english-roleplay"
ICON_SRC="${ROLEPLAY_ICON_SRC:-$BASE_DIR/edugame/public/icons/english-roleplay-v5.png}"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
DOMAIN="${ROLEPLAY_DOMAIN:-roleplay.restyart.com}"
REMOTE_WWW="/var/www/roleplay"
CONF="/etc/nginx/conf.d/roleplay-restyart.conf"

if [ ! -f "$APP_DIR/index.html" ]; then
  echo "[ERROR] missing $APP_DIR/index.html" >&2
  exit 1
fi

STAGE="$(mktemp -d)"
cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

cp "$APP_DIR/index.html" "$STAGE/index.html"
mkdir -p "$STAGE/js" "$STAGE/data/themes" "$STAGE/images"
cp "$APP_DIR/js/engine.js" "$STAGE/js/engine.js"
cp "$APP_DIR/data/catalog.json" "$APP_DIR/data/patterns.json" "$STAGE/data/"
cp "$APP_DIR/data/themes/"*.json "$STAGE/data/themes/"
if [ -d "$APP_DIR/images" ]; then
  rsync -a --exclude '*-mock.png' "$APP_DIR/images/" "$STAGE/images/"
fi

if [ -f "$ICON_SRC" ]; then
  cp "$ICON_SRC" "$STAGE/icon.png"
  cp "$ICON_SRC" "$STAGE/favicon.ico"
elif [ -f "$APP_DIR/icon.png" ]; then
  cp "$APP_DIR/icon.png" "$STAGE/icon.png"
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

echo "[rsync] english-roleplay -> $HOST:$REMOTE_WWW"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo mkdir -p '$REMOTE_WWW' && sudo chown -R ec2-user:ec2-user '$REMOTE_WWW' && sudo chmod 755 '$REMOTE_WWW'"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  --delete \
  --exclude 'README.md' \
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

if [ "$HAS_CERT" = "0" ]; then
  sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${REMOTE_WWW};
    index index.html;
    location / {
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com;" always;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
  sudo nginx -t
  sudo systemctl reload nginx
  sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
    --register-unsafely-without-email --redirect || true
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
sudo nginx -t
sudo systemctl reload nginx
echo "[nginx] conf updated"
REMOTE

echo "[probe] https://$DOMAIN"
curl -sS -o /dev/null -w "https %{http_code}\n" "https://$DOMAIN/" || true
curl -sS -o /dev/null -w "catalog %{http_code}\n" "https://$DOMAIN/data/catalog.json" || true
echo "[done] https://$DOMAIN"
