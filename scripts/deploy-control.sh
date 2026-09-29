#!/usr/bin/env bash
# control.restyart.com — 조작 연구소 (Next static export)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMON_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BASE_DIR="$(cd "$COMMON_DIR/.." && pwd)"
APP_DIR="$BASE_DIR/control"
ICON_SRC="$BASE_DIR/edugame/public/icons/control-lab.png"
KEY="${SSH_KEY:-$HOME/Downloads/sports.pem}"
HOST="${SSH_HOST:-ec2-user@app.restyart.com}"
DOMAIN="${CONTROL_DOMAIN:-control.restyart.com}"
REMOTE_WWW="/var/www/control"
CONF="/etc/nginx/conf.d/control-restyart.conf"

if [ ! -f "$APP_DIR/package.json" ]; then
  echo "[ERROR] missing $APP_DIR/package.json" >&2
  exit 1
fi

echo "[build] control (static export)"
pushd "$APP_DIR" >/dev/null
if [ ! -d node_modules ]; then
  npm install --legacy-peer-deps
fi
npm run build
popd >/dev/null

OUT="$APP_DIR/out"
if [ ! -f "$OUT/index.html" ]; then
  echo "[ERROR] missing $OUT/index.html — build failed?" >&2
  exit 1
fi

STAGE="$(mktemp -d)"
cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

rsync -a "$OUT/" "$STAGE/"

if [ -f "$ICON_SRC" ]; then
  cp "$ICON_SRC" "$STAGE/icon.png"
  cp "$ICON_SRC" "$STAGE/favicon.ico"
elif [ -f "$STAGE/icon.svg" ]; then
  echo "[info] using project icons"
fi

# mirror into edugame minigames for local reference / backup
MIRROR="$BASE_DIR/edugame/public/minigames/control-lab"
mkdir -p "$MIRROR"
rsync -a --delete \
  --exclude 'README.md' \
  "$OUT/" "$MIRROR/"
if [ -f "$ICON_SRC" ]; then
  cp "$ICON_SRC" "$MIRROR/icon.png"
fi
cat >"$MIRROR/README.md" <<EOF
# control-lab (exported)

Source: \`resty/control/\`  
Deploy: \`./common/scripts/deploy-control.sh\` → https://control.restyart.com

This folder is a static mirror of \`control/out\`. Edit the Next app, not these files.
EOF

cat >"$STAGE/robots.txt" <<EOF
User-agent: *
Allow: /

Sitemap: https://${DOMAIN}/sitemap.xml
EOF

cat >"$STAGE/sitemap.xml" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${DOMAIN}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF

echo "[rsync] control out -> $HOST:$REMOTE_WWW"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo mkdir -p '$REMOTE_WWW' && sudo chown -R ec2-user:ec2-user '$REMOTE_WWW' && sudo chmod 755 '$REMOTE_WWW'"
rsync -az -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  --delete \
  "$STAGE/" "$HOST:$REMOTE_WWW/"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "sudo chown -R ec2-user:ec2-user '$REMOTE_WWW'; find '$REMOTE_WWW' -type d -exec chmod 755 {} +; find '$REMOTE_WWW' -type f -exec chmod 644 {} +"

echo "[nginx] $DOMAIN"
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "DOMAIN='$DOMAIN' REMOTE_WWW='$REMOTE_WWW' CONF='$CONF' bash -s" <<'REMOTE'
set -euo pipefail
HAS_CERT=0
if sudo test -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"; then
  HAS_CERT=1
fi

if [ "$HAS_CERT" = "0" ]; then
  sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${REMOTE_WWW};
    index index.html;
    location / {
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com;" always;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
  sudo nginx -t && sudo systemctl reload nginx
  sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
    --register-unsafely-without-email --redirect || true
fi

sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};
    root ${REMOTE_WWW};
    index index.html;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        add_header Content-Security-Policy "frame-ancestors 'self' https://edugame.restyart.com;" always;
        try_files \$uri \$uri/ \$uri.html /index.html;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}
EOF
sudo nginx -t
sudo systemctl reload nginx
echo "[nginx] conf updated"
REMOTE

echo "[probe] https://$DOMAIN"
curl -sS -o /dev/null -w "home %{http_code}\n" "https://$DOMAIN/" || true
curl -sS -o /dev/null -w "water %{http_code}\n" "https://$DOMAIN/water/" || true
curl -sS -o /dev/null -w "boat %{http_code}\n" "https://$DOMAIN/games/boat.html" || true
echo "[done] https://$DOMAIN"
