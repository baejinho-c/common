#!/usr/bin/env bash
# write.restyart.com — 꼬마 붓글씨 공방
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
APP_DIR="$BASE_DIR/edugame/public/minigames/write"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
DOMAIN="${WRITE_DOMAIN:-write.restyart.com}"
REMOTE_WWW="/var/www/write"
CONF="/etc/nginx/conf.d/write-restyart.conf"

test -f "$APP_DIR/index.html"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "sudo mkdir -p '$REMOTE_WWW' && sudo chown ec2-user:ec2-user '$REMOTE_WWW'"
rsync -az --delete -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" "$APP_DIR/" "$HOST:$REMOTE_WWW/"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "DOMAIN='$DOMAIN' REMOTE_WWW='$REMOTE_WWW' CONF='$CONF' bash -s" <<'REMOTE'
set -euo pipefail
sudo tee "$CONF" >/dev/null <<EOF
server {
 listen 80; listen [::]:80; server_name ${DOMAIN}; root ${REMOTE_WWW}; index index.html;
 location / { add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com;" always; try_files \$uri \$uri/ /index.html; }
 location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; try_files \$uri =404; }
}
EOF
sudo nginx -t && sudo systemctl reload nginx
if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect; fi
REMOTE
curl -sS -o /dev/null -w "https %{http_code}\n" "https://$DOMAIN/"
echo "[done] https://$DOMAIN"
