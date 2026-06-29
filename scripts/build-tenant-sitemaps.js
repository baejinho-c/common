#!/usr/bin/env node
/**
 * Publish 후 실제 static HTML 기준으로 sitemap.xml 재생성 (audit-seo와 100% 일치)
 * Usage: node build-tenant-sitemaps.js <publicDir> <tenant>
 */
const fs = require('fs')
const path = require('path')

const publicDir = process.argv[2]
const tenant = process.argv[3]
if (!publicDir || !tenant) {
  console.error('Usage: node build-tenant-sitemaps.js <publicDir> <tenant>')
  process.exit(1)
}

const siteBase = process.env.PUBLISH_SITE_URL || `https://${tenant}.restyart.com`

const SKIP_DIRS = new Set(['_next', 'api', 'app'])
const SKIP_HTML = new Set(['404', '500', '_not-found', 'index'])
const SKIP_PATHS = new Set([
  '/login',
  '/signup',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/settings',
  '/profile',
  '/auth',
  '/_not-found',
  '/monitor',
])

function collectHtmlPaths(dir, prefix = '') {
  const out = new Set()
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') && ent.name !== '_not-found') continue
    if (SKIP_DIRS.has(ent.name)) continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      for (const p of collectHtmlPaths(full, `${prefix}/${ent.name}`)) out.add(p)
      continue
    }
    if (!ent.name.endsWith('.html')) continue
    if (ent.name === '404.html' || ent.name === '500.html') continue
    const name = ent.name.replace(/\.html$/, '')
    if (name === 'index') {
      out.add(prefix || '/')
    } else {
      out.add(`${prefix}/${name}`)
    }
  }
  return out
}

function shouldIncludePath(p) {
  const norm = p.replace(/\/$/, '') || '/'
  if (SKIP_PATHS.has(norm)) return false
  if (norm.includes('/auth/')) return false
  if (norm.startsWith('/api/')) return false
  if (norm.includes('/app/')) return false
  return true
}

function priorityFor(pathname) {
  if (pathname === '/') return '1.0'
  if (pathname.startsWith('/area/') && pathname.split('/').length > 3) return '0.88'
  if (pathname.startsWith('/area/') || pathname.startsWith('/category/')) return '0.85'
  if (pathname.startsWith('/restaurant/') || pathname.startsWith('/cafe/')) return '0.7'
  if (pathname === '/restaurants' || pathname === '/search' || pathname === '/map') return '0.8'
  return '0.6'
}

function changefreqFor(pathname) {
  if (pathname === '/') return 'daily'
  if (pathname.startsWith('/restaurant/') || pathname.startsWith('/cafe/')) return 'monthly'
  if (pathname.startsWith('/area/')) return 'weekly'
  return 'weekly'
}

const paths = [...collectHtmlPaths(publicDir)]
  .filter(shouldIncludePath)
  .sort((a, b) => a.localeCompare(b))

const now = new Date().toISOString()
const body =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  paths
    .map((p) => {
      const url = p === '/' ? siteBase : `${siteBase}${p}`
      return (
        `<url>\n` +
        `<loc>${url}</loc>\n` +
        `<lastmod>${now}</lastmod>\n` +
        `<changefreq>${changefreqFor(p)}</changefreq>\n` +
        `<priority>${priorityFor(p)}</priority>\n` +
        `</url>`
      )
    })
    .join('\n') +
  '\n</urlset>\n'

const sitemapPath = path.join(publicDir, 'sitemap.xml')
fs.writeFileSync(sitemapPath, body, 'utf8')

const robotsPath = path.join(publicDir, 'robots.txt')
let robotsBody = `User-agent: *
Allow: /

Sitemap: ${siteBase}/sitemap.xml
`
if (fs.existsSync(robotsPath)) {
  const existing = fs.readFileSync(robotsPath, 'utf8')
  const disallow = existing
    .split('\n')
    .filter((l) => /^Disallow:/i.test(l.trim()))
    .join('\n')
  if (disallow) {
    robotsBody =
      `User-agent: *\nAllow: /\n${disallow}\n\nSitemap: ${siteBase}/sitemap.xml\n`
  }
}
fs.writeFileSync(robotsPath, robotsBody, 'utf8')

console.log(`[build-tenant-sitemaps] ${tenant}: ${paths.length} URLs -> ${sitemapPath}`)
