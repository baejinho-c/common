const { buildApiActivations, auditTenantPages } = require('./dashboard-tenant-audit')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const SKIP_SLUGS = new Set(['app', 'r', 'common', 'node_modules'])

const FAVICON_CANDIDATES = [
  'favicon.ico',
  'favicon.svg',
  'icon.png',
  'apple-icon.png',
  'favicon.png',
  'apple-touch-icon.png',
  'apple-touch-icon.svg',
]

const OG_CANDIDATES = ['og-image.png', 'og-image.jpg', 'og-image.svg', 'opengraph-image.png']

function findBrandingFile(publicDir, slug, names) {
  for (const name of names) {
    const p = path.join(publicDir, slug, name)
    if (fs.existsSync(p)) return { path: p, name }
  }
  return null
}

function extractMetaContent(html, property) {
  const re1 = new RegExp(`property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')
  const re2 = new RegExp(`content=["']([^"']+)["'][^>]*property=["']${property}["']`, 'i')
  const m = html.match(re1) || html.match(re2)
  return m ? m[1].trim() : ''
}

function extractIconHref(html) {
  const re1 = /rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i
  const re2 = /href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i
  const m = html.match(re1) || html.match(re2)
  return m ? m[1].trim() : ''
}

function resolveTenantAssetUrl(slug, href) {
  if (!href) return null
  if (/^https?:\/\//i.test(href)) return href
  const clean = href.replace(/^\//, '')
  if (clean.startsWith(`${slug}/`)) return `https://${slug}.restyart.com/${clean.slice(slug.length + 1)}`
  return `https://${slug}.restyart.com/${clean}`
}

function analyzeBranding(slug, publicDir) {
  const indexPath = path.join(publicDir, slug, 'index.html')
  let html = ''
  try {
    if (fs.existsSync(indexPath)) html = fs.readFileSync(indexPath, 'utf8')
  } catch (_) {}

  const favFile = findBrandingFile(publicDir, slug, FAVICON_CANDIDATES)
  const ogFile = findBrandingFile(publicDir, slug, OG_CANDIDATES)
  const iconHref = extractIconHref(html)
  const ogMeta = extractMetaContent(html, 'og:image')
  const ogTitle = extractMetaContent(html, 'og:title')
  const ogUrl = extractMetaContent(html, 'og:url')

  const faviconUrl = favFile
    ? `https://${slug}.restyart.com/${favFile.name}`
    : resolveTenantAssetUrl(slug, iconHref)

  const ogImageUrl = ogFile
    ? `https://${slug}.restyart.com/${ogFile.name}`
    : resolveTenantAssetUrl(slug, ogMeta)

  const hasFaviconFile = !!favFile
  const hasFaviconLink = !!iconHref
  const hasFavicon = hasFaviconFile || hasFaviconLink
  const hasOgFile = !!ogFile
  const hasOgMeta = !!ogMeta
  const hasOgImage = hasOgFile || hasOgMeta

  const seoIssues = []
  if (!hasFavicon) seoIssues.push('favicon_missing')
  else if (hasFaviconLink && !hasFaviconFile) seoIssues.push('favicon_link_only')
  if (!hasOgImage) seoIssues.push('og_image_missing')
  if (ogUrl && /localhost|vercel\.app/i.test(ogUrl)) seoIssues.push('og_url_stale')
  if (ogMeta && /localhost|vercel\.app|placeholder/i.test(ogMeta)) seoIssues.push('og_image_stale')

  let seoScore = 0
  if (hasFaviconFile) seoScore += 25
  else if (hasFaviconLink) seoScore += 12
  if (hasOgFile) seoScore += 25
  else if (hasOgMeta) seoScore += 12
  if (ogTitle) seoScore += 10
  if (ogUrl && !/localhost|vercel\.app/i.test(ogUrl)) seoScore += 10

  return {
    faviconUrl,
    ogImageUrl,
    hasFavicon,
    hasFaviconFile,
    hasOgImage,
    hasOgFile,
    ogTitle: ogTitle || null,
    ogUrl: ogUrl || null,
    seoIssues,
    seoScore,
  }
}

function findSeoFile(publicDir, slug, name) {
  const candidates = [
    path.join(publicDir, slug, name),
    path.join(publicDir, slug, 'app', name),
  ]
  return candidates.find((p) => fs.existsSync(p)) || null
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return m ? m[1].trim().slice(0, 120) : ''
}

function probeUrl(url, timeoutMs = 8000) {
  return new Promise((resolve) => {
    let lib
    try {
      lib = new URL(url).protocol === 'https:' ? https : http
    } catch (e) {
      return resolve({ ok: false, status: 0, error: 'bad url' })
    }
    const req = lib.get(url, { timeout: timeoutMs }, (res) => {
      let body = ''
      res.on('data', (c) => {
        if (body.length < 12000) body += c
      })
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 400,
          status: res.statusCode,
          title: extractTitle(body),
          hasLocalhost: /localhost:\d+/i.test(body.slice(0, 8000)),
        })
      })
    })
    req.on('error', (e) => resolve({ ok: false, status: 0, error: e.message }))
    req.on('timeout', () => {
      req.destroy()
      resolve({ ok: false, status: 0, error: 'timeout' })
    })
  })
}

