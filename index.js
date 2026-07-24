const express = require('express')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const httpProxy = require('http-proxy')
const child_process = require('child_process')

const authRoutes = require('./auth/routes')
const userStore = require('./auth/user-store')
const { syncTenantsFromWorkdir, syncTenantsFromPublic, listTenants, isReservedSlug } = require('./auth/tenant')
const { rewriteAbsolutePaths, injectClientPrefixScript, handleTenantRequest, tenantSlugFromHost, isDashboardHost } = require('./tenant-proxy')
const { buildOverview, listPublished, loadManifest } = require('./lib/dashboard-overview')
const { auditTenant, testTenantApis } = require('./lib/dashboard-tenant-audit')
const { registerToonsnapApiRoutes } = require('./toonsnap-api')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return false
  const content = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIndex = line.indexOf('=')
    if (eqIndex < 0) continue
    const key = line.slice(0, eqIndex).trim()
    if (!key || process.env[key] !== undefined) continue
    let value = line.slice(eqIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
  return true
}

loadEnvFile(path.resolve(__dirname, '.env'))
loadEnvFile(path.resolve(__dirname, '..', '.env'))
loadEnvFile('/opt/common/.env')

const app = express()
const PORT = process.env.PORT || 4000
const WORKDIR = process.env.WORKDIR || path.resolve(__dirname, '..')
const RESTY_API_BACKEND = (process.env.RESTY_API_BACKEND || 'http://127.0.0.1:5001').replace(/\/$/, '')
const USE_RESTY_API_PROXY = process.env.USE_RESTY_API_PROXY !== '0'
const COPIES_DIR = path.join(__dirname, 'assembled_copies')
const PUBLIC_DIR = path.join(__dirname, 'public')
const SERVICES_DASHBOARD_DIR = path.join(__dirname, 'services-dashboard')
const ENABLE_DEV_PROXY = process.env.ENABLE_DEV_PROXY === '1' || process.env.ENABLE_DEV_PROXY === 'true'

app.disable('x-powered-by')
app.use(express.json())

function hostWithoutPort(host) {
  return String(host || '').toLowerCase().split(':')[0]
}

function needsSecurityHeaders(host) {
  const h = hostWithoutPort(host)
  if (!h.endsWith('.restyart.com')) return false
  if (h === 'app.restyart.com') return false
  if (isDashboardHost(h)) return false
  return true
}

/** Tenants embeddable in edugame.restyart.com (iframe minigames). */
const EDUGAME_EMBED_HOSTS = new Set([
  'chemistry.restyart.com',
  'physics.restyart.com',
])

/** dashboard.restyart.com Basic Auth — DASHBOARD_BASIC_AUTH=user:pass 또는 USER/PASS */
function getDashboardBasicAuth() {
  const pair = String(process.env.DASHBOARD_BASIC_AUTH || '').trim()
  if (pair.includes(':')) {
    const i = pair.indexOf(':')
    return { user: pair.slice(0, i), pass: pair.slice(i + 1) }
  }
  const user = String(process.env.DASHBOARD_USER || '').trim()
  const pass = String(process.env.DASHBOARD_PASS || '').trim()
  if (user && pass) return { user, pass }
  return null
}

function requireDashboardAccess(req, res, next) {
  if (!isDashboardHost(req.headers.host)) return next()
  const creds = getDashboardBasicAuth()
  if (!creds) return next()
  const header = req.headers.authorization || ''
  if (header.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
      const i = decoded.indexOf(':')
      const user = i >= 0 ? decoded.slice(0, i) : decoded
      const pass = i >= 0 ? decoded.slice(i + 1) : ''
      if (user === creds.user && pass === creds.pass) return next()
    } catch (_) {}
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Restyart Dashboard", charset="UTF-8"')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  return res.status(401).send('Dashboard authentication required')
}

app.use(requireDashboardAccess)

