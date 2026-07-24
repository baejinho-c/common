#!/usr/bin/env bash
# secu-scan.restyart.com — Next.js standalone
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/secu-scan"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/secu-scan"
REMOTE_PORT="${SECU_SCAN_PORT:-3034}"
DOMAIN="${SECU_SCAN_DOMAIN:-secu-scan.restyart.com}"

echo "[build] secu-scan"
pushd "$APP_DIR" >/dev/null
if [ ! -d node_modules ]; then
  npm install --legacy-peer-deps
fi
npx next build --webpack
popd >/dev/null

STANDALONE="$APP_DIR/.next/standalone"
[ -d "$STANDALONE" ] || { echo "[ERROR] missing .next/standalone — check output: standalone in next.config" >&2; exit 1; }

echo "[rsync] standalone -> $HOST:$REMOTE_APP"
RSYNC_OPTS=(-az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new")
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "mkdir -p $REMOTE_APP"
rsync "${RSYNC_OPTS[@]}" --delete \
  "$STANDALONE/" "$HOST:$REMOTE_APP/"
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/.next/static/" "$HOST:$REMOTE_APP/.next/static/"
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/public/" "$HOST:$REMOTE_APP/public/"
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run secu-scan on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<EOF
set -euo pipefail
cd $REMOTE_APP
ENV_FILE="/opt/common/.env"
ENV_ARGS=""
if [ -f "\$ENV_FILE" ]; then
  ENV_ARGS="--env-file \$ENV_FILE"
fi
docker build -t secu-scan-app .
docker rm -f secu-scan 2>/dev/null || true
docker run -d --name secu-scan --restart unless-stopped -p 127.0.0.1:$REMOTE_PORT:3024 \$ENV_ARGS secu-scan-app
docker ps --filter name=secu-scan
EOF

echo "[nginx] ensure secu-scan-restyart.conf → :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "REMOTE_PORT='$REMOTE_PORT' DOMAIN='$DOMAIN' bash -s" <<'NGINX'
set -euo pipefail
CONF=/etc/nginx/conf.d/secu-scan-restyart.conf
sudo tee "$CONF" >/dev/null <<EOF
# secu-scan.restyart.com → Next.js standalone :${REMOTE_PORT}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};
    client_max_body_size 20m;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = /api/scan {
        proxy_pass http://127.0.0.1:5001/api/secu/scan;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 15s;
        proxy_send_timeout 40s;
        proxy_read_timeout 40s;
    }

    location ^~ /api/secu/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 15s;
        proxy_send_timeout 40s;
        proxy_read_timeout 40s;
    }

    location / {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}
EOF
sudo nginx -t && sudo systemctl reload nginx
NGINX

echo "[certbot] SSL for $DOMAIN"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<CERT
set -euo pipefail
if [ ! -d /etc/letsencrypt/live/$DOMAIN ]; then
  sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m support@restyart.com || true
else
  echo "[certbot] certificate already exists for $DOMAIN"
fi
CERT

echo "[done] https://$DOMAIN"
