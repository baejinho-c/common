#!/usr/bin/env node
/** HTML 파일에 리스티아트 사업자·AI 표기 주입 */
const fs = require('fs')
const path = require('path')
const { injectLegalHtml } = require('./legal-info')

const root = process.argv[2]
const tenant = process.argv[3] || path.basename(root || '')
if (!root) {
  console.error('Usage: node inject-legal.js <dir>')
  process.exit(1)
}

let count = 0
function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full)
    else if (/\.html?$/i.test(ent.name)) {
      const raw = fs.readFileSync(full, 'utf8')
      const next = injectLegalHtml(raw, tenant)
      if (next !== raw) {
        fs.writeFileSync(full, next, 'utf8')
        count += 1
      }
    }
  }
}

walk(root)
console.log(`[inject-legal] updated ${count} html files under ${root}`)