// tenant-wide security baseline headers
app.use((req, res, next) => {
  if (needsSecurityHeaders(req.headers.host)) {
    const host = hostWithoutPort(req.headers.host)
    const embedInEdugame = EDUGAME_EMBED_HOSTS.has(host)
    const frameAncestors = embedInEdugame
      ? "frame-ancestors 'self' https://edugame.restyart.com"
      : "frame-ancestors 'none'"
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    if (!embedInEdugame) {
      res.setHeader('X-Frame-Options', 'DENY')
    }
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader(
      'Permissions-Policy',
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
    )
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; base-uri 'self'; object-src 'none'; " +
      frameAncestors +
      '; ' +
      "img-src 'self' data: blob: https:; font-src 'self' data: https:; " +
      "style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; " +
      "connect-src 'self' https://app.restyart.com https://*.restyart.com https: wss:; " +
      "frame-src 'self' https:; upgrade-insecure-requests"
    )
  }
  next()
})

/** Preserve real client IP through nginx → gateway → resty-api (server weekend fix) */
function applyClientIpHeaders(headers, req) {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '').trim()
  const realIp = String(req.headers['x-real-ip'] || '').trim()
  const socketIp = String(
    req.socket?.remoteAddress || req.connection?.remoteAddress || '',
  ).replace(/^::ffff:/, '')
  const clientIp = forwardedFor.split(',')[0].trim() || realIp || socketIp
  if (clientIp) {
    headers['x-real-ip'] = clientIp
    if (!forwardedFor) headers['x-forwarded-for'] = clientIp
  }
  return clientIp
}

function proxyRestyApiPath(req, res, apiPath) {
  let targetUrl
  try {
    const qIdx = req.originalUrl.indexOf('?')
    const query = qIdx >= 0 ? req.originalUrl.slice(qIdx) : ''
    targetUrl = new URL(`${apiPath}${query}`, RESTY_API_BACKEND)
  } catch (e) {
    return res.status(500).json({ message: '잘못된 API URL', success: false })
  }
  const lib = targetUrl.protocol === 'https:' ? https : http
  const body =
    req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
  const headers = { ...req.headers, host: targetUrl.host }
  applyClientIpHeaders(headers, req)
  if (body) {
    headers['content-type'] = 'application/json'
    headers['content-length'] = Buffer.byteLength(body)
  }
  const proxyReq = lib.request(
    {
      hostname: targetUrl.hostname,
      port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
      proxyRes.pipe(res)
    },
  )
  proxyReq.on('error', (err) => {
    console.error('resty api proxy error', err)
    if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
  })
  if (body) proxyReq.write(body)
  proxyReq.end()
}

// ToonSnap AI (story/image) — must register before catch-all /api/resty proxy
registerToonsnapApiRoutes(app)

// Central multi-tenant auth API — MySQL(resty-api)로 프록시 (기본: :5001)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/resty', (req, res) => {
    const slug = tenantSlugFromHost(req.headers.host)
    if (slug && !req.headers['x-subdomain']) {
      req.headers['x-subdomain'] = slug
    }
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    applyClientIpHeaders(headers, req)
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('resty api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
} else {
  app.use('/api/resty', authRoutes)
}

// resty-api — sim 테넌트 AI 시뮬레이션
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/sim', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('sim api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// secu-scan API proxy (secu-scan.restyart.com)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/scan', (req, res) => {
    proxyRestyApiPath(req, res, '/api/secu/scan')
  })
}

// WonderTale AI (동화·삽화 생성)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/wonder', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('wonder api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// AutoBlogger AI (아웃라인·본문·스타일 분석)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/blog', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('blog api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Classica catalog + 교육부 학교 API + AutoBlogger auth
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  for (const prefix of ['/api/classic', '/api/schools', '/api/naver', '/api/usage']) {
    app.use(prefix, (req, res) => {
      let targetUrl
      try {
        targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
      } catch (e) {
        return res.status(500).json({ message: '잘못된 API URL', success: false })
      }
      const lib = targetUrl.protocol === 'https:' ? https : http
      const body =
        req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
      const headers = { ...req.headers, host: targetUrl.host }
      if (body) {
        headers['content-type'] = 'application/json'
        headers['content-length'] = Buffer.byteLength(body)
      }
      const proxyReq = lib.request(
        {
          hostname: targetUrl.hostname,
          port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
          path: targetUrl.pathname + targetUrl.search,
          method: req.method,
          headers,
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
          proxyRes.pipe(res)
        },
      )
      proxyReq.on('error', (err) => {
        console.error(`${prefix} api proxy error`, err)
        if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
      })
      if (body) proxyReq.write(body)
      proxyReq.end()
    })
  }
}

