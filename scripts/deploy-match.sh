#!/usr/bin/env bash
# match.restyart.com — 동네알바 Next.js standalone (Docker :3024)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/match"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP="/opt/resty-gateway/apps/match"
REMOTE_PORT="${MATCH_PORT:-3024}"
DOMAIN="${MATCH_DOMAIN:-match.restyart.com}"

echo "[build] match"
pushd "$APP_DIR" >/dev/null
if [ ! -d node_modules ]; then
  npm install --legacy-peer-deps
fi
npm run build
popd >/dev/null

STANDALONE="$APP_DIR/.next/standalone"
[ -d "$STANDALONE" ] || { echo "[ERROR] missing .next/standalone — set output:'standalone' in next.config" >&2; exit 1; }

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
  "$APP_DIR/package.json" "$HOST:$REMOTE_APP/package.json"
rsync "${RSYNC_OPTS[@]}" \
  "$APP_DIR/Dockerfile" "$HOST:$REMOTE_APP/Dockerfile"

echo "[docker] build & run match on :$REMOTE_PORT"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" bash -s <<EOF
set -euo pipefail
cd $REMOTE_APP
docker build -t match-app .
docker rm -f match 2>/dev/null || true
docker run -d --name match --restart unless-stopped \
  -p 127.0.0.1:$REMOTE_PORT:3024 \
  match-app
docker ps --filter name=match
EOF

echo "[done] https://$DOMAIN"
curl -sS -o /dev/null -w "logo %{http_code} %{size_download}\n" "https://$DOMAIN/logo-mark.png" || true
