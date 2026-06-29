#!/usr/bin/env bash
# 테넌트 서브도메인 nginx + certbot SSL 일괄 발급/갱신
# Usage: sudo ./provision-tenant-ssl.sh [domain1 domain2 ...]
#        sudo ./provision-tenant-ssl.sh --from-public   # public/ 디렉터리 기준 미발급만
#        sudo ./provision-tenant-ssl.sh --renew-expired
set -euo pipefail

EMAIL="${CERTBOT_EMAIL:-baeno@nate.com}"
GATEWAY_PORT="${GATEWAY_PORT:-4000}"
CONF_DIR="/etc/nginx/conf.d"
PUBLIC_DIR="${PUBLIC_DIR:-/opt/resty-gateway/common/public}"
NGINX_MAIN="/etc/nginx/nginx.conf"

proxy_block() {
  cat <<EOF
    location / {
        proxy_pass http://127.0.0.1:${GATEWAY_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
EOF
}

write_http_conf() {
  local domain="$1"
  local slug="${domain%.restyart.com}"
  local conf="${CONF_DIR}/${slug}-restyart.conf"
  if [ -f "$conf" ]; then
    echo "[skip-conf] $conf exists"
    return 0
  fi
  if grep -rq "server_name.*${domain}" /etc/nginx/ 2>/dev/null; then
    echo "[skip-conf] $domain already in nginx"
    return 0
  fi
  echo "[write-conf] $conf"
  cat >"$conf" <<EOF
# ${domain} → resty-gateway :${GATEWAY_PORT}
server {
    listen 80;
    server_name ${domain};
$(proxy_block)
}
EOF
}

cert_valid() {
  local domain="$1"
  local cert="/etc/letsencrypt/live/${domain}/fullchain.pem"
  [ -f "$cert" ] || return 1
  openssl x509 -checkend 86400 -noout -in "$cert" >/dev/null 2>&1
}

issue_cert() {
  local domain="$1"
  echo "[certbot] $domain"
  certbot --nginx -d "$domain" \
    --non-interactive --agree-tos --email "$EMAIL" \
    --redirect \
    || certbot certonly --nginx -d "$domain" \
      --non-interactive --agree-tos --email "$EMAIL"
}

renew_cert() {
  local domain="$1"
  echo "[renew] $domain"
  certbot renew --cert-name "$domain" --non-interactive || issue_cert "$domain"
}

collect_from_public() {
  local skip='^(404|500|_next|app|auth|r|dashboard|analytics|favicon|apple|android|mstile|og-|placeholder|safari|site\.|browser|contact|credits|generate|interview|privacy|profile|problem|solve|terms|wrong|app\.js|.*\.(html|xml|png|jpg|svg|js))'
  find "$PUBLIC_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort | while read -r slug; do
    [[ "$slug" =~ $skip ]] && continue
    echo "${slug}.restyart.com"
  done
}

DOMAINS=()
if [ "${1:-}" = "--from-public" ]; then
  mapfile -t DOMAINS < <(collect_from_public)
elif [ "${1:-}" = "--renew-expired" ]; then
  mapfile -t DOMAINS < <(certbot certificates 2>/dev/null | awk '/Certificate Name:/{n=$3} /INVALID: EXPIRED/{print n}')
else
  DOMAINS=("$@")
fi

if [ "${#DOMAINS[@]}" -eq 0 ]; then
  echo "Usage: sudo $0 domain.restyart.com ... | --from-public | --renew-expired" >&2
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "Run with sudo" >&2
  exit 1
fi

PROVISIONED=0
SKIPPED=0
FAILED=()

for domain in "${DOMAINS[@]}"; do
  [ -z "$domain" ] && continue
  echo "===== $domain ====="
  write_http_conf "$domain"
  if cert_valid "$domain"; then
    echo "[ok] valid cert exists: $domain"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  if certbot certificates 2>/dev/null | grep -A3 "Certificate Name: ${domain}" | grep -q "INVALID: EXPIRED"; then
    renew_cert "$domain" && PROVISIONED=$((PROVISIONED + 1)) || FAILED+=("$domain")
  else
    issue_cert "$domain" && PROVISIONED=$((PROVISIONED + 1)) || FAILED+=("$domain")
  fi
done

nginx -t
systemctl reload nginx

echo "[done] provisioned=$PROVISIONED skipped=$SKIPPED failed=${#FAILED[@]}"
if [ "${#FAILED[@]}" -gt 0 ]; then
  printf '  %s\n' "${FAILED[@]}"
  exit 1
fi
