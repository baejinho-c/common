#!/usr/bin/env bash
set -uo pipefail
COMMON="$(cd "$(dirname "$0")/.." && pwd)"
LOG="/tmp/resty-publish-batch.log"
: > "$LOG"

TENANTS=(
  book-review calli chemistry goodprice growup healing history hotfeel
  idea insect jjreview klocal korean linker logo mind mindmap mud mypage
  physics plot portfolio qbank qbox research sight sim sosofarm special
  trace trips vibe video vtest wish youtube-vo
  arc brochure care classic crm dummy flower gpt light reading save smart vibecommunity
)

OK=()
FAIL=()

for t in "${TENANTS[@]}"; do
  echo "[$(date +%H:%M:%S)] publish $t" | tee -a "$LOG"
  if "$COMMON/publish.sh" "$t" >> "$LOG" 2>&1; then
    OK+=("$t")
    echo "  OK $t" >> "$LOG"
  else
    FAIL+=("$t")
    echo "  FAIL $t" >> "$LOG"
  fi
done

echo "OK (${#OK[@]}): ${OK[*]}" | tee -a "$LOG"
echo "FAIL (${#FAIL[@]}): ${FAIL[*]}" | tee -a "$LOG"