// 오늘의 한 줄 AI (healing.restyart.com)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/healing', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('healing api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Research stock API (research.restyart.com)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  for (const prefix of ['/api/market', '/api/stock']) {
    app.use(prefix, (req, res) => {
      let targetUrl
      try {
        const apiPath = req.originalUrl
          .replace(/^\/api\/market/, '/api/research/market')
          .replace(/^\/api\/stock\//, '/api/research/stock/')
        targetUrl = new URL(apiPath, RESTY_API_BACKEND)
      } catch (e) {
        return res.status(500).json({ message: '잘못된 API URL', success: false })
      }
      const lib = targetUrl.protocol === 'https:' ? https : http
      const body =
        req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
      const headers = { ...req.headers, host: targetUrl.host }
      if (body) {
        headers['content-type'] = 'application/json'
        headers['content-length'] = Buffer.byteLength(body)
      }
      const proxyReq = lib.request(
        {
          hostname: targetUrl.hostname,
          port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
          path: targetUrl.pathname + targetUrl.search,
          method: req.method,
          headers,
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
          proxyRes.pipe(res)
        },
      )
      proxyReq.on('error', (err) => {
        console.error('research api proxy error', err)
        if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
      })
      if (body) proxyReq.write(body)
      proxyReq.end()
    })
  }
}

// Form / Calli / Sight / Video — tenant subdomain API (정적 배포 → resty-api)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  const TENANT_API_PREFIXES = {
    form: ['/api/generate-template', '/api/share', '/api/health', '/api/download', '/api/ask'],
    calli: ['/api/auth', '/api/artists', '/api/calligraphy-styles', '/api/contact', '/api/system', '/api/monitor'],
    sight: ['/api/analyze', '/api/analyze-screenshot', '/api/validate-key'],
    video: ['/api/analyze-video', '/api/get-youtube-transcript', '/api/search-products', '/api/health', '/api/test-endpoints'],
    'book-review': ['/api/search'],
    search: ['/api/ai-search', '/api/search', '/api/suggestions', '/api/popular'],
    english: ['/api/status', '/api/chat', '/api/translate'],
  }

  // Posts / Comments / Likes — 모든 테넌트 공통 (x-subdomain = Host 서브도메인)
  const SOCIAL_API_PREFIXES = ['/api/posts', '/api/comments', '/api/likes']
  app.use((req, res, next) => {
    if (!SOCIAL_API_PREFIXES.some((p) => req.originalUrl === p || req.originalUrl.startsWith(`${p}/`) || req.originalUrl.startsWith(`${p}?`))) {
      return next()
    }
    const slug = tenantSlugFromHost(req.headers.host)
    if (slug && !req.headers['x-subdomain']) {
      req.headers['x-subdomain'] = slug
    }
    proxyRestyApiPath(req, res, req.originalUrl.split('?')[0])
  })

  // Bible search/read — light 등 테넌트 same-origin /api/bible/* → resty-api (테넌트 prefix 붙이지 않음)
  app.use((req, res, next) => {
    const pathOnly = (req.originalUrl || '').split('?')[0]
    if (pathOnly !== '/api/bible' && !pathOnly.startsWith('/api/bible/')) return next()
    const slug = tenantSlugFromHost(req.headers.host)
    if (slug && !req.headers['x-subdomain']) {
      req.headers['x-subdomain'] = slug
    }
    proxyRestyApiPath(req, res, pathOnly)
  })

  // Churches (light) — same-origin /api/churches*
  app.use((req, res, next) => {
    const pathOnly = (req.originalUrl || '').split('?')[0]
    if (pathOnly !== '/api/churches' && !pathOnly.startsWith('/api/churches/')) return next()
    const slug = tenantSlugFromHost(req.headers.host)
    if (slug && !req.headers['x-subdomain']) {
      req.headers['x-subdomain'] = slug
    }
    proxyRestyApiPath(req, res, pathOnly)
  })

  app.use('/api/ask', (req, res) => {
    const slug = tenantSlugFromHost(req.headers.host)
    if (slug && !req.headers['x-subdomain']) {
      req.headers['x-subdomain'] = slug
    }
    proxyRestyApiPath(req, res, '/api/ask')
  })

  app.use((req, res, next) => {
    if (!req.originalUrl.startsWith('/api/')) return next()
    const slug = tenantSlugFromHost(req.headers.host)
    if (!slug || !TENANT_API_PREFIXES[slug]) return next()
    const prefixes = TENANT_API_PREFIXES[slug]
    const matched = prefixes.some(
      (p) => req.originalUrl === p || req.originalUrl.startsWith(`${p}/`) || req.originalUrl.startsWith(`${p}?`),
    )
    if (!matched) return next()
    const suffix = req.originalUrl.replace(/^\/api/, '')
    proxyRestyApiPath(req, res, `/api/${slug}${suffix}`)
  })
}

