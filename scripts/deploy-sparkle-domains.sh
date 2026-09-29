#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_PORT="${EDUGAME_PORT:-3027}"
CONF="/etc/nginx/conf.d/sparkle-games.conf"

DOMAINS=(
  spark-badminton.restyart.com
  spark-riding.restyart.com
  spark-boat.restyart.com
  spark-ski.restyart.com
  spark-roller.restyart.com
  spark-kickboard.restyart.com
  spark-goalkeeper.restyart.com
  spark-basketball.restyart.com
  spark-bowling.restyart.com
  spark-hockey.restyart.com
  spark-archery.restyart.com
  spark-tennis.restyart.com
  spark-pingpong.restyart.com
  spark-surfing.restyart.com
  spark-kayak.restyart.com
  spark-rafting.restyart.com
  spark-paddle.restyart.com
)

SERVER_NAMES="${DOMAINS[*]}"

write_http_config() {
  ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
    "CONF='$CONF' REMOTE_PORT='$REMOTE_PORT' SERVER_NAMES='$SERVER_NAMES' bash -s" <<'REMOTE'
set -euo pipefail
sudo tee "$CONF" >/dev/null <<EOF
map \$host \$sparkle_entry {
    default /minigames/sparkle/index.html;
    spark-badminton.restyart.com /minigames/sparkle/badminton/index.html;
    spark-riding.restyart.com /minigames/sparkle/riding/index.html;
    spark-boat.restyart.com /minigames/sparkle/boat/index.html;
    spark-ski.restyart.com /minigames/sparkle/runner/ski/index.html;
    spark-roller.restyart.com /minigames/sparkle/runner/roller/index.html;
    spark-kickboard.restyart.com /minigames/sparkle/runner/kickboard/index.html;
    spark-goalkeeper.restyart.com /minigames/sparkle/reaction/goalkeeper/index.html;
    spark-basketball.restyart.com /minigames/sparkle/target/basketball/index.html;
    spark-bowling.restyart.com /minigames/sparkle/target/bowling/index.html;
    spark-hockey.restyart.com /minigames/sparkle/target/hockey/index.html;
    spark-archery.restyart.com /minigames/sparkle/target/archery/index.html;
    spark-tennis.restyart.com /minigames/sparkle/racket/tennis/index.html;
    spark-pingpong.restyart.com /minigames/sparkle/racket/pingpong/index.html;
    spark-surfing.restyart.com /minigames/sparkle/balance/surfing/index.html;
    spark-kayak.restyart.com /minigames/sparkle/alternate/kayak/index.html;
    spark-rafting.restyart.com /minigames/sparkle/alternate/rafting/index.html;
    spark-paddle.restyart.com /minigames/sparkle/balance/paddle/index.html;
}

server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAMES;

    location = / {
        proxy_pass http://127.0.0.1:${REMOTE_PORT}\$sparkle_entry;
        proxy_set_header Host edugame.restyart.com;
        add_header Cache-Control "no-cache, must-revalidate" always;
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com" always;
    }
    location /minigames/sparkle/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host edugame.restyart.com;
    }
    location /sparkle-assets/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host edugame.restyart.com;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=2592000, immutable" always;
    }
}
EOF
sudo nginx -t
sudo systemctl reload nginx
REMOTE
}

write_https_config() {
  ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
    "CONF='$CONF' REMOTE_PORT='$REMOTE_PORT' SERVER_NAMES='$SERVER_NAMES' bash -s" <<'REMOTE'
set -euo pipefail
CERT_DIR=/etc/letsencrypt/live/spark-badminton.restyart.com
sudo tee "$CONF" >/dev/null <<EOF
map \$host \$sparkle_entry {
    default /minigames/sparkle/index.html;
    spark-badminton.restyart.com /minigames/sparkle/badminton/index.html;
    spark-riding.restyart.com /minigames/sparkle/riding/index.html;
    spark-boat.restyart.com /minigames/sparkle/boat/index.html;
    spark-ski.restyart.com /minigames/sparkle/runner/ski/index.html;
    spark-roller.restyart.com /minigames/sparkle/runner/roller/index.html;
    spark-kickboard.restyart.com /minigames/sparkle/runner/kickboard/index.html;
    spark-goalkeeper.restyart.com /minigames/sparkle/reaction/goalkeeper/index.html;
    spark-basketball.restyart.com /minigames/sparkle/target/basketball/index.html;
    spark-bowling.restyart.com /minigames/sparkle/target/bowling/index.html;
    spark-hockey.restyart.com /minigames/sparkle/target/hockey/index.html;
    spark-archery.restyart.com /minigames/sparkle/target/archery/index.html;
    spark-tennis.restyart.com /minigames/sparkle/racket/tennis/index.html;
    spark-pingpong.restyart.com /minigames/sparkle/racket/pingpong/index.html;
    spark-surfing.restyart.com /minigames/sparkle/balance/surfing/index.html;
    spark-kayak.restyart.com /minigames/sparkle/alternate/kayak/index.html;
    spark-rafting.restyart.com /minigames/sparkle/alternate/rafting/index.html;
    spark-paddle.restyart.com /minigames/sparkle/balance/paddle/index.html;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $SERVER_NAMES;

    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location = / {
        proxy_pass http://127.0.0.1:${REMOTE_PORT}\$sparkle_entry;
        proxy_set_header Host edugame.restyart.com;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-cache, must-revalidate" always;
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com" always;
    }
    location /minigames/sparkle/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host edugame.restyart.com;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }
    location /sparkle-assets/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host edugame.restyart.com;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=2592000, immutable" always;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAMES;
    return 301 https://\$host\$request_uri;
}
EOF
sudo nginx -t
sudo systemctl reload nginx
REMOTE
}

echo "[nginx] configure 17 sparkle domains over HTTP"
write_http_config

CERTBOT_ARGS=()
for domain in "${DOMAINS[@]}"; do CERTBOT_ARGS+=(-d "$domain"); done
if ! ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo test -f /etc/letsencrypt/live/spark-badminton.restyart.com/fullchain.pem"; then
  echo "[tls] issue one SAN certificate for 17 domains"
  ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
    "sudo certbot certonly --nginx --non-interactive --agree-tos --register-unsafely-without-email ${CERTBOT_ARGS[*]}"
fi

echo "[nginx] enable HTTPS"
write_https_config

for domain in "${DOMAINS[@]}"; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "https://${domain}/" || true)"
  echo "$domain $code"
done
