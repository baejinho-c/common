#!/usr/bin/env node
/**
 * Promote Next.js metadata route .body files and rewrite SEO URLs for tenant subdomain.
 * Usage: node finalize-seo.js <publicDir> <tenant>
 *
 * PUBLISH_SITE_URL — override production base (default: https://{tenant}.restyart.com)
 */
const fs = require('fs')
const path = require('path')

const publicDir = process.argv[2]
const tenant = process.argv[3]
if (!publicDir || !tenant) {
  console.error('Usage: node finalize-seo.js <publicDir> <tenant>')
  process.exit(1)
}

const siteBase = process.env.PUBLISH_SITE_URL || `https://${tenant}.restyart.com`

function promoteBodyFiles(dir) {
  let count = 0
  if (!fs.existsSync(dir)) return count
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      count += promoteBodyFiles(full)
      continue
    }
    if (!ent.name.endsWith('.body')) continue
    const routeName = ent.name.replace(/\.body$/, '')
    const relDir = path.relative(publicDir, dir)
    const routePath = relDir === 'app' || relDir.startsWith('app/')
      ? path.join(relDir === 'app' ? '' : relDir.slice(4), routeName)
      : path.join(relDir, routeName)
    const dest = path.join(publicDir, routePath)
    if (fs.existsSync(dest)) {
      const st = fs.statSync(dest)
      if (st.isDirectory()) continue
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(full, dest)
    count += 1
  }
  return count
}

function rewriteSeoFile(filePath) {
  if (!fs.existsSync(filePath)) return false
  let text = fs.readFileSync(filePath, 'utf8')
  text = rewriteSeoText(text)
  fs.writeFileSync(filePath, text, 'utf8')
  return true
}

function rewriteSeoText(text) {
  // Legacy publish output: localhost gateway paths -> subdomain
  const localhostTenant = new RegExp(
    `https?:\\/\\/localhost:4000\\/${tenant}(?=\\/|<|"|'|\\s|$)`,
    'gi'
  )
  text = text.replace(localhostTenant, siteBase)

  // Any localhost:port (3000 dev, 3002, 4000 gateway, etc.)
  text = text.replace(/https?:\/\/localhost:\d+/gi, siteBase)

  // Wrong tenant subdomain baked into build (e.g. play.restyart.com on hike)
  text = text.replace(
    new RegExp(`https?:\\/\\/(?!${tenant}\\.)[a-z0-9-]+\\.restyart\\.com`, 'gi'),
    siteBase
  )

  // Wrong hosts from source fallbacks or old deploys
  const wrongHosts = [
    /https?:\/\/daily-prayer\.vercel\.app/gi,
    /https?:\/\/ai-qbox\.vercel\.app/gi,
    /https?:\/\/[a-z0-9-]+\.vercel\.app/gi,
  ]
  for (const re of wrongHosts) {
    text = text.replace(re, siteBase)
  }

  // Subdomain URLs must not repeat tenant path prefix (/light/ on light.restyart.com)
  // Skip when tenant name equals an app route segment (e.g. cafe.restyart.com/cafe/123)
  const TENANT_APP_ROUTE_COLLISION = new Set(['cafe'])
  if (!TENANT_APP_ROUTE_COLLISION.has(tenant)) {
    const duplicatePrefix = new RegExp(
      `(https?:\\/\\/${tenant}\\.restyart\\.com)\\/${tenant}(\\/|"|'|\\s|$)`,
      'gi'
    )
    text = text.replace(duplicatePrefix, `$1$2`)
  }

  // path-only sitemap entries: <loc>/foo</loc> -> <loc>https://tenant.restyart.com/foo</loc>
  text = text.replace(/<loc>\/(?!\/)([^<]*)<\/loc>/g, (_, p) => {
    return `<loc>${siteBase}/${p}</loc>`
  })
  text = text.replace(/<loc>\/<\/loc>/g, `<loc>${siteBase}/</loc>`)

  // robots.txt Sitemap lines
  text = text.replace(/^Sitemap: \/(.+)$/gm, `Sitemap: ${siteBase}/$1`)
  text = text.replace(
    new RegExp(`^Sitemap: https?:\\/\\/localhost:4000\\/${tenant}(.+)$`, 'gm'),
    `Sitemap: ${siteBase}$1`
  )

  return text
}