function listPublished(publicDir) {
  if (!fs.existsSync(publicDir)) return []
  return fs
    .readdirSync(publicDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !SKIP_SLUGS.has(e.name))
    .filter((e) => fs.existsSync(path.join(publicDir, e.name, 'index.html')))
    .map((e) => e.name)
    .sort()
}

function loadManifest(publicDir) {
  const file = path.join(publicDir, 'dashboard-manifest.json')
  if (!fs.existsSync(file)) return { byTenant: {}, generatedAt: null }
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const byTenant = {}
    for (const row of data.services || []) byTenant[row.tenant] = row
    return { byTenant, generatedAt: data.generatedAt, summary: data.summary }
  } catch {
    return { byTenant: {}, generatedAt: null }
  }
}

function apiScoreFromRow(row) {
  if (!row) return null
  if (row.apiScore != null) return row.apiScore
  const order = { 'P0-critical': 15, 'P1-high': 45, 'P2-medium': 72, 'P3-low': 88, skip: 0 }
  return order[row.priority] ?? 50
}

function buildStaticService(slug, publicDir, manifestRow) {
  const sitemapPath = findSeoFile(publicDir, slug, 'sitemap.xml')
  const robotsPath = findSeoFile(publicDir, slug, 'robots.txt')
  const indexPath = path.join(publicDir, slug, 'index.html')
  let indexTitle = ''
  try {
    if (fs.existsSync(indexPath)) indexTitle = extractTitle(fs.readFileSync(indexPath, 'utf8'))
  } catch (_) {}

  const api = manifestRow || {}
  const score = apiScoreFromRow(api)
  const branding = analyzeBranding(slug, publicDir)

  const seoBase = (branding.seoScore || 0) + (sitemapPath ? 15 : 0) + (robotsPath ? 15 : 0)
  const seoEfficiency = Math.min(100, seoBase)
  const apiActivations = buildApiActivations(api)
  const pageAudit = auditTenantPages(slug, publicDir)

  return {
    slug,
    siteUrl: `https://${slug}.restyart.com/`,
    previewUrl: `https://${slug}.restyart.com/`,
    title: api.title || indexTitle || slug,
    published: true,
    branding: {
      faviconUrl: branding.faviconUrl,
      ogImageUrl: branding.ogImageUrl,
      hasFavicon: branding.hasFavicon,
      hasFaviconFile: branding.hasFaviconFile,
      hasOgImage: branding.hasOgImage,
      hasOgFile: branding.hasOgFile,
      ogTitle: branding.ogTitle,
    },
    seo: {
      sitemap: !!sitemapPath,
      robots: !!robotsPath,
      sitemapUrl: sitemapPath ? `https://${slug}.restyart.com/sitemap.xml` : null,
      robotsUrl: robotsPath ? `https://${slug}.restyart.com/robots.txt` : null,
      sourceSitemap: !!api.hasSourceSitemap,
      sourceRobots: !!api.hasSourceRobots,
      efficiency: seoEfficiency,
      issues: branding.seoIssues,
      faviconOk: branding.hasFaviconFile,
      ogImageOk: branding.hasOgFile || branding.hasOgImage,
      pageProblems: pageAudit.problems.length,
      sitemapPages: pageAudit.summary?.total || 0,
      sitemapOk: pageAudit.summary?.ok || 0,
    },
    api: {
      score,
      priority: api.priority || 'unknown',
      authPattern: api.authPattern || 'unknown',
      usesRestyAuth: !!api.usesRestyAuthEndpoint,
      usesCredits: !!api.usesCredits,
      usesPosts: !!api.usesPosts,
      usesComments: !!api.usesComments,
      usesCompany: !!api.usesCompany,
      activations: apiActivations,
      hasTerms: !!api.hasTerms,
      hasPrivacy: !!api.hasPrivacy,
      issues: api.issues || [],
    },
    live: null,
  }
}

