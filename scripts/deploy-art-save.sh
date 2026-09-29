#!/usr/bin/env bash
# Deploy art-save helper + exhibit UI for art minigames, then publish catalog URLs.
set -euo pipefail
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
REMOTE_APP=/opt/resty-gateway/apps/edugame
BASE="$(cd "$(dirname "$0")/../../edugame/public/minigames" && pwd)"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

for d in shared paint-splatter paint-blow paint-spin paint-collage; do
  echo "[rsync] $d"
  rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
    "$BASE/$d/" "$HOST:$REMOTE_APP/public/minigames/$d/"
done

# Running edugame is Docker — sync into container and restart so Next serves new static files
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "CID=\$(docker ps --filter name=edugame --format '{{.ID}}' | head -1); \
   docker exec \"\$CID\" mkdir -p /app/public/minigames/shared; \
   docker cp $REMOTE_APP/public/minigames/shared/art-save.js \"\$CID:/app/public/minigames/shared/art-save.js\"; \
   for d in paint-splatter paint-blow paint-spin paint-collage; do \
     docker cp $REMOTE_APP/public/minigames/\$d/index.html \"\$CID:/app/public/minigames/\$d/index.html\"; \
   done; \
   docker restart edugame"

"$ROOT/common/scripts/deploy-scratch.sh"
"$ROOT/common/scripts/deploy-sand-light.sh"

cd "$ROOT/edugame"
for id in paint-splatter paint-blow paint-spin paint-collage scratch-sea sand-light; do
  node scripts/publish-catalog-game.mjs --id="$id"
done
echo "[done] art exhibit deployed"
