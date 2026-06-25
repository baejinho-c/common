#!/usr/bin/env bash
# publish.sh — 빌드 후 common/public/{tenant}/ 에 정적 프론트 배포 (단일 포트 :4000)
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMMON_DIR="$BASE_DIR/common"
PUBLIC_DIR="$COMMON_DIR/public"

usage() {
  echo "Usage: $0 <project-name>   # 예: $0 arc"
  echo "       $0 --all            # opt_list.txt 전체 (시간 오래 걸림)"
  exit 1
}

publish_one() {
  local name="$1"
  local src="$BASE_DIR/$name"
  local dest="$PUBLIC_DIR/$name"

  if [ ! -d "$src" ]; then
    echo "[SKIP] source not found: $src" >&2
    return 1
  fi
  if [ ! -f "$src/package.json" ]; then
    echo "[SKIP] no package.json: $src" >&2
    return 1
  fi

  echo "[BUILD] $name"
  if [ "$name" = "portfolio" ]; then
    echo "[snapshot] portfolio services from dashboard-manifest"
    node "$COMMON_DIR/scripts/build-dashboard-manifest.js" 2>/dev/null || true
    node "$COMMON_DIR/scripts/build-portfolio-services-snapshot.js"
  fi
  pushd "$src" >/dev/null
  if [ ! -d node_modules ]; then
    npm install --legacy-peer-deps
  fi
  export TENANT="$name"
  export NEXT_PUBLIC_TENANT_PATH="/${name}"
  export NEXT_PUBLIC_BASE_URL="${PUBLISH_SITE_URL:-https://${name}.restyart.com}"
  export NEXT_PUBLIC_API_BASE_URL="${PUBLISH_API_URL:-https://app.restyart.com}"
  # API route가 빌드 시점에 키를 요구하는 프로젝트용 (런타임 auth는 common 게이트웨이)
  export OPENAI_API_KEY="${OPENAI_API_KEY:-sk-build-placeholder}"
  export OPENAI_ADMIN_KEY="${OPENAI_ADMIN_KEY:-sk-build-placeholder}"
  export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-sk-build-placeholder}"
  export STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-sk_test_build_placeholder}"
  export GOOGLE_GENERATIVE_AI_API_KEY="${GOOGLE_GENERATIVE_AI_API_KEY:-build-placeholder}"
  npm run build
  popd >/dev/null

  rm -rf "$dest"
  mkdir -p "$dest"

  # 1) next static export (output: 'export')
  if [ -d "$src/out" ]; then
    echo "[COPY] $name/out -> public/$name"
    rsync -a "$src/out/" "$dest/"
  # 2) .next prerendered HTML + static chunks (기존 bucket/trace 방식)
  elif [ -d "$src/.next" ]; then
    echo "[COPY] $name/.next static export -> public/$name"
    if [ -d "$src/.next/static" ]; then
      mkdir -p "$dest/_next"
      rsync -a "$src/.next/static/" "$dest/_next/static/"
    fi
    if [ -d "$src/.next/server/app" ]; then
      rsync -a "$src/.next/server/app/" "$dest/app/"
      # app 루트의 html을 tenant 루트로
      if [ -f "$dest/app/index.html" ]; then
        cp "$dest/app/index.html" "$dest/index.html"
      fi
      # html 파일들을 flat 경로로 복사 (store.html -> store/ 대신)
      find "$dest/app" -name '*.html' | while read -r html; do
        rel="${html#$dest/app/}"
        target_dir="$dest/$(dirname "$rel")"
        mkdir -p "$target_dir"
        cp "$html" "$dest/$rel"
      done
    fi
    # Pages Router (hvalue 등)
    if [ -d "$src/.next/server/pages" ]; then
      find "$src/.next/server/pages" -name '*.html' | while read -r html; do
        rel="${html#$src/.next/server/pages/}"
        case "$rel" in
          _app.html|_document.html|_error.html) continue ;;
        esac
        target_dir="$dest/$(dirname "$rel")"
        mkdir -p "$target_dir"
        cp "$html" "$dest/$rel"
      done
      if [ -f "$src/.next/server/pages/index.html" ] && [ ! -f "$dest/index.html" ]; then
        cp "$src/.next/server/pages/index.html" "$dest/index.html"
      fi
    fi
    if [ -d "$src/public" ]; then
      rsync -a "$src/public/" "$dest/"
    fi
  else
    echo "[ERROR] no out/ or .next/ after build: $name" >&2
    return 1
  fi

  if [ ! -f "$dest/index.html" ]; then
    echo "[WARN] index.html not found in public/$name — 라우팅이 안 될 수 있습니다."
  fi

  echo "[PREFIX] rewrite paths -> /${name}/"
  node "$COMMON_DIR/prefix-static.js" "$dest" "$name"
  node "$COMMON_DIR/finalize-seo.js" "$dest" "$name"
  node "$COMMON_DIR/scripts/build-tenant-sitemaps.js" "$dest" "$name"
  node "$COMMON_DIR/scripts/apply-tenant-branding.js" --slug="$name" --force
  if [ "$name" = "wookwang" ] || [ "$name" = "portfolio" ] || [ "$name" = "goodprice" ]; then
    node "$COMMON_DIR/strip-legal.js" "$dest"
  else
    node "$COMMON_DIR/inject-legal.js" "$dest" "$name"
  fi

  echo "[ANALYTICS] inject unified GA -> ${name}"
  node "$COMMON_DIR/inject-analytics.js" "$dest" "$name"

  echo "[DONE] http://localhost:4000/${name}/"
}

[ $# -lt 1 ] && usage

if [ "$1" = "--all" ]; then
  OPT_FILE="$BASE_DIR/opt_list.txt"
  [ -f "$OPT_FILE" ] || { echo "opt_list.txt not found" >&2; exit 1; }
  while IFS= read -r line || [ -n "$line" ]; do
    proj=$(printf '%s' "$line" | sed -e 's/^[[:space:]]*//;s/[[:space:]]*$//')
    [ -z "$proj" ] && continue
    [ "$proj" = "common" ] && continue
    publish_one "$proj" || true
  done < "$OPT_FILE"
else
  publish_one "$1"
fi
