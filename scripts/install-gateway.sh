#!/usr/bin/env bash
# 서버에서 common 게이트웨이 최초 설치 (ec2-user 또는 root)
set -euo pipefail

GATEWAY_ROOT="${GATEWAY_ROOT:-/opt/resty-gateway}"
COMMON_DIR="$GATEWAY_ROOT/common"
REPO="${COMMON_REPO:-https://github.com/baejinho-c/common.git}"
SERVICE_NAME="resty-gateway"

echo "[install] gateway root: $GATEWAY_ROOT"

if [ "$(id -u)" -eq 0 ]; then
  mkdir -p "$GATEWAY_ROOT"
  chown ec2-user:ec2-user "$GATEWAY_ROOT"
fi

if [ ! -d "$COMMON_DIR/.git" ]; then
  echo "[install] cloning $REPO"
  git clone "$REPO" "$COMMON_DIR"
else
  echo "[install] pulling latest"
  git -C "$COMMON_DIR" pull origin main
fi

export NVM_DIR="${NVM_DIR:-/home/ec2-user/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
if ! nvm use 16.20.2 2>/dev/null; then
  nvm use 16 2>/dev/null || true
fi
NODE_BIN="${NVM_DIR}/versions/node/v16.20.2/bin"
export PATH="$NODE_BIN:$PATH"
command -v node >/dev/null || { echo "node not found — need nvm Node 16 on Amazon Linux 2"; exit 1; }

cd "$COMMON_DIR"
npm install

mkdir -p "$COMMON_DIR/data" "$COMMON_DIR/public"

if [ -f "$COMMON_DIR/scripts/resty-gateway.service" ]; then
  echo "[install] installing systemd unit"
  sudo cp "$COMMON_DIR/scripts/resty-gateway.service" "/etc/systemd/system/${SERVICE_NAME}.service"
  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICE_NAME"
  sudo systemctl restart "$SERVICE_NAME"
  sleep 1
  sudo systemctl status "$SERVICE_NAME" --no-pager -l | head -15
fi

echo "[install] done — curl http://127.0.0.1:4000/api/published"
curl -sf "http://127.0.0.1:4000/api/published" | head -c 500 || echo "(gateway starting...)"
