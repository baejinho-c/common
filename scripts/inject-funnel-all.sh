#!/usr/bin/env bash
# published 테넌트 HTML에 퍼널 푸터 일괄 주입 (재빌드 없이)
set -euo pipefail

COMMON_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC_DIR="$COMMON_DIR/public"
SKIP="${SKIP_TENANTS:-wookwang app}"

count=0
for dir in "$PUBLIC_DIR"/*/; do
  tenant=$(basename "$dir")
  [[ "$tenant" == .* ]] && continue
  echo "$SKIP" | grep -qw "$tenant" && continue
  [ -f "$dir/index.html" ] || continue
  node "$COMMON_DIR/inject-legal.js" "$dir" "$tenant"
  count=$((count + 1))
done

echo "[inject-funnel-all] done: $count tenants"
