/**
 * Per-tenant page + API audit for services dashboard detail panel.
 */
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const API_BASE = process.env.RESTY_API_BASE || 'https://app.restyart.com'

const API_INTEGRATIONS = [
  { key: 'auth', label: 'Resty Auth', manifestKey: 'usesRestyAuthEndpoint', endpoint: '/api/resty/auth/login', method: 'POST', body: { subdomain: '', email: '', password: '' } },
  { key: 'credits', label: 'Credits', manifestKey: 'usesCredits', endpoint: '/api/resty/credits/balance', method: 'GET' },
  { key: 'posts', label: 'Posts', manifestKey: 'usesPosts', endpoint: '/api/posts', method: 'GET' },
  { key: 'comments', label: 'Comments', manifestKey: 'usesComments', endpoint: '/api/comments', method: 'GET' },
  { key: 'company', label: 'Company', manifestKey: 'usesCompany', endpoint: '/api/resty_company', method: 'GET' },
]

function normalizePath(p) {
  const clean = (p || '/').split('?')[0]
  if (!clean || clean === '/') return '/'
  return clean.length > 1 && clean.endsWith('/') ? clean.slice(0, -1) : clean
}

function resolveStaticPath(staticRoot, reqPath) {
  const clean = normalizePath(reqPath)
  if (clean === '/') {
    const idx = path.join(staticRoot, 'index.html')
    return fs.existsSync(idx) ? { file: idx, mode: 'index' } : null
  }

  const rel = clean.replace(/^\//, '')

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

  const questionMatch = clean.match(/^\/question\/([^/]+)$/)
  if (questionMatch) {
    const questionId = questionMatch[1]
    const specific = path.join(staticRoot, 'question', `${questionId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, mode: 'html' }
    }
    const questionDir = path.join(staticRoot, 'question')
    if (fs.existsSync(questionDir) && fs.statSync(questionDir).isDirectory()) {
      const shells = fs.readdirSync(questionDir).filter((f) => f.endsWith('.html') && f !== 'page.html')
      if (shells.length > 0) return { file: path.join(questionDir, shells[0]), mode: 'spa-shell' }
    }
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

function parseSitemapLocs(xml) {
  const locs = []
  const re = /<loc>([^<]+)<\/loc>/g
  let m
  while ((m = re.exec(xml))) locs.push(m[1].trim())
  return locs
}

function pathFromLoc(loc, expectedHost) {
  try {
    const u = new URL(loc)
    if (expectedHost && u.hostname !== expectedHost) {
      return { path: normalizePath(u.pathname), hostMismatch: u.hostname }
    }
    return { path: normalizePath(u.pathname), hostMismatch: null }
  } catch {
    return { path: normalizePath(loc), hostMismatch: null }
  }
}

function modeToLevel(mode) {
  if (!mode) return { level: 'error', code: 'NO_STATIC', label: '정적 HTML 없음' }
  if (mode === 'html' || mode === 'index' || mode === 'file' || mode === 'dir-index') {
    return { level: 'ok', code: 'OK', label: '전용 HTML' }
  }
  if (mode === 'spa-shell') return { level: 'warn', code: 'SPA_SHELL', label: 'SPA 셸 (동적 ID)' }
  if (mode === 'spa-fallback') return { level: 'warn', code: 'SPA_FALLBACK', label: '홈 SPA 폴백' }
  if (mode === 'parent-html') return { level: 'warn', code: 'PARENT_HTML', label: '상위 HTML 폴백' }
  return { level: 'info', code: mode.toUpperCase(), label: mode }
}

function probeUrl(url, timeoutMs = 6000) {
  return new Promise((resolve) => {
    let lib
    try {
      lib = new URL(url).protocol === 'https:' ? https : http
    } catch {
      return resolve({ ok: false, status: 0, error: 'bad url' })
    }
    const req = lib.get(url, { timeout: timeoutMs }, (res) => {
      res.resume()
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode })
    })
    req.on('error', (e) => resolve({ ok: false, status: 0, error: e.message }))
    req.on('timeout', () => {
      req.destroy()
      resolve({ ok: false, status: 0, error: 'timeout' })
    })
  })
}

function buildApiActivations(manifestRow) {
  const row = manifestRow || {}
  const integrations = API_INTEGRATIONS.map((def) => ({
    key: def.key,
    label: def.label,
    usedInCode: !!row[def.manifestKey],
    endpoint: def.endpoint,
  }))
  const activated = integrations.filter((i) => i.usedInCode).length
  return {
    activated,
    total: integrations.length,
    integrations,
  }
}

function auditTenantPages(slug, publicDir) {
  const staticRoot = path.join(publicDir, slug)
  const expectedHost = `${slug}.restyart.com`
  const siteBase = `https://${expectedHost}`

  const sitemapCandidates = [
    path.join(staticRoot, 'sitemap.xml'),
    path.join(staticRoot, 'app', 'sitemap.xml'),
    path.join(staticRoot, 'app', 'sitemap.xml.body'),
  ]
  const sitemapPath = sitemapCandidates.find((p) => fs.existsSync(p))

  const problems = []
  const pages = []

  if (!sitemapPath) {
    return {
      hasSitemap: false,
      sitemapCount: 0,
      pages,
      problems: [{ level: 'warn', code: 'NO_SITEMAP', path: null, message: 'sitemap.xml 없음' }],
      summary: { total: 0, ok: 0, warn: 0, error: 1 },
    }
  }

  const sitemapLocs = parseSitemapLocs(fs.readFileSync(sitemapPath, 'utf8'))
  const seen = new Set()

  for (const loc of sitemapLocs) {
    const { path: pagePath, hostMismatch } = pathFromLoc(loc, expectedHost)
    if (seen.has(pagePath)) continue
    seen.add(pagePath)

    if (hostMismatch) {
      const item = {
        path: pagePath,
        url: loc,
        level: 'error',
        code: 'SITEMAP_HOST',
        label: '호스트 불일치',
        inSitemap: true,
        staticMode: null,
        live: null,
      }
      pages.push(item)
      problems.push({ level: 'error', code: 'SITEMAP_HOST', path: pagePath, message: `${loc} (expected ${expectedHost})` })
      continue
    }

    const resolved = resolveStaticPath(staticRoot, pagePath)
    const mode = resolved?.mode || null
    const meta = modeToLevel(mode)
    const item = {
      path: pagePath,
      url: `${siteBase}${pagePath === '/' ? '/' : pagePath}`,
      level: meta.level,
      code: meta.code,
      label: meta.label,
      inSitemap: true,
      staticMode: mode,
      live: null,
    }
    pages.push(item)

    if (meta.level !== 'ok') {
      problems.push({
        level: meta.level,
        code: meta.code,
        path: pagePath,
        message: `${pagePath} — ${meta.label}`,
      })
    }
  }

  const summary = {
    total: pages.length,
    ok: pages.filter((p) => p.level === 'ok').length,
    warn: pages.filter((p) => p.level === 'warn').length,
    error: pages.filter((p) => p.level === 'error').length,
  }

  return { hasSitemap: true, sitemapCount: sitemapLocs.length, pages, problems, summary }
}

async function probeTenantPages(pages, { limit = 24 } = {}) {
  const targets = pages
    .filter((p) => p.level !== 'ok')
    .slice(0, limit)
    .concat(pages.filter((p) => p.level === 'ok').slice(0, Math.max(0, limit - pages.filter((p) => p.level !== 'ok').length)))

  for (let i = 0; i < targets.length; i += 6) {
    const batch = targets.slice(i, i + 6)
    await Promise.all(
      batch.map(async (page) => {
        const live = await probeUrl(page.url)
        page.live = live
        if (!live.ok && page.level === 'ok') {
          page.level = 'error'
          page.code = 'LIVE_404'
          page.label = `라이브 ${live.status || live.error || 'fail'}`
        }
      }),
    )
  }
  return pages
}

function evaluateApiProbe(key, status, message) {
  const msg = String(message || '')
  switch (key) {
    case 'auth':
      return status === 400 && /이메일|비밀번호|email|password/i.test(msg)
    case 'credits':
      return status === 200 || status === 401 || status === 403
    case 'posts':
    case 'comments':
    case 'company':
      return status >= 200 && status < 500
    default:
      return status >= 200 && status < 500
  }
}

function probeApiEndpoint(def, subdomain) {
  return new Promise((resolve) => {
    const url = new URL(def.endpoint, API_BASE)
    const lib = url.protocol === 'https:' ? https : http
    const body =
      def.method === 'POST' && def.body
        ? JSON.stringify({ ...def.body, subdomain: subdomain || def.body.subdomain })
        : null

    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: def.method,
        headers: {
          'content-type': 'application/json',
          ...(body ? { 'content-length': Buffer.byteLength(body) } : {}),
          'x-subdomain': subdomain,
        },
        timeout: 8000,
      },
      (res) => {
        let data = ''
        res.on('data', (c) => {
          if (data.length < 2000) data += c
        })
        res.on('end', () => {
          let message = data.slice(0, 200)
          try {
            const j = JSON.parse(data)
            message = j.message || j.error || message
          } catch (_) {}
          const ok = evaluateApiProbe(def.key, res.statusCode, message)
          resolve({ key: def.key, label: def.label, endpoint: def.endpoint, status: res.statusCode, ok, message: String(message).slice(0, 120) })
        })
      },
    )
    req.on('error', (e) => resolve({ key: def.key, label: def.label, endpoint: def.endpoint, status: 0, ok: false, message: e.message }))
    req.on('timeout', () => {
      req.destroy()
      resolve({ key: def.key, label: def.label, endpoint: def.endpoint, status: 0, ok: false, message: 'timeout' })
    })
    if (body) req.write(body)
    req.end()
  })
}

async function testTenantApis(slug, manifestRow) {
  const activations = buildApiActivations(manifestRow)
  const toTest = API_INTEGRATIONS.filter((def) => activations.integrations.find((i) => i.key === def.key)?.usedInCode)
  if (!toTest.length) {
    return {
      tested: 0,
      passed: 0,
      results: [],
      message: '코드에서 사용 중인 API 연동이 없습니다.',
    }
  }

  const results = []
  for (const def of toTest) {
    results.push(await probeApiEndpoint(def, slug))
  }
  const passed = results.filter((r) => r.ok).length
  return { tested: results.length, passed, results }
}

async function auditTenant(slug, { publicDir, manifestRow, livePages = false } = {}) {
  const pagesAudit = auditTenantPages(slug, publicDir)
  if (livePages && pagesAudit.pages.length) {
    await probeTenantPages(pagesAudit.pages)
    for (const page of pagesAudit.pages) {
      if (page.live && !page.live.ok && page.level === 'ok') {
        pagesAudit.problems.push({
          level: 'error',
          code: 'LIVE_FAIL',
          path: page.path,
          message: `${page.path} — 라이브 ${page.live.status || page.live.error}`,
        })
      }
    }
    pagesAudit.summary = {
      total: pagesAudit.pages.length,
      ok: pagesAudit.pages.filter((p) => p.level === 'ok' && (!p.live || p.live.ok)).length,
      warn: pagesAudit.pages.filter((p) => p.level === 'warn').length,
      error: pagesAudit.pages.filter((p) => p.level === 'error' || (p.live && !p.live.ok)).length,
    }
  }

  const api = buildApiActivations(manifestRow)

  return {
    slug,
    generatedAt: new Date().toISOString(),
    pages: pagesAudit,
    api,
    problemCount: pagesAudit.problems.length,
  }
}

module.exports = {
  API_INTEGRATIONS,
  auditTenant,
  auditTenantPages,
  testTenantApis,
  buildApiActivations,
  probeUrl,
  resolveStaticPath,
  normalizePath,
}