// Sports pickup matches + Mind counseling
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  for (const prefix of ['/api/sports', '/api/mind']) {
    app.use(prefix, (req, res) => {
      proxyRestyApiPath(req, res, req.originalUrl.split('?')[0])
    })
  }
}

// MyQBank AI (문제 생성)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/qbank', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('qbank api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// VTest 면접 AI
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/vtest', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('vtest api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Portfolio 문의 (Resend)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/portfolio', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('portfolio api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// TRIPS 여행 계획 AI
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/trips', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('trips api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// TripSim 여행 시뮬레이션 AI
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/tripsim', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('tripsim api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Brochure Maker AI (카피라이팅)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/brochure', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('brochure api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Insight Arc (전자책 스토어 / 서재)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/arc', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('arc api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// TimeMap Korea (역사 시대·사건 API)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/history', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('history api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// QBox — 질문 한도 API
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/qbox', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('qbox api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// AppIcon AI (앱 아이콘 생성)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/appicon', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('appicon api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Poster AI (포스터·인쇄물 생성)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/poster', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('poster api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// LogoStage AI (브랜드 분석 + 로고 생성)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/logo', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('logo api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// 우광교회 사진·콘텐츠 API (resty-api data/church)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/church', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('church api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Recipe CRUD (resty-api MySQL)
if (USE_RESTY_API_PROXY && RESTY_API_BACKEND) {
  app.use('/api/recipes', (req, res) => {
    let targetUrl
    try {
      targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
    } catch (e) {
      return res.status(500).json({ message: '잘못된 API URL', success: false })
    }
    const lib = targetUrl.protocol === 'https:' ? https : http
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
    const headers = { ...req.headers, host: targetUrl.host }
    if (body) {
      headers['content-type'] = 'application/json'
      headers['content-length'] = Buffer.byteLength(body)
    }
    const proxyReq = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res)
      },
    )
    proxyReq.on('error', (err) => {
      console.error('recipes api proxy error', err)
      if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
    })
    if (body) proxyReq.write(body)
    proxyReq.end()
  })
}

// Sync tenants from workdir on startup
const db = userStore.getDb()
const tenantCount = syncTenantsFromWorkdir(db, WORKDIR) + syncTenantsFromPublic(db, PUBLIC_DIR)
console.log(`Synced ${tenantCount} tenants from ${WORKDIR} + public/`)

app.get('/api/tenants', (req, res) => {
  const tenants = listTenants(db).map((t) => ({
    ...t,
    userCount: userStore.countUsersByTenant(t.slug),
  }))
  res.json({ tenants })
})

app.get('/api/projects', (req, res) => {
  const published = listPublished(PUBLIC_DIR)
  if (published.length) {
    return res.json({ projects: published, source: 'published' })
  }
  fs.readdir(WORKDIR, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(500).json({ error: String(err) })
    const dirs = entries.filter(e => e.isDirectory()).map(d => d.name)
    res.json({ projects: dirs, source: 'workdir' })
  })
})

app.get('/api/published', (req, res) => {
  if (!fs.existsSync(PUBLIC_DIR)) return res.json({ published: [] })
  const published = listPublished(PUBLIC_DIR).map((slug) => ({
    slug,
    hasIndex: true,
    url: `/${encodeURIComponent(slug)}/`,
    siteUrl: `https://${slug}.restyart.com/`,
  }))
  res.json({ published, devProxy: ENABLE_DEV_PROXY })
})

app.get('/api/dashboard/overview', async (req, res) => {
  try {
    const live = req.query.live !== '0'
    const data = await buildOverview({ publicDir: PUBLIC_DIR, live })
    res.json(data)
  } catch (e) {
    console.error('dashboard overview error', e)
    res.status(500).json({ error: String(e.message || e) })
  }
})

