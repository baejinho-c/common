#!/usr/bin/env node
/**
 * Promote Next.js metadata route .body files and rewrite SEO URLs for tenant path.
 * Usage: node finalize-seo.js <publicDir> <tenant>
 */
const fs = require('fs')
const path = require('path')

const publicDir = process.argv[2]
const tenant = process.argv[3]
if (!publicDir || !tenant) {
  console.error('Usage: node finalize-seo.js <publicDir> <tenant>')
  process.exit(1)
}

const prefix = `/${tenant}`
const localBase = `http://localhost:4000${prefix}`

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
  const hostPatterns = [
    /https?:\/\/daily-prayer\.vercel\.app/gi,
    /https?:\/\/light\.restyart\.com/gi,
    /https?:\/\/[a-z0-9-]+\.restyart\.com/gi,
    /Host: https?:\/\/[^\s]+/gi,
  ]
  for (const re of hostPatterns) {
    text = text.replace(re, (m) => {
      if (m.toLowerCase().startsWith('host:')) return `Host: ${localBase}`
      return localBase
    })
  }
  // path-only sitemap entries: <loc>/foo</loc> -> <loc>http://localhost:4000/tenant/foo</loc>
  text = text.replace(/<loc>\/(?!\/)([^<]*)<\/loc>/g, (_, p) => {
    return `<loc>${localBase}/${p}</loc>`
  })
  text = text.replace(/<loc>\/<\/loc>/g, `<loc>${localBase}/</loc>`)
  // robots Sitemap: lines without full URL
  text = text.replace(/^Sitemap: \/(.+)$/gm, `Sitemap: ${localBase}/$1`)
  fs.writeFileSync(filePath, text, 'utf8')
  return true
}

const promoted = promoteBodyFiles(publicDir)
const seoFiles = ['robots.txt', 'sitemap.xml', 'sitemap-index.xml']
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
console.log(`[finalize-seo] ${tenant}: promoted ${promoted} .body files, rewrote ${rewritten} seo files`)
