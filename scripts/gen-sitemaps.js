#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const WORKDIR = path.join(__dirname, '../..')

const specs = {
  chemistry: ['', '/privacy', '/terms'],
  classic: ['', '/posts', '/composers', '/playlists', '/search', '/privacy', '/terms'],
  food: ['', '/recipes', '/search', '/privacy', '/terms'],
  healing: ['', '/credits', '/privacy', '/terms'],
  klocal: ['', '/privacy', '/terms'],
  linker: ['', '/explore', '/search', '/network', '/crm', '/contact', '/privacy', '/terms'],
  mindmap: ['', '/privacy', '/terms'],
  mypage: ['', '/dashboard', '/profile', '/templates', '/privacy', '/terms'],
  plot: ['', '/analysis', '/dashboard', '/pricing', '/privacy', '/terms'],
  recipe: ['', '/explore', '/create', '/privacy', '/terms'],
  save: ['', '/search', '/dashboard', '/profile', '/community', '/compare', '/wishlist', '/privacy', '/terms'],
  sports: ['', '/matches', '/dashboard', '/profile', '/safety', '/rating', '/privacy', '/terms'],
  vibe: ['', '/register', '/privacy', '/terms'],
  vtest: ['', '/dashboard', '/profile', '/credits', '/interview/setup', '/privacy', '/terms'],
  youtube: ['', '/privacy', '/terms'],
  'youtube-vo': ['', '/privacy', '/terms'],
  flower: ['', '/privacy', '/terms'],
  history: ['', '/privacy', '/terms'],
  hvalue: ['', '/privacy', '/terms'],
  insect: ['', '/privacy', '/terms'],
  play: ['', '/privacy', '/terms'],
  portfolio: ['', '/privacy', '/terms'],
  sight: ['', '/privacy', '/terms'],
  smart: ['', '/privacy', '/terms'],
  video: ['', '/privacy', '/terms'],
}

function tpl(tenant, routes) {
  return `import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://${tenant}.restyart.com"
  const routes = ${JSON.stringify(routes)}

  return routes.map((route) => ({
    url: \`\${baseUrl}\${route}\`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as const,
    priority: route === "" ? 1 : 0.8,
  }))
}
`
}

for (const [tenant, routes] of Object.entries(specs)) {
  const file = path.join(WORKDIR, tenant, 'app', 'sitemap.ts')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, tpl(tenant, routes))
  console.log('wrote', file)
}
