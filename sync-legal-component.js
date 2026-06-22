#!/usr/bin/env node
/** 모든 프로젝트에 RestyartLegalBar 컴포넌트 복사 + layout.tsx 반영 */
const fs = require('fs')
const path = require('path')

const WORKDIR = path.join(__dirname, '..')
const SRC = path.join(__dirname, 'components/restyart-legal-bar.tsx')
const IMPORT_LINE = 'import { RestyartLegalBar } from "@/components/restyart-legal-bar"'
const TAG = '<RestyartLegalBar />'

let copied = 0
let patched = 0
let skipped = 0

for (const name of fs.readdirSync(WORKDIR)) {
  if (name === 'common' || name.startsWith('.')) continue
  const root = path.join(WORKDIR, name)
  if (!fs.statSync(root).isDirectory()) continue
  const layout = path.join(root, 'app/layout.tsx')
  if (!fs.existsSync(layout)) continue

  const compDir = path.join(root, 'components')
  fs.mkdirSync(compDir, { recursive: true })
  fs.copyFileSync(SRC, path.join(compDir, 'restyart-legal-bar.tsx'))
  copied += 1

  let content = fs.readFileSync(layout, 'utf8')
  if (content.includes('RestyartLegalBar')) {
    skipped += 1
    continue
  }

  if (!content.includes(IMPORT_LINE)) {
    const lastImport = content.lastIndexOf('\nimport ')
    if (lastImport === -1) {
      content = IMPORT_LINE + '\n' + content
    } else {
      const lineEnd = content.indexOf('\n', lastImport + 1)
      content = content.slice(0, lineEnd + 1) + IMPORT_LINE + '\n' + content.slice(lineEnd + 1)
    }
  }

  if (content.includes('</body>')) {
    content = content.replace(/\s*<\/body>/, `\n        ${TAG}\n      </body>`)
  } else {
    skipped += 1
    continue
  }

  fs.writeFileSync(layout, content, 'utf8')
  patched += 1
  console.log('[layout]', name)
}

console.log(`[sync-legal] components: ${copied}, layouts patched: ${patched}, skipped: ${skipped}`)
