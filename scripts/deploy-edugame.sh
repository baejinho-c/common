#!/usr/bin/env bash
# edugame.restyart.com — Next.js standalone (Docker :3025)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/edugame"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/edugame"
# 3025 is tone; keep edugame on 3027
REMOTE_PORT="${EDUGAME_PORT:-3027}"
DOMAIN="${EDUGAME_DOMAIN:-edugame.restyart.com}"

if [ ! -d "$APP_DIR" ]; then
  echo "[ERROR] edugame source not found: $APP_DIR" >&2
  exit 1
fi

echo "[build] edugame"
pushd "$APP_DIR" >/dev/null
if [ ! -d node_modules ]; then
  if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then
    pnpm install --frozen-lockfile || pnpm install
  else
    npm install --legacy-peer-deps
  fi
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
  "$APP_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run edugame on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "REMOTE_APP='$REMOTE_APP' REMOTE_PORT='$REMOTE_PORT' bash -s" <<'EOF'
set -euo pipefail
cd "$REMOTE_APP"
docker build -t edugame-app .
docker rm -f edugame 2>/dev/null || true
docker run -d --name edugame --restart unless-stopped \
  -p "127.0.0.1:${REMOTE_PORT}:${REMOTE_PORT}" \
  -e "PORT=${REMOTE_PORT}" \
  -e HOSTNAME=0.0.0.0 \
  edugame-app
docker ps --filter name=edugame
sleep 2
curl -sS -o /dev/null -w "local %{http_code}\n" "http://127.0.0.1:${REMOTE_PORT}/" || true
EOF

echo "[nginx] $DOMAIN -> 127.0.0.1:$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "DOMAIN='$DOMAIN' REMOTE_PORT='$REMOTE_PORT' bash -s" <<'NGINX'
set -euo pipefail
CONF=/etc/nginx/conf.d/edugame-restyart.conf

if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffer_size 512k;
        proxy_buffers 16 256k;
        proxy_busy_buffers_size 512k;
    }
}
EOF
  sudo nginx -t
  sudo systemctl reload nginx
  sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
    --register-unsafely-without-email --redirect
else
  sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffer_size 512k;
        proxy_buffers 16 256k;
        proxy_busy_buffers_size 512k;
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
fi

curl -sS -o /dev/null -w "https %{http_code}\n" "https://${DOMAIN}/" || true
echo "[done] https://${DOMAIN}"
NGINX
