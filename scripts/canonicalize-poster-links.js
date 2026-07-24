#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const publicDir = process.argv[2]
if (!publicDir) {
  console.error('Usage: node canonicalize-poster-links.js <publicDir>')
  process.exit(1)
}

const redirects = [
  ['/poster', '/'],
  ['/poster/', '/'],
  ['/poster/create', '/create'],
  ['/poster/editor', '/editor'],
  ['/poster/privacy', '/privacy'],
  ['/poster/terms', '/terms'],
  ['/poster/#features', '/#features'],
  ['/poster/#how', '/#how'],
  ['/poster/#types', '/#types'],
]

function writeRedirect(target, to) {
  const file = path.join(publicDir, target.replace(/^\//, '')).replace(/\/$/, '')
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"><script>location.replace(${JSON.stringify(to)})</script></head><body></body></html>`
  if (target.endsWith('/')) {
    fs.mkdirSync(file, { recursive: true })
    fs.writeFileSync(path.join(file, 'index.html'), html)
  } else {
    const htmlPath = file.endsWith('.html') ? file : `${file}.html`
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true })
    fs.writeFileSync(htmlPath, html)
  }
}

function rewriteHtml(html) {
  return html
    .replace(/href="\/poster\/(create|editor|privacy|terms)"/g, 'href="/$1"')
    .replace(/href="\/poster\/#(features|how|types)"/g, 'href="/#$1"')
    .replace(/href="\/poster"/g, 'href="/"')
    .replace(/href='\/poster\/(create|editor|privacy|terms)'/g, "href='/$1'")
    .replace(/href='\/poster\/#(features|how|types)'/g, "href='/#$1'")
    .replace(/href='\/poster'/g, "href='/'")
}

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      walk(full)
    } else if (ent.name.endsWith('.html') || ent.name.endsWith('.htm')) {
      const raw = fs.readFileSync(full, 'utf8')
      const next = rewriteHtml(raw)
      if (next !== raw) fs.writeFileSync(full, next, 'utf8')
    }
  }
}

walk(publicDir)
writeRedirect('poster/create', '/create')
writeRedirect('poster/editor', '/editor')
writeRedirect('poster/privacy', '/privacy')
writeRedirect('poster/terms', '/terms')
writeRedirect('poster/', '/')
console.log(`[canonicalize-poster-links] updated ${publicDir}`)
