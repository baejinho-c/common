#!/usr/bin/env node
/** 검색 엔진 색인 차단 — robots.txt + sitemap 제거 + HTML meta 보강 */
const fs = require('fs')
const path = require('path')

const root = process.argv[2]
if (!root) {
  console.error('Usage: node apply-noindex.js <publicDir>')
  process.exit(1)
}

const robotsBody = `User-agent: *
Disallow: /
`

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, fn)
    else fn(full)
  }
}

let htmlCount = 0
walk(root, (file) => {
  if (!/\.html?$/i.test(file)) return
  let html = fs.readFileSync(file, 'utf8')
  if (/name=["']robots["']/i.test(html)) {
    html = html.replace(
      /<meta[^>]*name=["']robots["'][^>]*>/gi,
      '<meta name="robots" content="noindex, nofollow"/>',
    )
  } else {
    html = html.replace(/<head([^>]*)>/i, '<head$1><meta name="robots" content="noindex, nofollow"/>')
  }
  fs.writeFileSync(file, html, 'utf8')
  htmlCount += 1
})

for (const rel of ['robots.txt', 'app/robots.txt', 'sitemap.xml', 'app/sitemap.xml']) {
  const p = path.join(root, rel)
  if (fs.existsSync(p)) fs.unlinkSync(p)
}

fs.writeFileSync(path.join(root, 'robots.txt'), robotsBody, 'utf8')
console.log(`[apply-noindex] ${htmlCount} html files, robots Disallow:/, sitemap removed under ${root}`)
