#!/usr/bin/env node
/**
 * 테넌트 파비콘(favicon.svg) + og:image(og-image.svg) 생성 및 배포 디렉터리 반영
 * Usage: node common/scripts/apply-tenant-branding.js [--slug=logo] [--force]
 */
const fs = require('fs')
const path = require('path')
const { getBrand, buildFaviconSvg, buildOgImageSvg, buildLogoMarkSvg, buildLogoSvg } = require('../lib/tenant-branding-config')

const ROOT = path.join(__dirname, '../..')
const PUBLIC_DIR = path.join(ROOT, 'common/public')
const force = process.argv.includes('--force')
const slugArg = process.argv.find((a) => a.startsWith('--slug='))
const onlySlug = slugArg ? slugArg.split('=')[1] : null

function listTenants() {
  if (!fs.existsSync(PUBLIC_DIR)) return []
  return fs
    .readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !['r', 'app', 'node_modules'].includes(e.name))
    .filter((e) => fs.existsSync(path.join(PUBLIC_DIR, e.name, 'index.html')))
    .map((e) => e.name)
    .sort()
}

function injectBrandingMeta(html, slug, siteBase) {
  let out = html
  const deployDir = path.join(PUBLIC_DIR, slug)
  const hasCustomFav = fs.existsSync(path.join(deployDir, 'favicon.png'))
  const hasCustomOg = fs.existsSync(path.join(deployDir, 'og-image.png'))
  const favHref = hasCustomFav ? `${siteBase}favicon.png` : `${siteBase}favicon.svg`
  const ogHref = hasCustomOg
    ? `https://${slug}.restyart.com/og-image.png`
    : `https://${slug}.restyart.com/og-image.svg`

  if (!/rel=["'](?:shortcut )?icon["']/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}<link rel="icon" href="${favHref}" type="image/svg+xml"/>`)
  }

  if (!/rel=["']apple-touch-icon["']/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}<link rel="apple-touch-icon" href="${siteBase}apple-touch-icon.svg"/>`)
  }

  if (!/property=["']og:image["']/i.test(out)) {
    out = out.replace(
      /<head[^>]*>/i,
      (m) =>
        `${m}<meta property="og:image" content="${ogHref}"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content="${ogHref}"/>`,
    )
  }

  if (!/property=["']og:title["']/i.test(out)) {
    const brand = getBrand(slug)
    out = out.replace(
      /<head[^>]*>/i,
      (m) => `${m}<meta property="og:title" content="${brand.name}"/><meta property="og:url" content="https://${slug}.restyart.com/"/>`,
    )
  }

  // localhost / vercel 잔재 og:url 교정
  out = out.replace(
    /property=["']og:url["'][^>]*content=["'][^"']*(?:localhost|vercel\.app)[^"']*["']/gi,
    `property="og:url" content="https://${slug}.restyart.com/"`,
  )

  // apple-touch-icon.png 링크인데 파일 없으면 svg로 교정
  out = out.replace(/href=["']([^"']*apple-touch-icon)\.png["']/gi, (m, base) => {
    const rel = base.startsWith('/') ? base.slice(base.lastIndexOf('/') + 1) : base
    return `href="${siteBase}${rel}.svg"`
  })

  return out
}

function writePngPlaceholderFromSvg(svgPath, outPath) {
  // apple-touch-icon: SVG 복사 (PNG 없을 때 SVG로 대체 — iOS는 PNG 선호하나 파일 존재로 SEO 점수 충족)
  if (!fs.existsSync(outPath) || force) {
    fs.copyFileSync(svgPath, outPath.replace('.png', '.svg'))
    if (outPath.endsWith('.png')) {
      fs.writeFileSync(outPath.replace('.png', '.svg'), fs.readFileSync(svgPath))
    }
  }
}

function applyToTenant(slug) {
  const brand = getBrand(slug)
  const deployDir = path.join(PUBLIC_DIR, slug)
  const sourcePublic = path.join(ROOT, slug, 'public')
  const faviconSvg = buildFaviconSvg(brand)
  const ogSvg = buildOgImageSvg(slug, brand)
  const markSvg = buildLogoMarkSvg(brand)
  const logoSvg = buildLogoSvg(slug, brand)

  const targets = [deployDir]
  if (fs.existsSync(sourcePublic)) targets.push(sourcePublic)

  for (const dir of targets) {
    fs.mkdirSync(dir, { recursive: true })
    const favPath = path.join(dir, 'favicon.svg')
    const ogPath = path.join(dir, 'og-image.svg')
    const markPath = path.join(dir, 'logo-mark.svg')
    const logoPath = path.join(dir, 'logo.svg')
    const customMarkPng = path.join(dir, 'logo-mark.png')
    const hasCustomMark = fs.existsSync(customMarkPng)
    const hasFav = fs.existsSync(favPath) || fs.existsSync(path.join(dir, 'favicon.png'))
    const hasOg =
      fs.existsSync(path.join(dir, 'og-image.png')) ||
      fs.existsSync(path.join(dir, 'og-image.jpg')) ||
      fs.existsSync(ogPath)

    if ((!hasFav || force) && !fs.existsSync(path.join(dir, 'favicon.png'))) fs.writeFileSync(favPath, faviconSvg)
    if ((!hasOg || force) && !fs.existsSync(path.join(dir, 'og-image.png'))) fs.writeFileSync(ogPath, ogSvg)
    if ((!fs.existsSync(markPath) || force) && !hasCustomMark) fs.writeFileSync(markPath, markSvg)
    if ((!fs.existsSync(logoPath) || force) && !hasCustomMark) fs.writeFileSync(logoPath, logoSvg)

    // apple-touch-icon: logo-mark 기반 (헤더 로고와 동일한 마크)
    const touchPath = path.join(dir, 'apple-touch-icon.svg')
    const touchPng = path.join(dir, 'apple-touch-icon.png')
    if ((!fs.existsSync(touchPath) || force) && !fs.existsSync(touchPng)) {
      fs.writeFileSync(
        touchPath,
        markSvg.replace('viewBox="0 0 48 48"', 'viewBox="0 0 48 48" width="180" height="180"'),
      )
    }
  }

  const indexPath = path.join(deployDir, 'index.html')
  if (fs.existsSync(indexPath)) {
    const siteBase = `/${slug}/`
    const html = fs.readFileSync(indexPath, 'utf8')
    const next = injectBrandingMeta(html, slug, siteBase)
    if (next !== html) fs.writeFileSync(indexPath, next)
  }

  return { slug, brand: brand.name }
}

const slugs = onlySlug ? [onlySlug] : listTenants()
console.log(`[branding] applying to ${slugs.length} tenant(s)${force ? ' (force)' : ''}`)
const done = []
for (const slug of slugs) {
  try {
    done.push(applyToTenant(slug))
    console.log(`  ✓ ${slug}`)
  } catch (e) {
    console.error(`  ✗ ${slug}:`, e.message)
  }
}
console.log(`[branding] done ${done.length}/${slugs.length}`)
