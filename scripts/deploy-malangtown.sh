#!/usr/bin/env bash
# malangtown.restyart.com — 말랑이 마을
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/edugame/public/minigames/malang-town"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
DOMAIN="${MALANGTOWN_DOMAIN:-malangtown.restyart.com}"
REMOTE_WWW="/var/www/malangtown"
CONF="/etc/nginx/conf.d/malangtown-restyart.conf"

if [ ! -f "$APP_DIR/index.html" ]; then
  echo "[ERROR] missing $APP_DIR/index.html" >&2
  exit 1
fi

echo "[rsync] $APP_DIR -> $HOST:$REMOTE_WWW"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "sudo mkdir -p '$REMOTE_WWW' && sudo chown ec2-user:ec2-user '$REMOTE_WWW'"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$APP_DIR/index.html" "$APP_DIR/icon.png" \
  "$HOST:$REMOTE_WWW/"

echo "[nginx] $DOMAIN"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "DOMAIN='$DOMAIN' REMOTE_WWW='$REMOTE_WWW' CONF='$CONF' bash -s" <<'REMOTE'
set -euo pipefail
NEED_CERT=0
if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  NEED_CERT=1
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
    --register-unsafely-without-email --redirect
fi

# Always rewrite SSL vhost so CSP survives certbot edits
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
echo "[nginx] need_cert=${NEED_CERT} conf updated"
REMOTE

echo "[probe] https://$DOMAIN"
curl -sS -o /dev/null -w "https %{http_code}\n" "https://$DOMAIN/" || true
echo "[done] https://$DOMAIN"
