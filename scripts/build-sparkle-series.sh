#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SOURCE_DIR="$BASE_DIR/_imports/sparkle-series"
EDUGAME_DIR="$BASE_DIR/edugame"
OUTPUT_DIR="$EDUGAME_DIR/public/minigames/sparkle"
ASSET_DIR="$EDUGAME_DIR/public/sparkle-assets"

if [ ! -d "$SOURCE_DIR" ] || [ ! -d "$EDUGAME_DIR/node_modules" ]; then
  echo "[ERROR] sparkle source or edugame dependencies missing" >&2
  exit 1
fi

if [ ! -e "$SOURCE_DIR/node_modules" ]; then
  ln -s ../../edugame/node_modules "$SOURCE_DIR/node_modules"
fi

echo "[build] sparkle series static export"
(cd "$SOURCE_DIR" && ./node_modules/.bin/next build --webpack)

echo "[assets] optimize shared game images"
ASSET_STAGE="$(mktemp -d)"
cleanup() { rm -rf "$ASSET_STAGE"; }
trap cleanup EXIT
node "$SOURCE_DIR/scripts/optimize-assets.mjs" "$SOURCE_DIR/public/images" "$ASSET_STAGE"
mkdir -p "$ASSET_DIR"
rsync -a --delete "$ASSET_STAGE/" "$ASSET_DIR/"

echo "[copy] static app -> edugame public"
mkdir -p "$OUTPUT_DIR"
rsync -a --delete --exclude 'images/' "$SOURCE_DIR/out/" "$OUTPUT_DIR/"

du -sh "$OUTPUT_DIR" "$ASSET_DIR"
echo "[done] /minigames/sparkle/"