app.get('/api/dashboard/tenant/:slug/audit', async (req, res) => {
  try {
    const slug = req.params.slug
    if (!slug || !/^[a-z0-9_-]+$/i.test(slug)) {
      return res.status(400).json({ error: 'invalid slug' })
    }
    const manifest = loadManifest(PUBLIC_DIR)
    const livePages = req.query.live !== '0'
    const data = await auditTenant(slug, {
      publicDir: PUBLIC_DIR,
      manifestRow: manifest.byTenant[slug],
      livePages,
    })
    res.json(data)
  } catch (e) {
    console.error('dashboard tenant audit error', e)
    res.status(500).json({ error: String(e.message || e) })
  }
})

app.post('/api/dashboard/tenant/:slug/test-api', async (req, res) => {
  try {
    const slug = req.params.slug
    if (!slug || !/^[a-z0-9_-]+$/i.test(slug)) {
      return res.status(400).json({ error: 'invalid slug' })
    }
    const manifest = loadManifest(PUBLIC_DIR)
    const data = await testTenantApis(slug, manifest.byTenant[slug])
    res.json({ slug, ...data })
  } catch (e) {
    console.error('dashboard api test error', e)
    res.status(500).json({ error: String(e.message || e) })
  }
})

// Usage stats (resty-api MySQL) — always register so UI never gets opaque Express 404
app.use('/api/dashboard/usage', (req, res) => {
  if (!USE_RESTY_API_PROXY || !RESTY_API_BACKEND) {
    return res.status(503).json({
      success: false,
      message: 'usage API proxy disabled (USE_RESTY_API_PROXY / RESTY_API_BACKEND)',
    })
  }
  // Bare /api/dashboard/usage → summary (UI/error text "usage 404" 방지)
  const bare = (req.path || '/') === '/' || req.path === ''
  if (bare && (req.method === 'GET' || req.method === 'HEAD')) {
    const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
    req.url = `/summary${q}`
    req.originalUrl = `/api/dashboard/usage/summary${q}`
  }
  let targetUrl
  try {
    targetUrl = new URL(req.originalUrl, RESTY_API_BACKEND)
  } catch (e) {
    return res.status(500).json({ message: '잘못된 API URL', success: false })
  }
  const lib = targetUrl.protocol === 'https:' ? https : http
  const body =
    req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body || {}) : null
  const headers = { ...req.headers, host: targetUrl.host }
  applyClientIpHeaders(headers, req)
  if (body) {
    headers['content-type'] = 'application/json'
    headers['content-length'] = Buffer.byteLength(body)
  }
  const proxyReq = lib.request(
    {
      hostname: targetUrl.hostname,
      port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
      proxyRes.pipe(res)
    },
  )
  proxyReq.on('error', (err) => {
    console.error('dashboard usage proxy error', err)
    if (!res.headersSent) res.status(502).json({ message: 'API 서버 연결 실패', success: false })
  })
  if (body) proxyReq.write(body)
  proxyReq.end()
})

app.get('/api/config', (req, res) => {
  res.json({ devProxy: ENABLE_DEV_PROXY, port: PORT })
})

app.get('/api/assembled', (req, res) => {
  const assembledRoot = path.join(__dirname, 'assembled_copies')
  fs.readdir(assembledRoot, { withFileTypes: true }, (err, entries) => {
    if (err) return res.json({ projects: [] })
    const names = entries.filter(e => e.isDirectory() || e.isSymbolicLink()).map(d => d.name)
    res.json({ projects: names })
  })
})

const proxy = httpProxy.createProxyServer({ changeOrigin: true })

