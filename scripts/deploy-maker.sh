#!/usr/bin/env bash
# maker.restyart.com — Next.js standalone
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/maker"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/maker"
REMOTE_PORT="${MAKER_PORT:-3035}"
DOMAIN="${MAKER_DOMAIN:-maker.restyart.com}"

echo "[build] maker"
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
if [ -d "$APP_DIR/public" ]; then
  rsync "${RSYNC_OPTS[@]}" "$APP_DIR/public/" "$HOST:$REMOTE_APP/public/"
fi
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run maker on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "REMOTE_APP='$REMOTE_APP' REMOTE_PORT='$REMOTE_PORT' bash -s" <<'EOF'
set -euo pipefail
cd "$REMOTE_APP"
docker build -t maker-app .
docker rm -f maker 2>/dev/null || true
docker run -d --name maker --restart unless-stopped \
  -p "127.0.0.1:${REMOTE_PORT}:${REMOTE_PORT}" \
  -e "PORT=${REMOTE_PORT}" \
  -e HOSTNAME=0.0.0.0 \
  -e "NEXT_PUBLIC_API_BASE_URL=https://app.restyart.com" \
  maker-app
docker ps --filter name=maker
sleep 2
curl -sS -o /dev/null -w "local %{http_code}\n" "http://127.0.0.1:${REMOTE_PORT}/" || true
EOF

echo "[nginx] $DOMAIN -> 127.0.0.1:$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "DOMAIN='$DOMAIN' REMOTE_PORT='$REMOTE_PORT' bash -s" <<'NGINX'
set -euo pipefail
CONF=/etc/nginx/conf.d/maker-restyart.conf

if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    server_tokens off;
    client_max_body_size 4m;
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
    server_tokens off;
    client_max_body_size 4m;

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
  sudo nginx -t
  sudo systemctl reload nginx
fi

curl -sS -o /dev/null -w "https %{http_code}\n" "https://${DOMAIN}/" || true
echo "[done] https://${DOMAIN}"
NGINX
