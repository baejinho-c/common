#!/usr/bin/env bash
# publish-batch.sh — 미배포 테넌트 일괄 publish + 결과 로그
set -uo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMMON_DIR="$BASE_DIR/common"
PUBLIC_DIR="$COMMON_DIR/public"
LOG="$COMMON_DIR/publish-batch.log"
FAILED="$COMMON_DIR/publish-failed.txt"
OK="$COMMON_DIR/publish-ok.txt"

: > "$LOG"
: > "$FAILED"
: > "$OK"

UNPUBLISHED=(
  cafe career classic crm english food foodsns gpt growup healing hotfeel hvalue
  jjreview klocal library light linker logo mind mindmap mypage physics plot
  qbank qbox reading recipe resume save search special story today vibe vtest wish
  youtube youtube-vo
)

echo "=== publish batch $(date -Iseconds) ===" | tee -a "$LOG"
total=${#UNPUBLISHED[@]}
n=0

for name in "${UNPUBLISHED[@]}"; do
  n=$((n + 1))
  if [ -f "$PUBLIC_DIR/$name/index.html" ]; then
    echo "[$n/$total] SKIP $name (already has index.html)" | tee -a "$LOG"
    echo "$name" >> "$OK"
    continue
  fi
  echo "[$n/$total] START $name" | tee -a "$LOG"
  if "$COMMON_DIR/publish.sh" "$name" >> "$LOG" 2>&1; then
    echo "[$n/$total] OK $name" | tee -a "$LOG"
    echo "$name" >> "$OK"
  else
    code=$?
    echo "[$n/$total] FAIL $name (exit $code)" | tee -a "$LOG"
    echo "$name" >> "$FAILED"
  fi
done

echo "=== done ok=$(wc -l < "$OK" | tr -d ' ') fail=$(wc -l < "$FAILED" | tr -d ' ') ===" | tee -a "$LOG"
