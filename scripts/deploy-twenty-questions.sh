#!/usr/bin/env bash
# twenty-questions — 스무고개 놀이
set -euo pipefail
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP=/opt/resty-gateway/apps/edugame
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_DIR="$ROOT/edugame/public/minigames/twenty-questions"
ICON="$ROOT/edugame/public/icons/twenty-questions-v1.png"

echo "[rsync] twenty-questions"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$APP_DIR/" "$HOST:$REMOTE_APP/public/minigames/twenty-questions/"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$ICON" "$HOST:$REMOTE_APP/public/icons/twenty-questions-v1.png"

ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "CID=\$(docker ps --filter name=edugame --format '{{.ID}}' | head -1); \
   docker exec \"\$CID\" mkdir -p /app/public/minigames/twenty-questions/images /app/public/icons; \
   docker cp $REMOTE_APP/public/minigames/twenty-questions/. \"\$CID:/app/public/minigames/twenty-questions/\"; \
   docker cp $REMOTE_APP/public/icons/twenty-questions-v1.png \"\$CID:/app/public/icons/twenty-questions-v1.png\"; \
   docker restart edugame"

cd "$ROOT/edugame"
node scripts/publish-catalog-game.mjs --id=twenty-questions --icon="$ICON"
echo "[done] https://edugame.restyart.com/minigames/twenty-questions/index.html?v=20260901h"
