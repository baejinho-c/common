#!/usr/bin/env bash
# comic-studio.restyart.com — 정적 게이트웨이 배포 (:4000)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"

echo "[publish] comic-studio (static export)"
bash "$COMMON_DIR/publish.sh" comic-studio

echo "[rsync] to server"
bash "$COMMON_DIR/scripts/rsync-to-server.sh"

echo "[done] https://comic-studio.restyart.com"
