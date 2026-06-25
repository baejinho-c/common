#!/usr/bin/env node
/**
 * SEO audit: robots.txt + sitemap.xml vs static HTML in public/{tenant}
 * Usage: node scripts/audit-seo.js [tenant...]
 */
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const SKIP = new Set(['dashboard-manifest.json', 'app.js', 'services-dashboard'])

function resolveStaticPath(staticRoot, reqPath) {
  const clean = (reqPath || '/').split('?')[0]
  if (!clean || clean === '/') {
    const idx = path.join(staticRoot, 'index.html')
    return fs.existsSync(idx) ? { file: idx, mode: 'index' } : null
  }
  const rel = clean.replace(/^\//, '').replace(/\/$/, '')
  const direct = path.join(staticRoot, rel)
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return { file: direct, mode: 'file' }
  }
  const asHtml = path.join(staticRoot, `${rel}.html`)
  if (fs.existsSync(asHtml) && fs.statSync(asHtml).isFile()) {
    return { file: asHtml, mode: 'html' }
  }
  const indexInDir = path.join(staticRoot, rel, 'index.html')
  if (fs.existsSync(indexInDir) && fs.statSync(indexInDir).isFile()) {
    return { file: indexInDir, mode: 'dir-index' }
  }
  if (rel.includes('/')) {
    const parts = rel.split('/')
    for (let i = parts.length; i >= 1; i--) {
      const candidate = path.join(staticRoot, ...parts.slice(0, i)) + '.html'
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return { file: candidate, mode: 'parent-html' }
      }
    }
  }
  if (!/\.[a-z0-9]+$/i.test(clean) && !clean.includes('_next') && !clean.startsWith('/api/')) {
    const idx = path.join(staticRoot, 'index.html')
    if (fs.existsSync(idx)) return { file: idx, mode: 'spa-fallback' }
  }
  return null
}

function collectHtmlPaths(staticRoot, dir = staticRoot, prefix = '') {
  const out = new Set()
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') || ent.name === '_next' || ent.name === 'api' || ent.name === 'app') continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      for (const p of collectHtmlPaths(staticRoot, full, `${prefix}/${ent.name}`)) out.add(p)
      continue
    }
    if (!ent.name.endsWith('.html')) continue
    if (ent.name === '404.html' || ent.name === '500.html') continue
    const name = ent.name.replace(/\.html$/, '')
    if (name === 'index') out.add(prefix || '/')
    else out.add(`${prefix}/${name}`)
  }
  return out
}

function parseSitemapLocs(xml) {
  const locs = []
  const re = /<loc>([^<]+)<\/loc>/g
  let m
  while ((m = re.exec(xml))) locs.push(m[1].trim())
  return locs
}

function parseRobotsSitemaps(txt) {
  return txt
    .split('\n')
    .filter((l) => /^sitemap:/i.test(l.trim()))
    .map((l) => l.replace(/^sitemap:\s*/i, '').trim())
}

function pathFromLoc(loc, expectedHost) {
  try {
    const u = new URL(loc)
    if (expectedHost && u.hostname !== expectedHost) {
      return { path: u.pathname, hostMismatch: u.hostname }
    }
    return { path: u.pathname === '' ? '/' : u.pathname.replace(/\/$/, '') || '/', hostMismatch: null }
  } catch {
    return { path: loc, hostMismatch: null }
  }
}

