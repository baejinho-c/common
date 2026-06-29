#!/usr/bin/env node
/**
 * Add terms/privacy/sitemap/robots to tenants missing legal pages.
 * Usage: node common/scripts/scaffold-tenant-legal.js [tenant ...]
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const COMMON_COMPONENTS = path.join(ROOT, 'common/components')

const TENANT_CONFIG = {
  idea: { serviceName: 'Idea Lab', baseUrl: 'https://idea.restyart.com' },
  sosofarm: { serviceName: '소소팜', baseUrl: 'https://sosofarm.restyart.com' },
  vibecommunity: { serviceName: 'Vibe Coding Community', baseUrl: 'https://vibecommunity.restyart.com' },
  calli: { serviceName: '캘리마켓', baseUrl: 'https://calli.restyart.com' },
  form: { serviceName: 'FormStudio', baseUrl: 'https://form.restyart.com' },
  'seo-foundry': { serviceName: 'SEO Foundry', baseUrl: 'https://seo-foundry.restyart.com' },
}

function copyLegalComponents(tenantDir) {
  const dest = path.join(tenantDir, 'components')
  fs.mkdirSync(dest, { recursive: true })
  for (const file of ['restyart-legal-bar.tsx', 'resty-terms-page.tsx', 'resty-privacy-page.tsx']) {
    const src = path.join(COMMON_COMPONENTS, file)
    const out = path.join(dest, file)
    if (!fs.existsSync(src)) throw new Error(`Missing ${src}`)
    if (!fs.existsSync(out)) {
      fs.copyFileSync(src, out)
      console.log(`  + components/${file}`)
    }
  }
}

function writeTermsPage(tenantDir, serviceName) {
  const file = path.join(tenantDir, 'app/terms/page.tsx')
  if (fs.existsSync(file)) return
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(
    file,
    `import { RestyTermsPage } from '@/components/resty-terms-page'

export default function TermsPage() {
  return <RestyTermsPage serviceName="${serviceName}" />
}
`,
    'utf8',
  )
  console.log('  + app/terms/page.tsx')
}

function writePrivacyPage(tenantDir, serviceName) {
  const file = path.join(tenantDir, 'app/privacy/page.tsx')
  if (fs.existsSync(file)) return
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(
    file,
    `import { RestyPrivacyPage } from '@/components/resty-privacy-page'

export default function PrivacyPage() {
  return <RestyPrivacyPage serviceName="${serviceName}" />
}
`,
    'utf8',
  )
  console.log('  + app/privacy/page.tsx')
}

function writeSitemap(tenantDir, baseUrl) {
  const file = path.join(tenantDir, 'app/sitemap.ts')
  if (fs.existsSync(file)) return
  fs.writeFileSync(
    file,
    `import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '${baseUrl}'
  const now = new Date()

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: \`\${baseUrl}/terms\`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: \`\${baseUrl}/privacy\`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
`,
    'utf8',
  )
  console.log('  + app/sitemap.ts')
}

function writeRobots(tenantDir, baseUrl) {
  const file = path.join(tenantDir, 'app/robots.ts')
  if (fs.existsSync(file)) return
  fs.writeFileSync(
    file,
    `import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '${baseUrl}'

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: \`\${baseUrl}/sitemap.xml\`,
    host: baseUrl,
  }
}
`,
    'utf8',
  )
  console.log('  + app/robots.ts')
}

function patchSitemapLegal(tenantDir, baseUrl) {
  const file = path.join(tenantDir, 'app/sitemap.ts')
  if (!fs.existsSync(file)) return
  const text = fs.readFileSync(file, 'utf8')
  if (text.includes('/terms')) return
  const insert = `
    { url: \`\${base}/terms\`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: \`\${base}/privacy\`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },`
  const patched = text.replace(/(return\s*\[)/, `$1${insert}`)
  if (patched !== text) {
    fs.writeFileSync(file, patched, 'utf8')
    console.log('  ~ app/sitemap.ts (added terms/privacy)')
  }
}

function scaffoldTenant(slug) {
  const cfg = TENANT_CONFIG[slug]
  if (!cfg) {
    console.warn(`[skip] unknown tenant: ${slug}`)
    return
  }
  const tenantDir = path.join(ROOT, slug)
  if (!fs.existsSync(tenantDir)) {
    console.warn(`[skip] missing folder: ${slug}`)
    return
  }
  console.log(`\n[${slug}]`)
  copyLegalComponents(tenantDir)
  writeTermsPage(tenantDir, cfg.serviceName)
  writePrivacyPage(tenantDir, cfg.serviceName)
  writeSitemap(tenantDir, cfg.baseUrl)
  writeRobots(tenantDir, cfg.baseUrl)
  patchSitemapLegal(tenantDir, cfg.baseUrl)
}

const tenants = process.argv.slice(2)
const targets = tenants.length ? tenants : Object.keys(TENANT_CONFIG)
for (const slug of targets) scaffoldTenant(slug)
console.log('\nDone.')
