#!/usr/bin/env bash
# og-studio.restyart.com — OG Studio Next.js standalone
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/ogstudio"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/og-studio"
REMOTE_PORT="${OG_STUDIO_PORT:-3026}"
DOMAIN="${OG_STUDIO_DOMAIN:-og-studio.restyart.com}"

echo "[build] og-studio"
pushd "$APP_DIR" >/dev/null
if [ ! -d node_modules ]; then
  npm install
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
if [ -d "$APP_DIR/public" ]; then
  rsync "${RSYNC_OPTS[@]}" \
    "$APP_DIR/public/" "$HOST:$REMOTE_APP/public/"
fi
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/package.json" "$HOST:$REMOTE_APP/package.json"
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run og-studio on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<EOF
set -euo pipefail
cd $REMOTE_APP
docker build -t og-studio-app .
docker rm -f og-studio 2>/dev/null || true
docker run -d --name og-studio --restart unless-stopped \
  -p 127.0.0.1:$REMOTE_PORT:3026 \
  og-studio-app
docker ps --filter name=og-studio
EOF

echo "[nginx] ensure og-studio-restyart.conf"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<'NGINX'
set -euo pipefail
sudo tee /etc/nginx/conf.d/og-studio-restyart.conf >/dev/null <<'EOF'
# og-studio.restyart.com → OG Studio Next.js :3026
server {
    listen 80;
    server_name og-studio.restyart.com;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:3026;
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
NGINX

echo "[certbot] SSL for $DOMAIN"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<CERT
set -euo pipefail
# Always run certbot --nginx so existing certs get wired into nginx (HTTPS proxy)
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m support@restyart.com || true
sudo nginx -t && sudo systemctl reload nginx
CERT

echo "[done] https://$DOMAIN"