function auditTenant(name) {
  const staticRoot = path.join(PUBLIC_DIR, name)
  if (!fs.existsSync(staticRoot)) return { name, error: 'no public dir' }

  const expectedHost = `${name}.restyart.com`
  const robotsPath = [path.join(staticRoot, 'robots.txt'), path.join(staticRoot, 'app', 'robots.txt.body')].find((p) =>
    fs.existsSync(p),
  )
  const sitemapPath = [path.join(staticRoot, 'sitemap.xml'), path.join(staticRoot, 'app', 'sitemap.xml.body')].find(
    (p) => fs.existsSync(p),
  )

  const issues = []
  const htmlPaths = collectHtmlPaths(staticRoot)

  if (!robotsPath) issues.push({ level: 'warn', code: 'NO_ROBOTS', msg: 'robots.txt missing' })
  if (!sitemapPath) issues.push({ level: 'warn', code: 'NO_SITEMAP', msg: 'sitemap.xml missing' })

  let sitemapLocs = []
  if (sitemapPath) {
    sitemapLocs = parseSitemapLocs(fs.readFileSync(sitemapPath, 'utf8'))
    for (const loc of sitemapLocs) {
      const { path: p, hostMismatch } = pathFromLoc(loc, expectedHost)
      if (hostMismatch) {
        issues.push({ level: 'error', code: 'SITEMAP_HOST', msg: `${loc} (expected ${expectedHost})` })
        continue
      }
      const resolved = resolveStaticPath(staticRoot, p)
      if (!resolved) {
        issues.push({ level: 'error', code: 'SITEMAP_404', msg: `${p} — no static HTML` })
      } else if (resolved.mode === 'spa-fallback') {
        issues.push({ level: 'warn', code: 'SITEMAP_SPA_ONLY', msg: `${p} — SPA shell only (no dedicated HTML)` })
      } else if (resolved.mode === 'parent-html') {
        issues.push({ level: 'warn', code: 'SITEMAP_PARENT_HTML', msg: `${p} — falls back to parent .html` })
      }
    }
  }

  if (robotsPath) {
    const robotsTxt = fs.readFileSync(robotsPath, 'utf8')
    for (const sm of parseRobotsSitemaps(robotsTxt)) {
      const { hostMismatch } = pathFromLoc(sm, expectedHost)
      if (hostMismatch) {
        issues.push({ level: 'error', code: 'ROBOTS_SITEMAP_HOST', msg: sm })
      }
      if (!fs.existsSync(path.join(staticRoot, 'sitemap.xml')) && !fs.existsSync(path.join(staticRoot, 'app', 'sitemap.xml.body'))) {
        issues.push({ level: 'error', code: 'ROBOTS_SITEMAP_MISSING', msg: 'Sitemap URL in robots but file missing' })
      }
    }
  }

  // Public static pages not listed in sitemap (informational)
  const sitemapPaths = new Set(
    sitemapLocs.map((loc) => {
      const { path: p } = pathFromLoc(loc, expectedHost)
      return p.replace(/\/$/, '') || '/'
    }),
  )
  const skipHtml = new Set(['/_not-found', '/monitor', '/mypage', '/login', '/signup', '/register', '/auth/callback'])
  for (const hp of htmlPaths) {
    const norm = hp.replace(/\/$/, '') || '/'
    if (skipHtml.has(norm)) continue
    if (norm.includes('/auth/')) continue
    const inSitemap = [...sitemapPaths].some((sp) => sp === norm || sp === norm + '/')
    if (!inSitemap && sitemapPath) {
      issues.push({ level: 'info', code: 'HTML_NOT_IN_SITEMAP', msg: norm })
    }
  }

  return {
    name,
    expectedHost,
    hasRobots: !!robotsPath,
    hasSitemap: !!sitemapPath,
    sitemapCount: sitemapLocs.length,
    htmlCount: htmlPaths.size,
    issues,
  }
}

const tenants = process.argv.slice(2)
const list =
  tenants.length > 0
    ? tenants
    : fs.readdirSync(PUBLIC_DIR).filter((n) => {
        const p = path.join(PUBLIC_DIR, n)
        return fs.statSync(p).isDirectory() && !SKIP.has(n)
      })

const results = list.map(auditTenant).sort((a, b) => (b.issues?.length || 0) - (a.issues?.length || 0))

let errors = 0
let warns = 0
for (const r of results) {
  if (r.error) {
    console.log(`[SKIP] ${r.name}: ${r.error}`)
    continue
  }
  const errs = r.issues.filter((i) => i.level === 'error')
  const wns = r.issues.filter((i) => i.level === 'warn')
  const infos = r.issues.filter((i) => i.level === 'info')
  if (errs.length || wns.length) {
    console.log(`\n## ${r.name} (sitemap:${r.sitemapCount} html:${r.htmlCount})`)
    for (const i of errs) {
      console.log(`  ERROR ${i.code}: ${i.msg}`)
      errors++
    }
    for (const i of wns) {
      console.log(`  WARN  ${i.code}: ${i.msg}`)
      warns++
    }
    if (infos.length && (errs.length || wns.length)) {
      console.log(`  INFO  HTML_NOT_IN_SITEMAP: ${infos.length} pages`)
    }
  }
}

const missing = results.filter((r) => !r.error && (!r.hasRobots || !r.hasSitemap))
if (missing.length) {
  console.log(`\n## Missing robots/sitemap (${missing.length})`)
  for (const r of missing) {
    console.log(`  ${r.name}: robots=${r.hasRobots} sitemap=${r.hasSitemap}`)
  }
}

console.log(`\n--- Summary: ${list.length} tenants, ${errors} errors, ${warns} warnings ---`)
process.exit(errors > 0 ? 1 : 0)
