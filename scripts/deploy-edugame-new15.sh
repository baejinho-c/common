#!/usr/bin/env bash
# 신규 에듀게임 15종 — 반짝반짝 시리즈와 동일한 SAN 인증서 + 통합 Nginx 구성
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
node "$BASE_DIR/edugame/scripts/sync-standalone-game-seo.js"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_PORT="${EDUGAME_PORT:-3027}"
CONF="/etc/nginx/conf.d/edugame-new15.conf"
CERT_NAME="balance-game.restyart.com"

DOMAINS=(
  balance-game.restyart.com
  bus.restyart.com
  ddongbi.restyart.com
  emotion.restyart.com
  fire.restyart.com
  pizza.restyart.com
  measure.restyart.com
  rhythm-band.restyart.com
  sentence.restyart.com
  weather-fairy.restyart.com
  code-robot.restyart.com
  decal.restyart.com
  paint.restyart.com
  sand.restyart.com
  collage.restyart.com
  spinart.restyart.com
  cupcake.restyart.com
  blow.restyart.com
  splatter.restyart.com
  spinning.restyart.com
  nyang.restyart.com
  firework.restyart.com
  firefly.restyart.com
  memory.restyart.com
  memory-pop.restyart.com
  memory-hanja.restyart.com
  hamster.restyart.com
)
SERVER_NAMES="${DOMAINS[*]}"
RETIRED_SERVER_NAMES="kongkong.restyart.com rhythm-jump.restyart.com"
CERT_DOMAINS=("${DOMAINS[@]}" kongkong.restyart.com rhythm-jump.restyart.com)

write_http_config() {
  ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
    "CONF='$CONF' REMOTE_PORT='$REMOTE_PORT' SERVER_NAMES='$SERVER_NAMES' RETIRED_SERVER_NAMES='$RETIRED_SERVER_NAMES' bash -s" <<'REMOTE'
set -euo pipefail
sudo tee "$CONF" >/dev/null <<EOF
map \$host \$new15_entry {
    default /minigames/balance-game/index.html;
    balance-game.restyart.com /minigames/balance-game/index.html;
    bus.restyart.com /minigames/bus-stop/index.html;
    ddongbi.restyart.com /minigames/ddongbi-daesodong/index.html;
    emotion.restyart.com /minigames/feelings-traffic/index.html;
    fire.restyart.com /minigames/fire-safety/index.html;
    pizza.restyart.com /minigames/fraction-pizza/index.html;
    measure.restyart.com /minigames/measure-detective/index.html;
    rhythm-band.restyart.com /minigames/rhythm-band/index.html;
    sentence.restyart.com /minigames/sentence-blocks/index.html;
    weather-fairy.restyart.com /minigames/weather-fairy/index.html;
    code-robot.restyart.com /minigames/code-robot/index.html;
    decal.restyart.com /minigames/decalcomania/index.html;
    paint.restyart.com /minigames/paint-squish/index.html;
    sand.restyart.com /minigames/paint-sand/index.html;
    collage.restyart.com /minigames/paint-collage/index.html;
    spinart.restyart.com /minigames/paint-spin/index.html;
    cupcake.restyart.com /minigames/paint-cupcake/index.html;
    blow.restyart.com /minigames/paint-blow/index.html;
    splatter.restyart.com /minigames/paint-splatter/index.html;
    spinning.restyart.com /minigames/spinning-top/index.html;
    nyang.restyart.com /minigames/nyang-hide/index.html;
    firework.restyart.com /minigames/firework-night/index.html;
    firefly.restyart.com /minigames/firefly-river/index.html;
    memory.restyart.com /minigames/memory-words/index.html;
    memory-pop.restyart.com /minigames/memory-pop/index.html;
    memory-hanja.restyart.com /minigames/memory-hanja/index.html;
    hamster.restyart.com /minigames/hamster-power/index.html;
}
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAMES;
    location = / {
        proxy_pass http://127.0.0.1:${REMOTE_PORT}\$new15_entry;
        proxy_set_header Host edugame.restyart.com;
        add_header Cache-Control "no-cache, must-revalidate" always;
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com" always;
    }
    location /minigames/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host edugame.restyart.com;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name $RETIRED_SERVER_NAMES;
    return 410;
}
EOF
sudo nginx -t
sudo systemctl reload nginx
REMOTE
}