async function buildOverview({ publicDir, live = true, concurrency = 8 }) {
  const slugs = listPublished(publicDir)
  const manifest = loadManifest(publicDir)
  const services = slugs.map((slug) =>
    buildStaticService(slug, publicDir, manifest.byTenant[slug]),
  )

  if (live) {
    for (let i = 0; i < services.length; i += concurrency) {
      const batch = services.slice(i, i + concurrency)
      await Promise.all(
        batch.map(async (svc) => {
          const [home, sitemap, robots] = await Promise.all([
            probeUrl(svc.siteUrl),
            svc.seo.sitemapUrl ? probeUrl(svc.seo.sitemapUrl) : Promise.resolve(null),
            svc.seo.robotsUrl ? probeUrl(svc.seo.robotsUrl) : Promise.resolve(null),
          ])
          svc.live = {
            home,
            sitemap: sitemap ? { ok: sitemap.ok, status: sitemap.status } : null,
            robots: robots ? { ok: robots.ok, status: robots.status } : null,
          }
          if (home.title) svc.title = home.title
        }),
      )
    }
  }

  const liveCount = services.filter((s) => s.live?.home?.ok).length
  const seoCount = services.filter((s) => s.seo.sitemap && s.seo.robots).length
  const faviconCount = services.filter((s) => s.branding?.hasFaviconFile).length
  const ogCount = services.filter((s) => s.branding?.hasOgImage).length
  const seoEffAvg = services.length
    ? Math.round(services.reduce((a, s) => a + (s.seo.efficiency || 0), 0) / services.length)
    : 0
  const scored = services.filter((s) => s.api.score != null)
  const apiAvg = scored.length
    ? Math.round(scored.reduce((a, s) => a + s.api.score, 0) / scored.length)
    : null

  return {
    generatedAt: new Date().toISOString(),
    manifestAt: manifest.generatedAt,
    summary: {
      total: services.length,
      live: liveCount,
      livePct: services.length ? Math.round((liveCount / services.length) * 100) : 0,
      seoComplete: seoCount,
      seoPct: services.length ? Math.round((seoCount / services.length) * 100) : 0,
      seoEfficiencyPct: seoEffAvg,
      faviconComplete: faviconCount,
      faviconPct: services.length ? Math.round((faviconCount / services.length) * 100) : 0,
      ogImageComplete: ogCount,
      ogImagePct: services.length ? Math.round((ogCount / services.length) * 100) : 0,
      apiIntegrationPct: apiAvg,
      withRestyAuth: services.filter((s) => s.api.usesRestyAuth).length,
      withCredits: services.filter((s) => s.api.usesCredits).length,
    },
    services,
  }
}

module.exports = {
  SKIP_SLUGS,
  listPublished,
  loadManifest,
  buildOverview,
  probeUrl,
  findSeoFile,
  analyzeBranding,
  FAVICON_CANDIDATES,
  OG_CANDIDATES,
}
