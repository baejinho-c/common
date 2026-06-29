#!/usr/bin/env bash
# rebrand.restyart.com — Next.js standalone (API routes 포함)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
REBRAND_DIR="$BASE_DIR/rebrand"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/rebrand"
REMOTE_PORT="${REBRAND_PORT:-3020}"
NODE_BIN="${REBRAND_NODE:-/home/ec2-user/.nvm/versions/node/v20.19.2/bin/node}"

echo "[build] rebrand"
pushd "$REBRAND_DIR" >/dev/null
if [ ! -d node_modules ]; then
  npm install --legacy-peer-deps
fi
npm run build
popd >/dev/null

STANDALONE="$REBRAND_DIR/.next/standalone"
[ -d "$STANDALONE" ] || { echo "[ERROR] missing .next/standalone — check output: standalone in next.config" >&2; exit 1; }

echo "[rsync] standalone -> $HOST:$REMOTE_APP"
RSYNC_OPTS=(-az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new")
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "mkdir -p $REMOTE_APP"
rsync "${RSYNC_OPTS[@]}" --delete \
  "$STANDALONE/" "$HOST:$REMOTE_APP/"
rsync "${RSYNC_OPTS[@]}" \
  "$REBRAND_DIR/.next/static/" "$HOST:$REMOTE_APP/.next/static/"
rsync "${RSYNC_OPTS[@]}" \
  "$REBRAND_DIR/public/" "$HOST:$REMOTE_APP/public/"
rsync "${RSYNC_OPTS[@]}" \
  "$REBRAND_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run rebrand on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<EOF
set -euo pipefail
cd $REMOTE_APP
docker build -t rebrand-app .
docker rm -f rebrand 2>/dev/null || true
docker run -d --name rebrand --restart unless-stopped -p 127.0.0.1:$REMOTE_PORT:3020 rebrand-app
docker ps --filter name=rebrand
EOF

NGINX_CONF='rebrand-restyart.conf'
echo "[nginx] ensure $NGINX_CONF"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<'NGINX'
set -euo pipefail
CONF=/etc/nginx/conf.d/rebrand-restyart.conf
if [ ! -f "$CONF" ]; then
  sudo tee "$CONF" >/dev/null <<'EOF'
# rebrand.restyart.com → Next.js standalone :3020
server {
    listen 80;
    server_name rebrand.restyart.com;
    location / {
        proxy_pass http://127.0.0.1:3020;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
EOF
  sudo nginx -t && sudo systemctl reload nginx
  if [ ! -d /etc/letsencrypt/live/rebrand.restyart.com ]; then
    sudo certbot --nginx -d rebrand.restyart.com --non-interactive --agree-tos -m support@restyart.com || true
  fi
else
  sudo nginx -t && sudo systemctl reload nginx
fi
NGINX

echo "[done] https://rebrand.restyart.com"
