#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MATH_SRC="$ROOT/../math"
PUBLIC_SRC="$ROOT/public/math"

SSH_KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
SSH_HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_PUBLIC="/opt/resty-gateway/common/public/math"
REMOTE_PORT="4000"

if [ ! -d "$MATH_SRC" ]; then
  echo "[ERROR] math source not found: $MATH_SRC" >&2
  exit 1
fi

echo "[build] math static export"
(cd "$MATH_SRC" && npx next build --webpack)

if [ ! -d "$MATH_SRC/out" ]; then
  echo "[ERROR] export output not found: $MATH_SRC/out" >&2
  exit 1
fi

echo "[rsync] math out -> $SSH_HOST:$REMOTE_PUBLIC"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_HOST" "mkdir -p $REMOTE_PUBLIC"
rsync -az -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" \
  --delete \
  "$MATH_SRC/out/" "$SSH_HOST:$REMOTE_PUBLIC/"

echo "[nginx] temporary HTTP config for math.restyart.com"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_HOST" bash -lc "sudo tee /etc/nginx/conf.d/math-restyart.conf >/dev/null <<'EOF'
server {
    listen 80;
    server_name math.restyart.com;

    location / {
        proxy_pass http://127.0.0.1:$REMOTE_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
sudo nginx -t
sudo systemctl reload nginx
"

echo "[certbot] SSL for math.restyart.com"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_HOST" "sudo certbot --nginx -d math.restyart.com"

echo "[nginx] finalize HTTPS config for math.restyart.com"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "$SSH_HOST" bash -lc "sudo tee /etc/nginx/conf.d/math-restyart.conf >/dev/null <<'EOF'
server {
    listen 443 ssl;
    server_name math.restyart.com;

    ssl_certificate /etc/letsencrypt/live/math.restyart.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/math.restyart.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:$REMOTE_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 80;
    server_name math.restyart.com;
    return 301 https://\$host\$request_uri;
}
EOF
sudo nginx -t
sudo systemctl reload nginx
"

echo "[done] https://math.restyart.com"