/** HTML 본문의 퍼널·외부 링크는 유지하고 SEO/메타 URL만 보정 */
function rewriteHtmlSeoText(text) {
  const localhostTenant = new RegExp(
    `https?:\\/\\/localhost:4000\\/${tenant}(?=\\/|<|"|'|\\s|$)`,
    'gi'
  )
  text = text.replace(localhostTenant, siteBase)
  text = text.replace(/https?:\/\/localhost:\d+/gi, siteBase)

  const wrongHosts = [
    /https?:\/\/daily-prayer\.vercel\.app/gi,
    /https?:\/\/ai-qbox\.vercel\.app/gi,
    /https?:\/\/[a-z0-9-]+\.vercel\.app/gi,
  ]
  for (const re of wrongHosts) {
    text = text.replace(re, siteBase)
  }

  // 잘못된 테넌트 서브도메인 — meta/link/canonical 등 메타데이터만 (본문 a[href] 제외)
  text = text.replace(
    new RegExp(
      `(<(?:link|meta|script type="application/ld\\+json")[^>]*(?:content|href)=")https?:\\/\\/(?!${tenant}\\.)[a-z0-9-]+\\.restyart\\.com`,
      'gi'
    ),
    `$1${siteBase}`
  )

  const duplicatePrefix = new RegExp(
    `(https?:\\/\\/${tenant}\\.restyart\\.com)\\/${tenant}(\\/|"|'|\\s|$)`,
    'gi'
  )
  text = text.replace(duplicatePrefix, `$1$2`)

  return text
}

function rewriteHtmlOg(filePath) {
  if (!fs.existsSync(filePath)) return false
  let text = fs.readFileSync(filePath, 'utf8')
  const before = text
  text = rewriteHtmlSeoText(text)

  // Next.js build may embed localhost:3000 as metadataBase fallback
  text = text.replace(/https?:\/\/localhost:3000/gi, siteBase)

  // Relative og:url in meta tags (content="/path")
  text = text.replace(
    /(property="og:url"\s+content=")\/(?!\/)([^"]*)(")/gi,
    (_, pre, path, post) => `${pre}${siteBase}/${path}${post}`
  )
  text = text.replace(
    /(property="og:image"\s+content=")\/(?!\/)([^"]*)(")/gi,
    (_, pre, path, post) => `${pre}${siteBase}/${path}${post}`
  )
  text = text.replace(
    /(name="twitter:image"\s+content=")\/(?!\/)([^"]*)(")/gi,
    (_, pre, path, post) => `${pre}${siteBase}/${path}${post}`
  )

  if (text === before) return false
  fs.writeFileSync(filePath, text, 'utf8')
  return true
}

const promoted = promoteBodyFiles(publicDir)
let rewritten = 0
let htmlRewritten = 0
function walkSeo(dir) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walkSeo(full)
    else if (/\.(xml|txt)$/.test(ent.name) && (ent.name.includes('sitemap') || ent.name === 'robots.txt')) {
      if (rewriteSeoFile(full)) rewritten += 1
    } else if (ent.name.endsWith('.html')) {
      if (rewriteHtmlOg(full)) htmlRewritten += 1
    }
  }
}
walkSeo(publicDir)

function ensureRobotsTxt() {
  const candidates = [
    path.join(publicDir, 'robots.txt'),
    path.join(publicDir, 'app', 'robots.txt'),
  ]
  if (candidates.some((p) => fs.existsSync(p))) return false

  const sitemapPath = [
    path.join(publicDir, 'sitemap.xml'),
    path.join(publicDir, 'app', 'sitemap.xml'),
  ].find((p) => fs.existsSync(p))
  const sitemapUrl = sitemapPath
    ? `${siteBase}/${path.relative(publicDir, sitemapPath).replace(/\\/g, '/')}`
    : `${siteBase}/sitemap.xml`

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), body, 'utf8')
  return true
}

const robotsCreated = ensureRobotsTxt()
if (robotsCreated) rewriteSeoFile(path.join(publicDir, 'robots.txt'))

function ensureSitemapXml() {
  const candidates = [
    path.join(publicDir, 'sitemap.xml'),
    path.join(publicDir, 'app', 'sitemap.xml'),
  ]
  if (candidates.some((p) => fs.existsSync(p))) return false

  const urls = new Set([`${siteBase}/`])
  function collectHtml(dir, prefix) {
    if (!fs.existsSync(dir)) return
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isDirectory() && ent.name.endsWith('.html') && ent.name !== '404.html' && ent.name !== '500.html') {
        const name = ent.name.replace(/\.html$/, '')
        if (name === 'index') urls.add(`${siteBase}${prefix || '/'}`)
        else urls.add(`${siteBase}${prefix}/${name}`)
        continue
      }
      if (ent.isDirectory() && !ent.name.startsWith('_') && ent.name !== '_next' && ent.name !== 'api') {
        collectHtml(path.join(dir, ent.name), `${prefix}/${ent.name}`)
      }
    }
  }
  collectHtml(publicDir, '')

  const now = new Date().toISOString()
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [...urls]
      .sort()
      .map(
        (loc) =>
          `<url><loc>${loc}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${loc === `${siteBase}/` ? '1.0' : '0.7'}</priority></url>`
      )
      .join('\n') +
    '\n</urlset>\n'

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), body, 'utf8')
  return true
}

const sitemapCreated = ensureSitemapXml()
if (sitemapCreated) rewriteSeoFile(path.join(publicDir, 'sitemap.xml'))

console.log(
  `[finalize-seo] ${tenant}: promoted ${promoted} .body files, rewrote ${rewritten} seo files, ${htmlRewritten} html files, robots ${robotsCreated ? 'created' : 'ok'}, sitemap ${sitemapCreated ? 'created' : 'ok'} -> ${siteBase}`
)
