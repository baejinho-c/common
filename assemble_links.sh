#!/usr/bin/env bash
set -euo pipefail

# assemble_links.sh
# Create common/assembled and symlink projects listed in ../opt_list.txt (or args)

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ASSEMBLED_DIR="$BASE_DIR/common/assembled"
OPT_FILE="$BASE_DIR/opt_list.txt"

if [ "$#" -gt 0 ]; then
  projects="$@"
else
  if [ -f "$OPT_FILE" ]; then
    projects=$(sed -e 's/^[[:space:]]*//;s/[[:space:]]*$//' "$OPT_FILE" | sed '/^$/d')
  else
    echo "No opt_list.txt and no projects provided." >&2
    exit 1
  fi
fi

mkdir -p "$ASSEMBLED_DIR"

echo "Assembling into $ASSEMBLED_DIR"
n_created=0
n_skipped=0
while IFS= read -r name; do
  [ -z "$name" ] && continue
  src="$BASE_DIR/$name"
  dest="$ASSEMBLED_DIR/$name"
  if [ ! -e "$src" ]; then
    echo "  - source not found: $src -> skipping"
    n_skipped=$((n_skipped+1))
    continue
  fi
  if [ -e "$dest" ]; then
    echo "  - exists: $dest -> skipping"
    n_skipped=$((n_skipped+1))
    continue
  fi
  # create relative symlink
  pushd "$ASSEMBLED_DIR" >/dev/null
  ln -s "../$name" "$name"
  popd >/dev/null
  echo "  - linked: $name"
  n_created=$((n_created+1))
done <<EOF
$projects
EOF

echo "Done. created=$n_created skipped=$n_skipped"
