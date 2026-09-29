#!/usr/bin/env bash
# dictation-kids — 받아쓰기 놀이 (edugame minigame)
set -euo pipefail
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP=/opt/resty-gateway/apps/edugame
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_DIR="$ROOT/edugame/public/minigames/dictation-kids"
ICON="$ROOT/edugame/public/icons/dictation-kids-v1.png"

echo "[rsync] dictation-kids"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$APP_DIR/" "$HOST:$REMOTE_APP/public/minigames/dictation-kids/"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$ROOT/edugame/public/minigames/shared/resty-voice.js" \
  "$HOST:$REMOTE_APP/public/minigames/shared/resty-voice.js"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$ICON" "$HOST:$REMOTE_APP/public/icons/dictation-kids-v1.png"

ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "CID=\$(docker ps --filter name=edugame --format '{{.ID}}' | head -1); \
   docker exec \"\$CID\" mkdir -p /app/public/minigames/dictation-kids /app/public/minigames/shared /app/public/icons; \
   docker cp $REMOTE_APP/public/minigames/dictation-kids/. \"\$CID:/app/public/minigames/dictation-kids/\"; \
   docker cp $REMOTE_APP/public/minigames/shared/resty-voice.js \"\$CID:/app/public/minigames/shared/resty-voice.js\"; \
   docker cp $REMOTE_APP/public/icons/dictation-kids-v1.png \"\$CID:/app/public/icons/dictation-kids-v1.png\"; \
   docker restart edugame"

cd "$ROOT/edugame"
node scripts/publish-catalog-game.mjs --id=dictation-kids --icon="$ICON"
echo "[done] https://edugame.restyart.com/minigames/dictation-kids/index.html?v=20260901f"
