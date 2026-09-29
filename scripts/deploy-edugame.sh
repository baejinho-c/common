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
STANDALONE_EXCLUDES=(
  --exclude='public/minigames/malang-bowling/_sheet.png'
  --exclude='public/minigames/malang-bowling/images/_ball_catalog/'
  --exclude='public/minigames/malang-bowling/images/_pin_catalog/'
  --exclude='public/minigames/soft-bingsu/_sheet-source.png'
)
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "mkdir -p $REMOTE_APP"
rsync "${RSYNC_OPTS[@]}" --delete --delete-excluded "${STANDALONE_EXCLUDES[@]}" \
  "$STANDALONE/" "$HOST:$REMOTE_APP/"
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/.next/static/" "$HOST:$REMOTE_APP/.next/static/"
if [ -d "$APP_DIR/public" ]; then
  # Source/reference sheets stay in the workspace but are not needed at runtime.
  PUBLIC_EXCLUDES=(
    --exclude='minigames/malang-bowling/_sheet.png'
    --exclude='minigames/malang-bowling/images/_ball_catalog/'
    --exclude='minigames/malang-bowling/images/_pin_catalog/'
    --exclude='minigames/soft-bingsu/_sheet-source.png'
  )
  rsync "${RSYNC_OPTS[@]}" "${PUBLIC_EXCLUDES[@]}" \
    "$APP_DIR/public/" "$HOST:$REMOTE_APP/public/"
fi
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run edugame on :$REMOTE_PORT"
# Persist uploaded games outside the container; keep admin token stable across deploys
UGC_HOST_DIR="${EDUGAME_UGC_HOST_DIR:-/opt/resty-gateway/data/edugame-ugc}"
BATCHIM_HOST_DIR="${EDUGAME_BATCHIM_HOST_DIR:-/opt/resty-gateway/data/edugame-batchim}"
DICTIONARY_HOST_DIR="${EDUGAME_DICTIONARY_HOST_DIR:-/opt/resty-gateway/data/edugame-dictionary}"
LEADERBOARD_HOST_DIR="${EDUGAME_LEADERBOARD_HOST_DIR:-/opt/resty-gateway/data/edugame-leaderboard}"
ADMIN_TOKEN_FILE="${EDUGAME_ADMIN_TOKEN_FILE:-/opt/resty-gateway/data/edugame-admin.token}"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "REMOTE_APP='$REMOTE_APP' REMOTE_PORT='$REMOTE_PORT' UGC_HOST_DIR='$UGC_HOST_DIR' BATCHIM_HOST_DIR='$BATCHIM_HOST_DIR' DICTIONARY_HOST_DIR='$DICTIONARY_HOST_DIR' LEADERBOARD_HOST_DIR='$LEADERBOARD_HOST_DIR' ADMIN_TOKEN_FILE='$ADMIN_TOKEN_FILE' bash -s" <<'EOF'
set -euo pipefail
cd "$REMOTE_APP"
mkdir -p "$UGC_HOST_DIR" "$BATCHIM_HOST_DIR" "$DICTIONARY_HOST_DIR" "$LEADERBOARD_HOST_DIR" "$(dirname "$ADMIN_TOKEN_FILE")"
if [ ! -f "$ADMIN_TOKEN_FILE" ]; then
  python3 -c 'import secrets; open("'"$ADMIN_TOKEN_FILE"'","w").write(secrets.token_hex(16))'
  chmod 600 "$ADMIN_TOKEN_FILE"
  echo "[admin] created token file $ADMIN_TOKEN_FILE"
fi
ADMIN_TOKEN="$(python3 -c 'print(open("'"$ADMIN_TOKEN_FILE"'").read().strip())')"
docker build -t edugame-app .
docker rm -f edugame 2>/dev/null || true
docker run -d --name edugame --restart unless-stopped \
  -p "127.0.0.1:${REMOTE_PORT}:${REMOTE_PORT}" \
  -e "PORT=${REMOTE_PORT}" \
  -e HOSTNAME=0.0.0.0 \
  -e "EDUGAME_UGC_DIR=/data/ugc" \
  -e "EDUGAME_BATCHIM_DIR=/data/batchim" \
  -e "EDUGAME_DICTIONARY_DIR=/data/dictionary" \
  -e "EDUGAME_LEADERBOARD_DIR=/data/leaderboard" \
  -e "EDUGAME_ADMIN_TOKEN=${ADMIN_TOKEN}" \
  -v "${UGC_HOST_DIR}:/data/ugc" \
  -v "${BATCHIM_HOST_DIR}:/data/batchim" \
  -v "${DICTIONARY_HOST_DIR}:/data/dictionary" \
  -v "${LEADERBOARD_HOST_DIR}:/data/leaderboard" \
  edugame-app
docker ps --filter name=edugame
sleep 2
curl -sS -o /dev/null -w "local %{http_code}\n" "http://127.0.0.1:${REMOTE_PORT}/" || true
echo "[admin] token is in ${ADMIN_TOKEN_FILE} on the server (use it on /admin)"
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
    client_max_body_size 4m;

    location ^~ /_next/static/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    location ^~ /icons/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=604800, stale-while-revalidate=86400" always;
    }

    location ^~ /catalog-icons/ {
        alias /opt/resty-gateway/data/edugame-icons/;
        expires 7d;
        add_header Cache-Control "public, max-age=604800" always;
    }

    location ^~ /minigames/sparkle/_next/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    location ^~ /sparkle-assets/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=2592000, immutable" always;
    }

    location ~* ^/minigames/.+\.(?:png|jpe?g|webp|gif|svg|woff2?|mp3|wav|ogg)$ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=604800, stale-while-revalidate=86400" always;
    }

    location = /sw.js {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }

    location ^~ /api/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-store" always;
    }

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
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-cache, must-revalidate" always;
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
    client_max_body_size 4m;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location ^~ /_next/static/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    location ^~ /icons/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=604800, stale-while-revalidate=86400" always;
    }

    location ^~ /catalog-icons/ {
        alias /opt/resty-gateway/data/edugame-icons/;
        expires 7d;
        add_header Cache-Control "public, max-age=604800" always;
    }

    location ^~ /minigames/sparkle/_next/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    location ^~ /sparkle-assets/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=2592000, immutable" always;
    }

    location ~* ^/minigames/.+\.(?:png|jpe?g|webp|gif|svg|woff2?|mp3|wav|ogg)$ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=604800, stale-while-revalidate=86400" always;
    }

    location = /sw.js {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }

    location ^~ /api/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-store" always;
    }

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
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-cache, must-revalidate" always;
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
