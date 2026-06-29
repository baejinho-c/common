#!/usr/bin/env bash
# 특정 테넌트 nginx HTTPS 블록을 :4000 게이트웨이로 전환
set -euo pipefail

NGINX_CONF="${NGINX_CONF:-/etc/nginx/nginx.conf}"
TENANTS=("$@")

if [ "${#TENANTS[@]}" -eq 0 ]; then
  echo "Usage: sudo $0 tenant1 tenant2 ..." >&2
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "Run with sudo" >&2
  exit 1
fi

cp "$NGINX_CONF" "${NGINX_CONF}.bak-tenants-$(date +%Y%m%d%H%M%S)"

python3 - "$NGINX_CONF" "${TENANTS[@]}" <<'PY'
import re, sys

nginx_path = sys.argv[1]
targets = set(sys.argv[2:])

with open(nginx_path) as f:
    text = f.read()

proxy_loc = """location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }"""

parts = re.split(r'(?=server\s*\{)', text)
out = []
migrated = []

for part in parts:
    if not part.strip().startswith("server"):
        out.append(part)
        continue
    if "listen 443" not in part:
        out.append(part)
        continue
    sm = re.search(r"server_name\s+([^;]+);", part)
    if not sm:
        out.append(part)
        continue
    slug = None
    for name in sm.group(1).split():
        m = re.match(r"^([a-z0-9_-]+)\.restyart\.com$", name.strip())
        if m:
            slug = m.group(1)
            break
    if not slug or slug not in targets:
        out.append(part)
        continue
    new = part
    new = re.sub(
        r"location\s+/\s*\{[^}]*proxy_pass[^}]+\}",
        proxy_loc,
        new,
        count=1,
        flags=re.DOTALL,
    )
    new = re.sub(r"\s*proxy_intercept_errors on;[^\n]*\n", "\n", new)
    new = re.sub(r"\s*proxy_next_upstream[^\n]*\n", "\n", new)
    new = re.sub(r"\s*error_page 502[^\n]*\n", "\n", new)
    new = re.sub(r"\n\s*location @wake \{[^}]+\}\s*", "\n", new, flags=re.DOTALL)
    if new != part:
        migrated.append(slug)
    out.append(new)

with open(nginx_path, "w") as f:
    f.write("".join(out))

print("migrated:", ", ".join(sorted(migrated)))
missing = sorted(targets - set(migrated))
if missing:
    print("not found in nginx.conf:", ", ".join(missing))
PY

nginx -t
systemctl reload nginx
echo "[done] nginx reloaded"
