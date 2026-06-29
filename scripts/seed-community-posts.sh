#!/usr/bin/env bash
# 커뮤니티 mock 시드 → resty_post DB (idempotent)
set -euo pipefail

API="${SEED_API_URL:-https://app.restyart.com/api/posts/seed}"
SUBDOMAIN="${1:-}"

if [ -n "$SUBDOMAIN" ]; then
  echo "[seed] POST $API (subdomains: $SUBDOMAIN)"
  curl -sS -X POST "$API" \
    -H "Content-Type: application/json" \
    -d "{\"subdomains\":[\"$SUBDOMAIN\"]}" | python3 -m json.tool 2>/dev/null || curl -sS -X POST "$API" -H "Content-Type: application/json" -d "{\"subdomains\":[\"$SUBDOMAIN\"]}"
else
  echo "[seed] POST $API (all tenants)"
  curl -sS -X POST "$API" -H "Content-Type: application/json" -d '{}' | python3 -m json.tool 2>/dev/null || curl -sS -X POST "$API" -H "Content-Type: application/json" -d '{}'
fi

echo ""
