#!/usr/bin/env bash
set -euo pipefail

# copy_all.sh
# Copy all projects listed in ../opt_list.txt into common/assembled_copies

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OPT_FILE="$BASE_DIR/opt_list.txt"
DEST_DIR="$BASE_DIR/common/assembled_copies"

mkdir -p "$DEST_DIR"

if [ ! -f "$OPT_FILE" ]; then
  echo "opt_list.txt not found at $OPT_FILE" >&2
  exit 1
fi

created=0
skipped=0
while IFS= read -r line || [ -n "$line" ]; do
  proj=$(printf '%s' "$line" | sed -e 's/^[[:space:]]*//;s/[[:space:]]*$//')
  [ -z "$proj" ] && continue
  src="$BASE_DIR/$proj"
  dest="$DEST_DIR/$proj"
  if [ ! -d "$src" ]; then
    echo "[SKIP] source not found: $src"
    skipped=$((skipped+1))
    continue
  fi
  if [ -e "$dest" ]; then
    echo "[SKIP] dest exists: $dest"
    skipped=$((skipped+1))
    continue
  fi
  echo "[COPY] $proj -> $dest"
  rsync -a "$src/" "$dest/"
  created=$((created+1))
done < "$OPT_FILE"

echo
echo "Summary: created=$created skipped=$skipped"
du -sh "$DEST_DIR" || true
