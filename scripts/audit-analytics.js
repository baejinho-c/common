#!/usr/bin/env node
/**
 * 통합 GA(G-YVK657S8Q4) 적용 현황 감사
 * Usage: node scripts/audit-analytics.js [tenant...]
 */
const fs = require('fs')
const path = require('path')
const { GA_MEASUREMENT_ID, hasValidAnalytics, normalizeAnalyticsHtml } = require('../analytics-info')

const BASE = path.join(__dirname, '..', '..')
const PUBLIC = path.join(__dirname, '..', 'public')

function publishedTenants(filter) {
  if (filter && filter.length) return filter
  if (!fs.existsSync(PUBLIC)) return []
  return fs.readdirSync(PUBLIC).filter((n) => fs.existsSync(path.join(PUBLIC, n, 'index.html'))).sort()
}

function auditTenant(tenant) {
  const idx = path.join(PUBLIC, tenant, 'index.html')
  const srcLayout = path.join(BASE, tenant, 'app/layout.tsx')
  const row = { tenant, published: false, pub_ok: false, src_ok: false, issues: [] }

  if (fs.existsSync(idx)) {
    row.published = true
    const html = fs.readFileSync(idx, 'utf8')
    row.pub_ok = hasValidAnalytics(normalizeAnalyticsHtml(html))
    if (!row.pub_ok) row.issues.push('published_html_missing_ga')
    if (html.includes('G-YVK657S8Q4GA')) row.issues.push('wrong_id_in_html')
    if (html.includes('GA_MEASUREMENT_ID')) row.issues.push('placeholder_in_html')
  }

  if (fs.existsSync(srcLayout)) {
    const src = fs.readFileSync(srcLayout, 'utf8')
    row.src_ok = src.includes(GA_MEASUREMENT_ID)
    if (src.includes('G-YVK657S8Q4GA')) row.issues.push('wrong_id_in_source')
    if (src.includes('GA_MEASUREMENT_ID')) row.issues.push('placeholder_in_source')
    if (!row.src_ok && !src.includes('RestyartGoogleAnalytics')) row.issues.push('source_missing_ga')
  } else if (row.published) {
    row.issues.push('no_layout_source')
  }

  row.ok = row.published && row.pub_ok
  return row
}

const filter = process.argv.slice(2)
const tenants = publishedTenants(filter)
const rows = tenants.map(auditTenant)
const bad = rows.filter((r) => !r.ok)

console.log(`GA unified ID: ${GA_MEASUREMENT_ID}`)
console.log(`Published: ${rows.length}, OK: ${rows.filter((r) => r.ok).length}, Issues: ${bad.length}\n`)

for (const r of bad) {
  console.log(`[FAIL] ${r.tenant}: ${r.issues.join(', ') || 'no ga in published html'}`)
}

process.exit(bad.length > 0 ? 1 : 0)
