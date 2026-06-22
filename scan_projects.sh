#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BASE_DIR"

OPT_FILE="$BASE_DIR/opt_list.txt"
if [ ! -f "$OPT_FILE" ]; then
  echo "opt_list.txt not found in $BASE_DIR" >&2
  exit 1
fi

printf "Project\tDu\tpackage.json\tHints (next/react/express/start/build)\n"
while IFS= read -r d || [ -n "$d" ]; do
  d_trim=$(printf '%s' "$d" | sed -e 's/^[[:space:]]*//;s/[[:space:]]*$//')
  [ -z "$d_trim" ] && continue
  printf "%s\t" "$d_trim"
  if [ -d "$d_trim" ]; then
    du_out=$(du -sh "$d_trim" 2>/dev/null | awk '{print $1}') || du_out="?"
    printf "%s\t" "$du_out"
  else
    printf "MISSING\t"
  fi
  if [ -f "$d_trim/package.json" ]; then
    printf "yes\t"
    hints=$(grep -E '"(next|react|express|vue|svelte|start|build)"' -n "$d_trim/package.json" 2>/dev/null | sed -n '1,6p' | tr '\n' '|' )
    hints=${hints:--}
    printf "%s\n" "$hints"
  else
    printf "no\t-\n"
  fi
done < "$OPT_FILE"
