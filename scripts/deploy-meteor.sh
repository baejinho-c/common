#!/usr/bin/env bash
# meteor.restyart.com — static Meteor Shower (유성우 관측소)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$COMMON_DIR/public/meteor"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
DOMAIN="${METEOR_DOMAIN:-meteor.restyart.com}"
REMOTE_WWW="/var/www/meteor"
CONF="/etc/nginx/conf.d/meteor-restyart.conf"

if [ ! -f "$APP_DIR/index.html" ]; then
  echo "[ERROR] missing $APP_DIR/index.html" >&2
  exit 1
fi

echo "[rsync] $APP_DIR -> $HOST:$REMOTE_WWW"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo mkdir -p '$REMOTE_WWW' && sudo chown -R ec2-user:ec2-user '$REMOTE_WWW' && sudo chmod 755 '$REMOTE_WWW'"
# Do not --delete: PC backgrounds and extra assets may exist only on the server.
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$APP_DIR/" "$HOST:$REMOTE_WWW/"
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
  echo "[skip nginx rewrite] no cert yet; keeping existing config"
else
  write_ssl_conf
  sudo nginx -t
  sudo systemctl reload nginx
fi
REMOTE

echo "[probe] https://$DOMAIN"
curl -sS -o /dev/null -w "%{http_code} %{content_type} /\n" "https://$DOMAIN/" || true
echo "[done] https://$DOMAIN"
