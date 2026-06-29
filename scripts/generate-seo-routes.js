#!/usr/bin/env node
/**
 * Generate app/robots.ts and app/sitemap.ts for Next.js app-router tenants.
 * Usage: node common/scripts/generate-seo-routes.js [--dry-run]
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const DRY = process.argv.includes('--dry-run')
const SKIP = new Set(['common', 'resty-api', 'restyserver', 'node_modules', '.git', 'hvalue', 'play', 'r', 'dummy', 'chemistry'])

function listAppTenants() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .filter((name) => {
      if (SKIP.has(name)) return false
      return fs.existsSync(path.join(ROOT, name, 'app')) && fs.existsSync(path.join(ROOT, name, 'package.json'))
    })
    .sort()
}

function discoverRoutes(tenant) {
  const appDir = path.join(ROOT, tenant, 'app')
  const routes = new Set([''])

  function walk(dir, prefix) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name.startsWith('_') || ent.name === 'api') continue
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        if (ent.name.startsWith('[')) continue
        const next = prefix ? `${prefix}/${ent.name}` : `/${ent.name}`
        walk(full, next)
        continue
      }
      if (ent.name === 'page.tsx' || ent.name === 'page.js') {
        routes.add(prefix || '')
      }
    }
  }

  walk(appDir, '')
  return [...routes].sort((a, b) => a.localeCompare(b))
}

function robotsTemplate(tenant) {
  const base = `https://${tenant}.restyart.com`
  return `import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "${base}/sitemap.xml",
    host: "${base}",
  }
}
`
}

function sitemapTemplate(tenant, routes) {
  const base = `https://${tenant}.restyart.com`
  const routeList = routes.map((r) => `    "${r}"`).join(',\n')
  return `import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "${base}"
  const routes = [\n${routeList}\n  ]

  return routes.map((route) => ({
    url: \`\${baseUrl}\${route}\`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as const,
    priority: route === "" ? 1 : 0.7,
  }))
}
`
}

let created = 0
for (const tenant of listAppTenants()) {
  const appDir = path.join(ROOT, tenant, 'app')
  const robotsPath = path.join(appDir, 'robots.ts')
  const sitemapPath = path.join(appDir, 'sitemap.ts')

  if (!fs.existsSync(robotsPath)) {
    const content = robotsTemplate(tenant)
    if (DRY) console.log(`[dry] would create ${tenant}/app/robots.ts`)
    else {
      fs.writeFileSync(robotsPath, content, 'utf8')
      console.log(`[create] ${tenant}/app/robots.ts`)
      created++
    }
  }

  if (!fs.existsSync(sitemapPath)) {
    const routes = discoverRoutes(tenant)
    const content = sitemapTemplate(tenant, routes)
    if (DRY) console.log(`[dry] would create ${tenant}/app/sitemap.ts (${routes.length} routes)`)
    else {
      fs.writeFileSync(sitemapPath, content, 'utf8')
      console.log(`[create] ${tenant}/app/sitemap.ts (${routes.length} routes)`)
      created++
    }
  }
}

console.log(`\nDone. ${DRY ? 'dry-run' : `created ${created} files`}`)