proxy.on('proxyRes', function(proxyRes, req, res) {
  const zlib = require('zlib')
  try {
    if (req?.headers?.['x-dashboard-skip-rewrite'] === '1' || req?.headers?.['x-dashboard-skip-rewrite'] === 'true') {
      return
    }
    if (res?.headersSent) return

    const ct = (proxyRes.headers?.['content-type'] || proxyRes.headers?.['Content-Type'] || '')
    if (!/text\/html/i.test(ct) && !/text\/css/i.test(ct)) {
      try { if (res?.headersSent) { proxyRes.pipe(res); return } } catch (_) {}
      proxyRes.pipe(res)
      return
    }

    const enc = (proxyRes.headers?.['content-encoding'] || proxyRes.headers?.['Content-Encoding'] || '').toLowerCase()
    const chunks = []
    proxyRes.on('data', (chunk) => { chunks.push(chunk) })
    proxyRes.on('end', () => {
      try {
        let buffer = Buffer.concat(chunks)
        if (enc === 'gzip') buffer = zlib.gunzipSync(buffer)
        else if (enc === 'deflate') buffer = zlib.inflateSync(buffer)
        else if ((enc === 'br' || enc === 'brotli') && zlib.brotliDecompress) {
          buffer = zlib.brotliDecompressSync(buffer)
        }

        let body = buffer.toString('utf8')
        const name = req._dashboard_name || req.headers?.['x-dashboard-name']
        const prefixStyle = req._dashboard_prefix_style || 'path'
        if (name) {
          if (/text\/html/i.test(ct)) {
            body = rewriteAbsolutePaths(body, name, prefixStyle)
            body = injectClientPrefixScript(body, name, prefixStyle)
          } else if (/text\/css/i.test(ct)) {
            const prefix = prefixStyle === 'legacy'
              ? `/r/${encodeURIComponent(name)}`
              : `/${encodeURIComponent(name)}`
            body = body.replace(/url\((['"]?)\/(?!\/|https?:)([^)"']*)\1\)/gi, `url($1${prefix}/$2$1)`)
          }
        }

        if (res?.headersSent) return
        Object.keys(proxyRes.headers || {}).forEach(h => {
          if (/^content-length$/i.test(h) || /^content-encoding$/i.test(h)) return
          try { res.setHeader(h, proxyRes.headers[h]) } catch (_) {}
        })
        const outBuf = Buffer.from(body, 'utf8')
        try { res.setHeader('content-length', outBuf.length) } catch (_) {}
        if (/text\/css/i.test(ct)) res.setHeader('content-type', 'text/css; charset=utf-8')
        else res.setHeader('content-type', 'text/html; charset=utf-8')
        res.end(outBuf)
      } catch (e) {
        console.error('error handling proxied html', e)
        try { proxyRes.pipe(res) } catch (_) { res.end() }
      }
    })
  } catch (e) {
    console.error('proxyRes handler error', e)
    proxyRes.pipe(res)
  }
})

const procMap = {}
let nextPort = 5000
function allocatePort() { nextPort += 1; return nextPort }

