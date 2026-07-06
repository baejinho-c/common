#!/usr/bin/env bash
# comic-studio.restyart.com → 게이트웨이 :4000 (정적)
set -euo pipefail

KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"

ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<'REMOTE'
set -euo pipefail
CONF=/etc/nginx/conf.d/comic-restyart.conf
sudo tee "$CONF" >/dev/null <<'EOF'
# comic-studio.restyart.com → common gateway :4000
server {
    server_name comic-studio.restyart.com;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/comic-studio.restyart.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/comic-studio.restyart.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = comic-studio.restyart.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name comic-studio.restyart.com;
    return 404;
}
EOF
sudo nginx -t && sudo systemctl reload nginx

# Docker 컨테이너 정리
docker rm -f comic-studio 2>/dev/null || true
docker rm -f youtube 2>/dev/null || true

echo "[docker] remaining containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
REMOTE

echo "[done] comic-studio static + youtube docker removed"
