#!/usr/bin/env node
/** Fix duplicate/orphan icons blocks injected by branding patch */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '../..')
const TENANTS = [
  'book-review', 'goodprice', 'growup', 'healing', 'jjreview', 'klocal', 'korean',
  'portfolio', 'qbank', 'research', 'sim', 'trace', 'vibe', 'vtest',
]

function fixLayout(slug) {
  const file = path.join(ROOT, slug, 'app/layout.tsx')
  if (!fs.existsSync(file)) return false
  let c = fs.readFileSync(file, 'utf8')
  const before = c

  // Remove orphan block after complete favicon.svg icons section
  c = c.replace(
    /(shortcut: \[\{ url: "\/favicon\.svg", type: "image\/svg\+xml" \}\],\s*\n\s*\},)\s*\n[\s\S]*?(?=\n\s*(?:manifest|verification|openGraph|twitter|robots|category|generator|alternates|metadataBase|themeColor|viewport|colorScheme|referrer|applicationName|classification|keywords|authors|creator|publisher|formatDetection|description|title|})\s*[:{]|\n\}\s*\n\nexport)/,
    '$1\n',
  )

  // book-review / portfolio / research style with apple-icon
  c = c.replace(
    /(shortcut: \[\{ url: "\/favicon\.svg", type: "image\/svg\+xml" \}\],\s*\n\s*\},)\s*\n\s*\{ url: '\/icon-dark[\s\S]*?apple: '\/apple-icon\.png',\s*\n\s*\},/,
    '$1',
  )

  // klocal: stray `],` after icons close
  c = c.replace(
    /(shortcut: \[\{ url: "\/favicon\.svg", type: "image\/svg\+xml" \}\],\s*\n\s*\},)\s*\n\s*\],\s*\n\s*apple:[\s\S]*?\n\s*\},/,
    '$1',
  )

  if (c !== before) {
    fs.writeFileSync(file, c)
    console.log('fixed', slug)
    return true
  }
  console.log('skip', slug)
  return false
}

let n = 0
for (const t of TENANTS) if (fixLayout(t)) n++
console.log(`[fix-layout-icons] ${n}/${TENANTS.length}`)
