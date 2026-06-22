#!/usr/bin/env bash
# nginx *.restyart.com 테넌트 → :4000 게이트웨이 일괄 전환
set -euo pipefail

NGINX_CONF="${NGINX_CONF:-/etc/nginx/nginx.conf}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run with sudo" >&2
  exit 1
fi

cp "$NGINX_CONF" "${NGINX_CONF}.bak-gateway-$(date +%Y%m%d%H%M%S)"

python3 <<'PY'
import re, urllib.request, json

nginx_path = "/etc/nginx/nginx.conf"
published = set()
try:
    with urllib.request.urlopen("http://127.0.0.1:4000/api/published") as r:
        data = json.load(r)
        published = {p["slug"] for p in data.get("published", [])}
except Exception as e:
    raise SystemExit(f"gateway /api/published failed: {e}")

skip = {"app", "play", "mud", "tech", "dev", "trips", "hike"}
target = published - skip

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

# split server blocks
parts = re.split(r'(?=server\s*\{)', text)
out = []
migrated = []

for part in parts:
    if not part.strip().startswith("server"):
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
    if not slug or slug not in target:
        out.append(part)
        continue
    new = part
    if re.search(r"proxy_pass\s+http://localhost:\d+;", new):
        new = re.sub(
            r"proxy_pass\s+http://localhost:\d+;",
            "proxy_pass http://127.0.0.1:4000;",
            new,
            count=1,
        )
    elif "listen 443" in new and re.search(r"location\s+/\s*\{[^}]*root\s+/opt/", new, re.DOTALL):
        new = re.sub(
            r"location\s+/\s*\{[^}]*root\s+/opt/[^;]+;[^}]*try_files[^}]+\}",
            proxy_loc,
            new,
            count=1,
            flags=re.DOTALL,
        )
    else:
        out.append(part)
        continue
    if new != part:
        migrated.append(slug)
    out.append(new)

with open(nginx_path, "w") as f:
    f.write("".join(out))

print(f"[migrated] {len(migrated)} tenants")
print(" ".join(sorted(migrated)))
print(f"[skip] {sorted(skip)}")
print(f"[published] {len(published)} total")
PY

nginx -t
echo "[done] reload: systemctl reload nginx"
