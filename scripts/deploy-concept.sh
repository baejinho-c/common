#!/usr/bin/env bash
# concept.restyart.com — Next.js standalone (API routes 포함)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
CONCEPT_DIR="$BASE_DIR/concept"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/concept"
REMOTE_PORT="${CONCEPT_PORT:-3028}"

echo "[build] concept"
pushd "$CONCEPT_DIR" >/dev/null
if [ ! -d node_modules ]; then
  npm install --legacy-peer-deps
fi
npm run build
popd >/dev/null

STANDALONE="$CONCEPT_DIR/.next/standalone"
[ -d "$STANDALONE" ] || { echo "[ERROR] missing .next/standalone — check output: standalone in next.config" >&2; exit 1; }

echo "[rsync] standalone -> $HOST:$REMOTE_APP"
RSYNC_OPTS=(-az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new")
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "mkdir -p $REMOTE_APP"
rsync "${RSYNC_OPTS[@]}" --delete \
  "$STANDALONE/" "$HOST:$REMOTE_APP/"
rsync "${RSYNC_OPTS[@]}" \
  "$CONCEPT_DIR/.next/static/" "$HOST:$REMOTE_APP/.next/static/"
rsync "${RSYNC_OPTS[@]}" \
  "$CONCEPT_DIR/public/" "$HOST:$REMOTE_APP/public/"
rsync "${RSYNC_OPTS[@]}" \
  "$CONCEPT_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run concept on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<EOF
set -euo pipefail
cd $REMOTE_APP
ENV_FILE="/opt/common/.env"
ENV_ARGS=""
if [ -f "\$ENV_FILE" ]; then
  ENV_ARGS="--env-file \$ENV_FILE"
fi
docker build -t concept-app .
docker rm -f concept 2>/dev/null || true
docker run -d --name concept --restart unless-stopped -p 127.0.0.1:$REMOTE_PORT:3028 \$ENV_ARGS concept-app
docker ps --filter name=concept
EOF

NGINX_CONF='concept-restyart.conf'
echo "[nginx] ensure $NGINX_CONF"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<'NGINX'
set -euo pipefail
CONF=/etc/nginx/conf.d/concept-restyart.conf
if [ ! -f "$CONF" ]; then
  sudo tee "$CONF" >/dev/null <<'EOF'
# concept.restyart.com → Next.js standalone :3028
server {
    listen 80;
    server_name concept.restyart.com;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:3028;
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
  if [ ! -d /etc/letsencrypt/live/concept.restyart.com ]; then
    sudo certbot --nginx -d concept.restyart.com --non-interactive --agree-tos -m support@restyart.com || true
  fi
else
  sudo sed -i \
    -e 's/proxy_read_timeout [^;]*;/proxy_read_timeout 300s;/g' \
    -e 's/proxy_send_timeout [^;]*;/proxy_send_timeout 300s;/g' \
    -e 's/proxy_connect_timeout [^;]*;/proxy_connect_timeout 60s;/g' \
    "$CONF" || true
  if ! grep -q 'client_max_body_size' "$CONF"; then
    sudo sed -i '/server_name concept.restyart.com/a\    client_max_body_size 20m;' "$CONF"
  fi
  sudo nginx -t && sudo systemctl reload nginx
fi
NGINX

echo "[done] https://concept.restyart.com"
