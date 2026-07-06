#!/usr/bin/env node
/**
 * 브랜딩(로고·파비콘·컬러) + SEO + sitemap + AI 키 상태 종합 점검
 * Usage: node common/scripts/audit-branding-seo-ai.js [--json] [--live]
 */
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const ROOT = path.join(__dirname, '../..')
const PUBLIC = path.join(ROOT, 'common/public')
const JSON_OUT = process.argv.includes('--json')
const LIVE = process.argv.includes('--live')
const SKIP = new Set(['r', 'app', 'node_modules', 'dashboard-manifest.json', 'services-dashboard'])

let getBrand
try {
  getBrand = require('../lib/tenant-branding-config').getBrand
} catch {
  getBrand = (slug) => ({ name: slug, color: '#3B82F6', accent: '#2563EB' })
}

const AI_TENANTS = {
  trips: '/api/trips/ai-status',
  tripsim: '/api/tripsim/ai-status',
  career: '/api/career/ai-status',
  dummy: '/api/dummy/ai-status',
  form: '/api/form/ai-status',
  calli: '/api/calli/status',
  video: '/api/video/status',
  arc: '/api/arc/health',
  healing: '/api/healing/status',
  wonder: '/api/wonder/status',
  brochure: '/api/brochure/ai-status',
  rebrand: '/api/rebrand/ai-status',
  sim: '/api/sim/status',
  blog: '/api/blog/ai-status',
}

function listPublished() {
  if (!fs.existsSync(PUBLIC)) return []
  return fs
    .readdirSync(PUBLIC, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP.has(d.name))
    .filter((d) => fs.existsSync(path.join(PUBLIC, d.name, 'index.html')))
    .map((d) => d.name)
    .sort()
}

function readSafe(f) {
  try {
    return fs.readFileSync(f, 'utf8')
  } catch {
    return ''
  }
}

function hasBrandColor(text, brand) {
  const c = (brand.color || '').toLowerCase()
  const a = (brand.accent || '').toLowerCase()
  const t = text.toLowerCase()
  if (!c) return true
  if (c.startsWith('hsl')) return t.includes('primary') || t.includes('--primary')
  const hex = c.replace('#', '')
  const hexA = a.replace('#', '')
  return t.includes(c) || t.includes(hex) || t.includes(hexA) || t.includes('--primary')
}

function auditTenant(slug) {
  const pub = path.join(PUBLIC, slug)
  const src = path.join(ROOT, slug)
  const brand = getBrand(slug)
  const issues = []
  const warnings = []

  const favSvg = path.join(pub, 'favicon.svg')
  const ogSvg = path.join(pub, 'og-image.svg')
  const appleSvg = path.join(pub, 'apple-touch-icon.svg')
  const sitemap = ['sitemap.xml', 'app/sitemap.xml'].map((p) => path.join(pub, p)).find((p) => fs.existsSync(p))
  const robots = ['robots.txt', 'app/robots.txt'].map((p) => path.join(pub, p)).find((p) => fs.existsSync(p))
  const idx = readSafe(path.join(pub, 'index.html'))
  const logoComp = path.join(src, 'components/brand-logo.tsx')
  const layout = path.join(src, 'app/layout.tsx')
  const globals = path.join(src, 'app/globals.css')

  if (!fs.existsSync(favSvg)) issues.push('missing-published-favicon.svg')
  if (!fs.existsSync(ogSvg)) warnings.push('missing-published-og-image.svg')
  if (!fs.existsSync(appleSvg)) warnings.push('missing-apple-touch-icon.svg')
  if (idx && !/rel=["'](?:shortcut )?icon/i.test(idx)) warnings.push('index-no-favicon-link')
  if (idx && !/og:image/i.test(idx)) warnings.push('index-no-og-image')
  if (idx && /localhost/i.test(idx)) issues.push('localhost-in-index.html')
  if (idx && /vercel\.app/i.test(idx)) issues.push('vercel-in-index.html')

  if (!fs.existsSync(logoComp)) warnings.push('no-brand-logo.tsx')
  else {
    const lc = readSafe(logoComp)
    if (!hasBrandColor(lc, brand) && !lc.includes('BrandLogo')) warnings.push('brand-logo-may-not-use-brand-color')
  }

  if (fs.existsSync(layout)) {
    const lt = readSafe(layout)
    if (!/metadata|generateMetadata/i.test(lt)) warnings.push('layout-no-metadata')
    if (!/icon|favicon/i.test(lt)) warnings.push('layout-no-icon-metadata')
  }

  if (fs.existsSync(globals) && !hasBrandColor(readSafe(globals), brand)) {
    warnings.push('globals.css-brand-color-missing')
  }

  if (!sitemap) issues.push('missing-sitemap')
  else {
    const sm = readSafe(sitemap)
    if (/localhost/i.test(sm)) issues.push('localhost-in-sitemap')
    if (/<loc>\/(?!\/)/.test(sm)) issues.push('relative-loc-in-sitemap')
  }

  if (!robots) issues.push('missing-robots.txt')
  if (!fs.existsSync(path.join(src, 'app/sitemap.ts'))) warnings.push('no-source-sitemap.ts')
  if (!fs.existsSync(path.join(src, 'app/robots.ts'))) warnings.push('no-source-robots.ts')

  const usesAI =
    /generateText|chatGemini|chatWithGemini|openai|@ai-sdk|GEMINI|OPENAI|\/api\/.*ai/i.test(
      walkSrc(slug).join('\n'),
    )
  const aiEndpoint = AI_TENANTS[slug] || null

  return {
    slug,
    brand: brand.name,
    brandColor: brand.color,
    issues,
    warnings,
    usesAI,
    aiEndpoint,
    ok: issues.length === 0,
  }
}

function walkSrc(slug) {
  const dir = path.join(ROOT, slug)
  const out = []
  if (!fs.existsSync(dir)) return out
  function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      if (ent.name.startsWith('.') || ent.name === 'node_modules') continue
      const full = path.join(d, ent.name)
      if (ent.isDirectory()) walk(full)
      else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(readSafe(full))
    }
  }
  walk(dir)
  return out
}

