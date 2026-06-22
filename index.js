const express = require('express')
const fs = require('fs')
const path = require('path')
const httpProxy = require('http-proxy')
const child_process = require('child_process')

const authRoutes = require('./auth/routes')
const userStore = require('./auth/user-store')
const { syncTenantsFromWorkdir, listTenants, isReservedSlug } = require('./auth/tenant')
const { rewriteAbsolutePaths, injectClientPrefixScript, handleTenantRequest, tenantSlugFromHost } = require('./tenant-proxy')

const app = express()
const PORT = process.env.PORT || 4000
const WORKDIR = process.env.WORKDIR || path.resolve(__dirname, '..')
const COPIES_DIR = path.join(__dirname, 'assembled_copies')
const PUBLIC_DIR = path.join(__dirname, 'public')
const ENABLE_DEV_PROXY = process.env.ENABLE_DEV_PROXY === '1' || process.env.ENABLE_DEV_PROXY === 'true'

app.use(express.json())

// Central multi-tenant auth API
app.use('/api/resty', authRoutes)

// Sync tenants from workdir on startup
const db = userStore.getDb()
const tenantCount = syncTenantsFromWorkdir(db, WORKDIR)
console.log(`Synced ${tenantCount} tenants from ${WORKDIR}`)

app.get('/api/tenants', (req, res) => {
  const tenants = listTenants(db).map((t) => ({
    ...t,
    userCount: userStore.countUsersByTenant(t.slug),
  }))
  res.json({ tenants })
})

app.get('/api/projects', (req, res) => {
  fs.readdir(WORKDIR, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(500).json({ error: String(err) })
    const dirs = entries.filter(e => e.isDirectory()).map(d => d.name)
    res.json({ projects: dirs })
  })
})

app.get('/api/published', (req, res) => {
  if (!fs.existsSync(PUBLIC_DIR)) return res.json({ published: [] })
  const published = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => {
      const slug = e.name
      const indexPath = path.join(PUBLIC_DIR, slug, 'index.html')
      return {
        slug,
        hasIndex: fs.existsSync(indexPath),
        url: `/${encodeURIComponent(slug)}/`,
      }
    })
    .filter((p) => p.hasIndex)
  res.json({ published, devProxy: ENABLE_DEV_PROXY })
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
  const seg = (req.path || '').split('/').filter(Boolean)[0]
  if (!seg || !NAKED_APP_SEGMENTS.has(seg)) return next()
  if (isReservedSlug(seg)) return next()
  const published = listPublishedTenants()
  if (published.has(seg)) return next()
  const referer = req.get('referer') || ''
  const m = referer.match(/:\/\/[^/]+\/([a-z0-9_-]+)(?:\/|$)/i)
  if (!m || !published.has(m[1])) return next()
  return res.redirect(302, `/${m[1]}${req.path}`)
})

// 서브도메인 라우팅: light.restyart.com → public/light/ (경로 prefix 없음)
app.use((req, res, next) => {
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
