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
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(full, dest)
    count += 1
  }
  return count
}

function rewriteSeoFile(filePath) {
  if (!fs.existsSync(filePath)) return false
  let text = fs.readFileSync(filePath, 'utf8')

  // Legacy publish output: localhost gateway paths -> subdomain
  const localhostTenant = new RegExp(
    `https?:\\/\\/localhost:4000\\/${tenant}(?=\\/|<|"|'|\\s|$)`,
    'gi'
  )
  text = text.replace(localhostTenant, siteBase)

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
  const duplicatePrefix = new RegExp(
    `(https?:\\/\\/${tenant}\\.restyart\\.com)\\/${tenant}(\\/|"|'|\\s|$)`,
    'gi'
  )
  text = text.replace(duplicatePrefix, `$1$2`)

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

  fs.writeFileSync(filePath, text, 'utf8')
  return true
}

const promoted = promoteBodyFiles(publicDir)
let rewritten = 0
function walkSeo(dir) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walkSeo(full)
    else if (/\.(xml|txt)$/.test(ent.name) && (ent.name.includes('sitemap') || ent.name === 'robots.txt')) {
      if (rewriteSeoFile(full)) rewritten += 1
    }
  }
}
walkSeo(publicDir)
console.log(`[finalize-seo] ${tenant}: promoted ${promoted} .body files, rewrote ${rewritten} seo files -> ${siteBase}`)
