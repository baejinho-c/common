#!/usr/bin/env bash
# comparison.restyart.com — Next.js standalone
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/comparison"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/comparison"
REMOTE_PORT="${COMPARISON_PORT:-3023}"
DOMAIN="${COMPARISON_DOMAIN:-comparison.restyart.com}"

echo "[build] comparison"
pushd "$APP_DIR" >/dev/null
if [ ! -d node_modules ]; then
  npm install --legacy-peer-deps
fi
npm run build
popd >/dev/null

STANDALONE="$APP_DIR/.next/standalone"
[ -d "$STANDALONE" ] || { echo "[ERROR] missing .next/standalone" >&2; exit 1; }

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

echo "[docker] build & run comparison on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<EOF
set -euo pipefail
cd $REMOTE_APP
ENV_FILE="/opt/common/.env"
ENV_ARGS=""
if [ -f "\$ENV_FILE" ]; then
  ENV_ARGS="--env-file \$ENV_FILE"
fi
docker build -t comparison-app .
docker rm -f comparison 2>/dev/null || true
docker run -d --name comparison --restart unless-stopped -p 127.0.0.1:$REMOTE_PORT:3023 \$ENV_ARGS comparison-app
docker ps --filter name=comparison
EOF

echo "[nginx] ensure comparison-restyart.conf"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<'NGINX'
set -euo pipefail
CONF=/etc/nginx/conf.d/comparison-restyart.conf
if [ ! -f "$CONF" ]; then
  sudo tee "$CONF" >/dev/null <<'EOF'
# comparison.restyart.com → Next.js standalone :3023
server {
    listen 80;
    server_name comparison.restyart.com;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:3023;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF
  sudo nginx -t && sudo systemctl reload nginx
else
  sudo nginx -t && sudo systemctl reload nginx
fi
NGINX

echo "[certbot] SSL for $DOMAIN"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<CERT
set -euo pipefail
if [ ! -d /etc/letsencrypt/live/$DOMAIN ]; then
  sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m support@restyart.com || true
else
  echo "[certbot] certificate already exists for $DOMAIN"
fi
sudo nginx -t && sudo systemctl reload nginx
CERT

echo "[done] https://$DOMAIN"
