#!/usr/bin/env node
/**
 * layout.tsx metadata icons를 branding favicon.svg로 통일
 * Usage: node common/scripts/patch-tenant-layout-icons.js [--slug=wonder] [--all]
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '../..')
const onlySlug = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1]
const all = process.argv.includes('--all')

const ICONS_BLOCK = `  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-mark.svg", type: "image/svg+xml", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },`

function listTenants() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .filter((e) => fs.existsSync(path.join(ROOT, e.name, 'package.json')))
    .map((e) => e.name)
    .filter((n) => !['common', 'resty-api', 'restyserver'].includes(n))
    .sort()
}

function patchLayout(slug) {
  const candidates = ['app/layout.tsx', 'src/app/layout.tsx']
  for (const rel of candidates) {
    const file = path.join(ROOT, slug, rel)
    if (!fs.existsSync(file)) continue
    let content = fs.readFileSync(file, 'utf8')
    if (!content.includes('export const metadata')) continue
    if (content.includes('url: "/favicon.svg"') && content.includes('apple-touch-icon.svg')) continue

    const replaced = content.replace(/icons:\s*\{[\s\S]*?\n  \},/m, ICONS_BLOCK)
    if (replaced === content) continue
    fs.writeFileSync(file, replaced)
    console.log(`  ✓ ${slug}/${rel}`)
    return true
  }
  return false
}

const slugs = onlySlug ? [onlySlug] : all ? listTenants() : []
if (!slugs.length) {
  console.error('Usage: node patch-tenant-layout-icons.js --slug=NAME | --all')
  process.exit(1)
}

let n = 0
for (const slug of slugs) {
  if (patchLayout(slug)) n++
}
console.log(`[layout-icons] patched ${n} layout(s)`)