app.post('/api/start/:name', (req, res) => {
  if (!ENABLE_DEV_PROXY) {
    return res.status(403).json({
      error: 'dev proxy disabled',
      hint: '정적 배포: ./publish.sh ' + req.params.name,
    })
  }
  const name = req.params.name
  if (procMap[name]) return res.status(400).json({ error: 'already running' })
  const cwdCandidates = [path.join(COPIES_DIR, name), path.join(WORKDIR, name)]
  let cwd = null
  for (const c of cwdCandidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) { cwd = c; break }
  }
  if (!cwd) return res.status(404).json({ error: 'project not found' })
  let pkg = {}
  try { pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')) } catch (_) { pkg = {} }
  const port = allocatePort()
  const userEnv = (req.body?.env && typeof req.body.env === 'object') ? req.body.env : {}
  const env = Object.assign({}, process.env, userEnv, { PORT: port })
  let cmd
  if (pkg.scripts?.start) cmd = 'npm run start'
  else if (pkg.scripts?.dev) cmd = 'npm run dev'
  else return res.status(400).json({ error: 'no start/dev script found in package.json' })
  const proc = child_process.spawn('bash', ['-lc', cmd], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
  proc.stdout.on('data', d => console.log(`[${name}] ${d.toString().trim()}`))
  proc.stderr.on('data', d => console.error(`[${name}] ERR ${d.toString().trim()}`))
  proc.on('exit', (code, sig) => { console.log(`${name} exited ${code}/${sig}`); delete procMap[name] })
  procMap[name] = { pid: proc.pid, port, proc }
  res.json({ name, pid: proc.pid, port })
})

app.post('/api/stop/:name', (req, res) => {
  const name = req.params.name
  const info = procMap[name]
  if (!info) return res.status(404).json({ error: 'not running' })
  try { process.kill(info.pid, 'SIGTERM') } catch (_) {}
  delete procMap[name]
  res.json({ stopped: name })
})

app.post('/api/register/:name', (req, res) => {
  const name = req.params.name
  const { pid, port } = req.body || {}
  if (!pid || !port) return res.status(400).json({ error: 'pid and port required' })
  procMap[name] = { pid, port, proc: null }
  res.json({ registered: name, pid, port })
})

app.get('/api/status/:name', (req, res) => {
  const name = req.params.name
  const info = procMap[name]
  if (!info) return res.json({ running: false })
  res.json({ running: true, pid: info.pid, port: info.port })
})

function tenantHandler(prefixStyle) {
  return (req, res) => {
    const name = req.params.name || req.params.tenant
    handleTenantRequest({
      req, res, name, prefixStyle,
      publicDir: PUBLIC_DIR,
      copiesDir: COPIES_DIR,
      procMap: ENABLE_DEV_PROXY ? procMap : {},
      proxy,
    })
  }
}

// Legacy proxy: /r/:name/*
app.use('/r/:name', tenantHandler('legacy'))

// 테넌트 prefix 없이 /bible/... 등으로 요청 시 Referer 기반 redirect
const NAKED_APP_SEGMENTS = new Set([
  'bible', 'qt', 'post', 'popular', 'churches', 'favorites', 'profile', 'credits', 'church',
  'store', 'library', 'login', 'register', 'create', 'authors', 'bundles', 'insights', 'monitor',
  'simulation', 'results', 'admin',
])
function listPublishedTenants() {
  if (!fs.existsSync(PUBLIC_DIR)) return new Set()
  return new Set(
    fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.') && fs.existsSync(path.join(PUBLIC_DIR, e.name, 'index.html')))
      .map((e) => e.name),
  )
}
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  // 서브도메인 테넌트(arc.restyart.com 등)에서는 path segment가 앱 라우트다.
  // Referer /library 를 테넌트명으로 오인해 /library/insights 로 302 하던 문제 방지.
  if (tenantSlugFromHost(req.headers.host)) return next()
  const seg = (req.path || '').split('/').filter(Boolean)[0]
  if (!seg || !NAKED_APP_SEGMENTS.has(seg)) return next()
  if (isReservedSlug(seg)) return next()
  const published = listPublishedTenants()
  if (published.has(seg)) return next()
  const referer = req.get('referer') || ''
  // path-style 호스트에서만 동작: referer 가 이미 서브도메인 테넌트면 skip
  try {
    const refHost = referer ? new URL(referer).host : ''
    if (refHost && tenantSlugFromHost(refHost)) return next()
  } catch (_) {}
  const m = referer.match(/:\/\/[^/]+\/([a-z0-9_-]+)(?:\/|$)/i)
  if (!m || !published.has(m[1])) return next()
  return res.redirect(302, `/${m[1]}${req.path}`)
})

function sendServicesDashboardFile(res, filename) {
  const file = path.join(SERVICES_DASHBOARD_DIR, filename)
  if (!fs.existsSync(file)) return false
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  res.setHeader('Cache-Control', 'private, no-store')
  res.sendFile(file)
  return true
}

// dashboard.restyart.com → 서비스 대시보드 (tenant publish로 index.html이 덮이는 것 방지)
app.use((req, res, next) => {
  if (!isDashboardHost(req.headers.host)) return next()
  const p = (req.path || '/').split('?')[0]
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  res.setHeader('Cache-Control', 'private, no-store')
  if (p.startsWith('/api/')) return next()
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()

  if (p === '/robots.txt') {
    res.type('text/plain').send(
      '# Internal ops dashboard — do not index\nUser-agent: *\nDisallow: /\n',
    )
    return
  }
  if (p === '/sitemap.xml') {
    res.type('application/xml').send(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n',
    )
    return
  }
  if (p === '/' || p === '/index.html') {
    if (sendServicesDashboardFile(res, 'index.html')) return
  }
  if (p === '/app.js') {
    if (sendServicesDashboardFile(res, 'app.js')) return
  }
  return next()
})

// 게이트웨이 루트(/) — 테넌트 서브도메인이 아닐 때 서비스 대시보드
app.get(['/', '/index.html', '/app.js'], (req, res, next) => {
  if (tenantSlugFromHost(req.headers.host)) return next()
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  const p = (req.path || '/').split('?')[0]
  const file = p === '/app.js' ? 'app.js' : 'index.html'
  if (sendServicesDashboardFile(res, file)) return
  return next()
})

