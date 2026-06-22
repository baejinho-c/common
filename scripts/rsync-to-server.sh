#!/usr/bin/env bash
# 로컬: common/public + 게이트웨이 소스를 서버로 동기화
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE="${REMOTE_GATEWAY:-/opt/resty-gateway/common}"

RSYNC_OPTS=(-az --delete-after -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new")

echo "[rsync] public/ -> $HOST:$REMOTE/public/"
rsync "${RSYNC_OPTS[@]}" "$COMMON_DIR/public/" "$HOST:$REMOTE/public/"

echo "[rsync] gateway js (no node_modules, no assembled_copies)"
rsync "${RSYNC_OPTS[@]}" \
  --exclude node_modules \
  --exclude assembled_copies \
  --exclude data \
  --exclude '*.log' \
  "$COMMON_DIR/" "$HOST:$REMOTE/"

echo "[rsync] restart gateway on server"
ssh -i "$KEY" "$HOST" 'sudo systemctl restart resty-gateway 2>/dev/null || echo "install gateway first: bash scripts/install-gateway.sh"'

echo "[rsync] done"
