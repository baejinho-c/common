#!/usr/bin/env bash
# read.restyart.com — static read detective landing via common gateway
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"

echo "[rsync] public/read -> $HOST:/opt/resty-gateway/common/public/read/"
RSYNC_OPTS=(-az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new")
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "mkdir -p /opt/resty-gateway/common/public/read"
rsync "${RSYNC_OPTS[@]}" --delete \
  "$COMMON_DIR/public/read/" "$HOST:/opt/resty-gateway/common/public/read/"

echo "[nginx] install read vhost"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<'NGINX'
set -euo pipefail
sudo tee /etc/nginx/conf.d/read-restyart.conf >/dev/null <<'EOF'
# read.restyart.com → common static reader under /read/
server {
    listen 80;
    server_name read.restyart.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
sudo nginx -t && sudo systemctl reload nginx
NGINX

echo "[certbot] SSL for read.restyart.com"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<'CERT'
set -euo pipefail
sudo certbot --nginx -d read.restyart.com --non-interactive --agree-tos -m support@restyart.com || true
sudo nginx -t && sudo systemctl reload nginx
CERT

echo "[done] https://read.restyart.com"
