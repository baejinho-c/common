#!/usr/bin/env bash
# 서버: /opt/{tenant}/source 에서 git pull (인자 없으면 opt_list.txt)
set -uo pipefail

OPT_ROOT="${OPT_ROOT:-/opt}"
LIST_FILE="${LIST_FILE:-/opt/resty-gateway/common/../opt_list.txt}"
BRANCH="${BRANCH:-main}"

if [ "$#" -gt 0 ]; then
  TENANTS=("$@")
elif [ -f "$LIST_FILE" ]; then
  mapfile -t TENANTS < <(grep -v '^#' "$LIST_FILE" | grep -v '^$' || true)
else
  mapfile -t TENANTS < <(ls -1 "$OPT_ROOT" 2>/dev/null || true)
fi

ok=0
skip=0
fail=0

for name in "${TENANTS[@]}"; do
  src="$OPT_ROOT/$name/source"
  if [ ! -d "$src/.git" ]; then
    echo "[SKIP] $name — no git at $src"
    skip=$((skip + 1))
    continue
  fi
  git config --global --add safe.directory "$src" 2>/dev/null || true
  echo "[PULL] $name"
  if git -C "$src" fetch origin "$BRANCH" && git -C "$src" reset --hard "origin/$BRANCH"; then
    ok=$((ok + 1))
  else
    echo "[FAIL] $name" >&2
    fail=$((fail + 1))
  fi
done

echo "=== pull done: ok=$ok skip=$skip fail=$fail ==="