write_https_config() {
  ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
    "CONF='$CONF' REMOTE_PORT='$REMOTE_PORT' SERVER_NAMES='$SERVER_NAMES' RETIRED_SERVER_NAMES='$RETIRED_SERVER_NAMES' CERT_NAME='$CERT_NAME' bash -s" <<'REMOTE'
set -euo pipefail
CERT_DIR="/etc/letsencrypt/live/${CERT_NAME}"
sudo tee "$CONF" >/dev/null <<EOF
map \$host \$new15_entry {
    default /minigames/balance-game/index.html;
    balance-game.restyart.com /minigames/balance-game/index.html;
    bus.restyart.com /minigames/bus-stop/index.html;
    ddongbi.restyart.com /minigames/ddongbi-daesodong/index.html;
    emotion.restyart.com /minigames/feelings-traffic/index.html;
    fire.restyart.com /minigames/fire-safety/index.html;
    pizza.restyart.com /minigames/fraction-pizza/index.html;
    measure.restyart.com /minigames/measure-detective/index.html;
    rhythm-band.restyart.com /minigames/rhythm-band/index.html;
    sentence.restyart.com /minigames/sentence-blocks/index.html;
    weather-fairy.restyart.com /minigames/weather-fairy/index.html;
    code-robot.restyart.com /minigames/code-robot/index.html;
    decal.restyart.com /minigames/decalcomania/index.html;
    paint.restyart.com /minigames/paint-squish/index.html;
    sand.restyart.com /minigames/paint-sand/index.html;
    collage.restyart.com /minigames/paint-collage/index.html;
    spinart.restyart.com /minigames/paint-spin/index.html;
    cupcake.restyart.com /minigames/paint-cupcake/index.html;
    blow.restyart.com /minigames/paint-blow/index.html;
    splatter.restyart.com /minigames/paint-splatter/index.html;
    spinning.restyart.com /minigames/spinning-top/index.html;
    nyang.restyart.com /minigames/nyang-hide/index.html;
    firework.restyart.com /minigames/firework-night/index.html;
    firefly.restyart.com /minigames/firefly-river/index.html;
    memory.restyart.com /minigames/memory-words/index.html;
    memory-pop.restyart.com /minigames/memory-pop/index.html;
    memory-hanja.restyart.com /minigames/memory-hanja/index.html;
    hamster.restyart.com /minigames/hamster-power/index.html;
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
        proxy_pass http://127.0.0.1:${REMOTE_PORT}\$new15_entry;
        proxy_set_header Host edugame.restyart.com;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "no-cache, must-revalidate" always;
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com" always;
    }
    location /minigames/ {
        proxy_pass http://127.0.0.1:${REMOTE_PORT};
        proxy_set_header Host edugame.restyart.com;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAMES;
    return 301 https://\$host\$request_uri;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $RETIRED_SERVER_NAMES;
    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    return 410;
}
server {
    listen 80;
    listen [::]:80;
    server_name $RETIRED_SERVER_NAMES;
    return 410;
}
EOF
sudo nginx -t
sudo systemctl reload nginx
REMOTE
}

echo "[nginx] 신규 15개 도메인 HTTP 구성"
write_http_config

CERTBOT_ARGS=()
for domain in "${CERT_DOMAINS[@]}"; do CERTBOT_ARGS+=(-d "$domain"); done
if ! ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo test -f /etc/letsencrypt/live/${CERT_NAME}/fullchain.pem && sudo openssl x509 -in /etc/letsencrypt/live/${CERT_NAME}/fullchain.pem -noout -text | grep -q 'DNS:hamster.restyart.com'"; then
  echo "[tls] 신규 도메인을 포함해 SAN 인증서 발급/확장"
  ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
    "sudo certbot certonly --nginx --non-interactive --agree-tos --register-unsafely-without-email --cert-name '${CERT_NAME}' --expand ${CERTBOT_ARGS[*]}"
fi

echo "[nginx] 통합 HTTPS 구성"
write_https_config

for domain in "${DOMAINS[@]}"; do
  code="000"
  for attempt in 1 2 3 4 5; do
    code="$(curl -sS -o /dev/null -w '%{http_code}' "https://${domain}/" || true)"
    [ "$code" = "200" ] && break
    sleep 1
  done
  echo "[probe] $domain $code"
  [ "$code" = "200" ]
done

echo "[done] 신규 에듀게임 15종 SAN HTTPS 배포 완료"
