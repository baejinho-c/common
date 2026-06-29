#!/usr/bin/env node
/**
 * Sitemap / robots / localhost SEO audit for Resty tenants.
 *
 * Usage:
 *   node common/scripts/audit-sitemap.js              # published (common/public)
 *   node common/scripts/audit-sitemap.js --source     # tenant source (app/sitemap.ts)
 *   node common/scripts/audit-sitemap.js --fix-seo    # run finalize-seo on all published
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '../..')
const PUBLIC = path.join(ROOT, 'common/public')
const modeSource = process.argv.includes('--source')
const modeFix = process.argv.includes('--fix-seo')

const LOCALHOST_RE = /localhost:\d+/i
const VERCEL_RE = /vercel\.app/i
const BAD_LOC_RE = /<loc>\/(?!\/)[^<]*<\/loc>/

function listTenants(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort()
}

function readSafe(file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}

function findFiles(dir, pattern) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...findFiles(full, pattern))
    else if (pattern.test(ent.name)) out.push(full)
  }
  return out
}

function auditPublished(tenant) {
  const dir = path.join(PUBLIC, tenant)
  const issues = []
  const sitemap =
    ['sitemap.xml', 'app/sitemap.xml'].map((p) => path.join(dir, p)).find((p) => fs.existsSync(p)) ||
    findFiles(dir, /^sitemap.*\.xml$/i)[0]
  const robots =
    ['robots.txt', 'app/robots.txt'].map((p) => path.join(dir, p)).find((p) => fs.existsSync(p)) ||
    findFiles(dir, /^robots.*\.txt$/i)[0]

  if (!sitemap) issues.push('missing sitemap')
  if (!robots) issues.push('missing robots.txt')

  if (sitemap) {
    const text = readSafe(sitemap)
    if (LOCALHOST_RE.test(text)) issues.push('localhost in sitemap')
    if (VERCEL_RE.test(text)) issues.push('vercel in sitemap')
    if (BAD_LOC_RE.test(text)) issues.push('relative <loc> in sitemap')
  }

  const indexHtml = path.join(dir, 'index.html')
  if (fs.existsSync(indexHtml) && LOCALHOST_RE.test(readSafe(indexHtml))) {
    issues.push('localhost in index.html')
  }

  const hasSourceSitemap = fs.existsSync(path.join(ROOT, tenant, 'app/sitemap.ts'))
  const hasSourceRobots = fs.existsSync(path.join(ROOT, tenant, 'app/robots.ts'))
  if (!hasSourceSitemap) issues.push('no app/sitemap.ts in source')
  if (!hasSourceRobots) issues.push('no app/robots.ts in source')

  return { tenant, issues, sitemap: sitemap ? path.relative(PUBLIC, sitemap) : null }
}

function auditSource(tenant) {
  const issues = []
  const sitemapTs = path.join(ROOT, tenant, 'app/sitemap.ts')
  const robotsTs = path.join(ROOT, tenant, 'app/robots.ts')
  const envTs = path.join(ROOT, tenant, 'lib/env.ts')

  if (!fs.existsSync(sitemapTs)) issues.push('missing app/sitemap.ts')
  else {
    const text = readSafe(sitemapTs)
    if (LOCALHOST_RE.test(text)) issues.push('localhost in sitemap.ts')
    if (VERCEL_RE.test(text)) issues.push('vercel in sitemap.ts')
  }

  if (!fs.existsSync(robotsTs)) issues.push('missing app/robots.ts')

  if (fs.existsSync(envTs) && LOCALHOST_RE.test(readSafe(envTs))) {
    issues.push('localhost default in lib/env.ts')
  }

  return { tenant, issues }
}

function runFixSeo() {
  const finalize = path.join(ROOT, 'common/finalize-seo.js')
  for (const tenant of listTenants(PUBLIC)) {
    const dir = path.join(PUBLIC, tenant)
    try {
      execSync(`node "${finalize}" "${dir}" "${tenant}"`, { stdio: 'inherit' })
    } catch (e) {
      console.error(`[audit-sitemap] finalize-seo failed: ${tenant}`)
    }
  }
}

if (modeFix) {
  runFixSeo()
  process.exit(0)
}

const tenants = modeSource
  ? listTenants(ROOT).filter((t) => fs.existsSync(path.join(ROOT, t, 'package.json')))
  : listTenants(PUBLIC)

const results = tenants.map(modeSource ? auditSource : auditPublished)
const bad = results.filter((r) => r.issues.length > 0)
const ok = results.length - bad.length

console.log(`\n=== Sitemap audit (${modeSource ? 'source' : 'published'}) ===`)
console.log(`tenants: ${results.length}, ok: ${ok}, issues: ${bad.length}\n`)

for (const r of bad) {
  console.log(`${r.tenant}: ${r.issues.join(', ')}`)
}

if (!modeSource && bad.length) {
  console.log('\nTip: node common/scripts/audit-sitemap.js --fix-seo')
}

process.exit(bad.length ? 1 : 0)
