#!/usr/bin/env node
/** portfolio 빌드용 — dashboard-manifest → services-snapshot.json */
const fs = require('fs')
const path = require('path')

const COMMON_DIR = path.join(__dirname, '..')
const manifestPath = path.join(COMMON_DIR, 'public/dashboard-manifest.json')
const outPath = path.join(COMMON_DIR, '..', 'portfolio/lib/services-snapshot.json')

const SKIP = new Set(['portfolio', 'wookwang', 'app', 'common'])

function main() {
  if (!fs.existsSync(manifestPath)) {
    console.error('[portfolio-snapshot] dashboard-manifest.json not found — run build-dashboard-manifest.js first')
    process.exit(1)
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const services = (manifest.services || [])
    .filter((s) => {
      const slug = String(s.tenant || '').trim()
      if (!slug || slug.startsWith('.')) return false
      if (SKIP.has(slug)) return false
      return s.published === true
    })
    .map((s) => {
      const slug = s.tenant
      return {
        slug,
        title: s.title || slug,
        siteUrl: `https://${slug}.restyart.com/`,
        previewUrl: `https://${slug}.restyart.com/`,
        branding: { faviconUrl: `https://${slug}.restyart.com/favicon.svg` },
        published: true,
      }
    })
    .sort((a, b) => {
      const ta = (a.title.split(' - ')[0] || a.slug)
      const tb = (b.title.split(' - ')[0] || b.slug)
      return ta.localeCompare(tb, 'ko')
    })

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(
    outPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), services }, null, 2),
    'utf8',
  )
  console.log(`[portfolio-snapshot] ${services.length} services -> ${outPath}`)
}

main()