function fetchJson(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(url, { timeout: 12000 }, (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => {
        try {
          resolve({ ok: res.statusCode < 400, status: res.statusCode, data: JSON.parse(body) })
        } catch {
          resolve({ ok: false, status: res.statusCode, data: body.slice(0, 200) })
        }
      })
    })
    req.on('error', (e) => resolve({ ok: false, error: e.message }))
    req.on('timeout', () => {
      req.destroy()
      resolve({ ok: false, error: 'timeout' })
    })
  })
}

async function auditLiveAI() {
  const base = process.env.RESTY_API_BASE || 'https://app.restyart.com'
  const results = []
  for (const [slug, ep] of Object.entries(AI_TENANTS)) {
    const url = `${base}${ep}`
    const r = await fetchJson(url)
    const d = r.data || {}
    let aiOk = false
    let detail = ''
    if (typeof d === 'object') {
      aiOk =
        d.status === 'ok' ||
        d.success === true ||
        d.hasApiKey === true ||
        d.gemini?.valid === true ||
        d.gemini?.configured === true ||
        d.openai?.configured === true ||
        d.environment?.hasOpenAiKey === true ||
        d.openai?.status === 'connected' ||
        d.openai?.status === 'configured'
      detail = JSON.stringify(d).slice(0, 120)
    } else {
      detail = String(d).slice(0, 80)
    }
    results.push({ slug, endpoint: ep, live: r.ok, aiOk, status: r.status, detail })
  }
  return results
}

async function main() {
  const tenants = listPublished()
  const rows = tenants.map(auditTenant)
  const issueRows = rows.filter((r) => r.issues.length > 0)
  const warnRows = rows.filter((r) => r.warnings.length > 0)
  const aiRows = rows.filter((r) => r.usesAI)

  let liveAI = []
  if (LIVE) liveAI = await auditLiveAI()

  const summary = {
    tenants: tenants.length,
    brandingOk: rows.filter((r) => r.ok).length,
    withIssues: issueRows.length,
    withWarnings: warnRows.length,
    aiTenants: aiRows.length,
    liveAI,
  }

  if (JSON_OUT) {
    console.log(JSON.stringify({ summary, rows, liveAI }, null, 2))
    return
  }

  console.log('\n=== 브랜딩·SEO·Sitemap 점검 ===')
  console.log(`테넌트: ${summary.tenants} | 이슈 없음: ${summary.brandingOk} | 이슈: ${summary.withIssues} | 경고: ${summary.withWarnings}`)
  console.log(`AI 사용 테넌트(소스): ${summary.aiTenants}`)

  if (issueRows.length) {
    console.log('\n--- 이슈 (수정 필요) ---')
    for (const r of issueRows) {
      console.log(`  ${r.slug}: ${r.issues.join(', ')}`)
    }
  }

  const warnCounts = {}
  for (const r of warnRows) {
    for (const w of r.warnings) warnCounts[w] = (warnCounts[w] || 0) + 1
  }
  if (Object.keys(warnCounts).length) {
    console.log('\n--- 경고 유형별 ---')
    for (const [k, v] of Object.entries(warnCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${k}: ${v}개`)
    }
  }

  if (LIVE && liveAI.length) {
    console.log('\n--- AI API 라이브 상태 (app.restyart.com) ---')
    for (const r of liveAI) {
      const mark = r.live && r.aiOk ? '✅' : r.live ? '⚠️' : '❌'
      console.log(`  ${mark} ${r.slug} ${r.endpoint} → ${r.detail}`)
    }
    const failed = liveAI.filter((r) => !r.live || !r.aiOk)
    if (failed.length) {
      console.log(`\n  AI 키/엔드포인트 문제: ${failed.map((f) => f.slug).join(', ')}`)
    }
  }

  console.log('\nTip: node common/scripts/audit-branding-seo-ai.js --live --json')
  process.exit(issueRows.length > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
