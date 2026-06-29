#!/usr/bin/env node
/**
 * Build dashboard-manifest.json for production gateway (no monorepo sources on server).
 * Usage: node common/scripts/build-dashboard-manifest.js
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const OUT = path.join(ROOT, 'common/public/dashboard-manifest.json')
const SKIP = new Set(['common', 'restyserver', 'resty-api', 'hvalue', 'node_modules', '.git'])

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walkFiles(full, acc)
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) acc.push(full)
  }
  return acc
}

function readProject(name) {
  const root = path.join(ROOT, name)
  const files = walkFiles(root)
  const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
  const hasApp = fs.existsSync(path.join(root, 'app'))
  const hasTerms = fs.existsSync(path.join(root, 'app/terms/page.tsx'))
  const hasPrivacy = fs.existsSync(path.join(root, 'app/privacy/page.tsx'))
  const hasSourceSitemap = fs.existsSync(path.join(root, 'app/sitemap.ts'))
  const hasSourceRobots = fs.existsSync(path.join(root, 'app/robots.ts'))
  const usesRestyAuthEndpoint = /\/api\/resty\/auth/.test(text)
  const usesCredits = /\/api\/resty\/credits|resty-credits|restyGetCreditBalance/.test(text)
  const usesPosts = /\/api\/posts|\/api\/resty_company/.test(text)
  const usesComments = /\/api\/comments/.test(text)
  const usesCompany = /\/api\/resty_company/.test(text)
  const mockAuth = /MOCK_BALANCES|mock-jwt-token|Mock (로그인|회원가입)/i.test(text)

  let priority = 'P3-low'
  const issues = []
  if (!hasApp) {
    priority = 'skip'
    issues.push('no-app')
  } else if (mockAuth && !usesRestyAuthEndpoint) {
    priority = 'P0-critical'
    issues.push('mock-only')
  } else if (usesRestyAuthEndpoint) {
    priority = 'P2-medium'
  }

  const scores = { 'P0-critical': 15, 'P1-high': 45, 'P2-medium': 72, 'P3-low': 88, skip: 0 }
  let apiScore = scores[priority] ?? 50
  if (usesCredits) apiScore = Math.min(100, apiScore + 8)
  if (hasTerms && hasPrivacy) apiScore = Math.min(100, apiScore + 5)
  if (hasSourceSitemap && hasSourceRobots) apiScore = Math.min(100, apiScore + 5)

  let title = name
  const layout = path.join(root, 'app/layout.tsx')
  if (fs.existsSync(layout)) {
    const m = fs.readFileSync(layout, 'utf8').match(/title:\s*['"]([^'"]+)['"]/)
    if (m) title = m[1].slice(0, 80)
  }

  return {
    tenant: name,
    title,
    hasApp,
    hasTerms,
    hasPrivacy,
    hasSourceSitemap,
    hasSourceRobots,
    usesRestyAuthEndpoint,
    usesCredits,
    usesPosts,
    usesComments,
    usesCompany,
    authPattern: usesRestyAuthEndpoint ? 'resty-central' : mockAuth ? 'mock' : 'other',
    priority,
    issues,
    apiScore,
    published: fs.existsSync(path.join(ROOT, 'common/public', name, 'index.html')),
  }
}

const tenants = fs
  .readdirSync(ROOT)
  .filter((n) => !SKIP.has(n) && fs.statSync(path.join(ROOT, n)).isDirectory())

const services = tenants.map(readProject).filter((r) => r.published || r.hasApp)
const scored = services.filter((s) => s.apiScore != null)
const summary = {
  apiIntegrationPct: scored.length
    ? Math.round(scored.reduce((a, s) => a + s.apiScore, 0) / scored.length)
    : 0,
  withRestyAuth: services.filter((s) => s.usesRestyAuthEndpoint).length,
  withCredits: services.filter((s) => s.usesCredits).length,
}

const out = {
  generatedAt: new Date().toISOString(),
  summary,
  services,
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8')
console.log(`[dashboard-manifest] ${services.length} services -> ${OUT}`)
console.log(`  API avg score: ${summary.apiIntegrationPct}%`)