// 서브도메인 테넌트의 중복 경로 prefix 제거 (server weekend fix)
// e.g. toonsnap.restyart.com/toonsnap/... → /...
app.use((req, res, next) => {
  const slug = tenantSlugFromHost(req.headers.host)
  if (!slug) return next()
  const prefix = `/${slug}`
  if (req.path === prefix || req.path.startsWith(`${prefix}/`)) {
    const target = req.url.slice(prefix.length) || '/'
    return res.redirect(302, target)
  }
  return next()
})

// 서브도메인 라우팅: light.restyart.com → public/light/ (경로 prefix 없음)
app.use((req, res, next) => {
  if ((req.path || '').startsWith('/api/')) return next()
  const slug = tenantSlugFromHost(req.headers.host)
  if (!slug) return next()
  const staticDir = path.join(PUBLIC_DIR, slug)
  const hasStatic = fs.existsSync(staticDir) && fs.statSync(staticDir).isDirectory()
  const hasDev = ENABLE_DEV_PROXY && procMap[slug]
  if (!hasStatic && !hasDev) return next()
  req.params = { ...req.params, name: slug }
  return handleTenantRequest({
    req, res, name: slug, prefixStyle: 'subdomain',
    publicDir: PUBLIC_DIR,
    copiesDir: COPIES_DIR,
    procMap: ENABLE_DEV_PROXY ? procMap : {},
    proxy,
  })
})

// Path-based tenant router: /:tenant/*
app.use('/:tenant', (req, res, next) => {
  const tenant = req.params.tenant
  if (isReservedSlug(tenant)) return next()
  const staticDir = path.join(PUBLIC_DIR, tenant)
  const hasStatic = fs.existsSync(staticDir) && fs.statSync(staticDir).isDirectory()
  const hasDev = ENABLE_DEV_PROXY && procMap[tenant]
  if (!hasStatic && !hasDev) return next()
  req.params.name = tenant
  tenantHandler('path')(req, res)
})

// Backwards-compatible assembled projects
app.use('/projects/assembled/:name', (req, res, next) => {
  const name = req.params.name
  try {
    const root = path.join(COPIES_DIR, name)
    const assembledPublic = path.join(root, 'public')
    const reqPath = decodeURIComponent((req.url || '/').split('?')[0])
    const candidatePublic = path.join(assembledPublic, reqPath)
    if (fs.existsSync(candidatePublic) && fs.statSync(candidatePublic).isFile()) {
      return res.sendFile(candidatePublic)
    }
    const candidates = [
      path.join(root, 'public', 'index.html'),
      path.join(root, 'out', 'index.html'),
      path.join(root, 'index.html'),
    ]
    for (const c of candidates) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        let html = fs.readFileSync(c, 'utf8')
        if (!/<base[^>]*href=/i.test(html)) {
          html = html.replace(/<head([^>]*)>/i, `<head$1>\n<base href="/projects/assembled/${encodeURIComponent(name)}/">`)
        }
        res.setHeader('content-type', 'text/html; charset=utf-8')
        return res.send(html)
      }
    }
  } catch (_) {}

  const info = ENABLE_DEV_PROXY ? procMap[name] : null
  if (info?.port) {
    try {
      const prefix = `/projects/assembled/${name}`
      if (req.url?.startsWith(prefix)) req.url = req.url.slice(prefix.length) || '/'
    } catch (_) {}
    req.headers = req.headers || {}
    req.headers['x-dashboard-skip-rewrite'] = '1'
    return proxy.web(req, res, { target: `http://127.0.0.1:${info.port}`, changeOrigin: true }, (err) => {
      console.error('projects proxy error', err)
      res.status(502).send('Bad gateway')
    })
  }
  return next()
})

app.use(express.static(PUBLIC_DIR))

app.listen(PORT, () => {
  console.log(`Common dashboard running on http://localhost:${PORT}`)
  console.log(`Serving projects from ${WORKDIR}`)
  console.log(`Mode: static-only (publish → public/{tenant}/). Dev proxy: ${ENABLE_DEV_PROXY ? 'ON' : 'OFF'}`)
})
