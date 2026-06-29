#!/usr/bin/env node
/** publish 산출 HTML에 통합 Google Analytics 주입 */
const fs = require('fs')
const path = require('path')
const { injectAnalyticsHtml, normalizeAnalyticsHtml } = require('./analytics-info')

const root = process.argv[2]
const tenant = process.argv[3] || path.basename(root)

if (!root) {
  console.error('Usage: node inject-analytics.js <dir> [tenant]')
  process.exit(1)
}

let updated = 0
let normalized = 0

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full)
    else if (/\.html?$/i.test(ent.name)) {
      const raw = fs.readFileSync(full, 'utf8')
      let next = normalizeAnalyticsHtml(raw)
      if (next !== raw) normalized += 1
      const injected = injectAnalyticsHtml(next, tenant)
      if (injected !== raw) {
        fs.writeFileSync(full, injected, 'utf8')
        updated += 1
      } else if (next !== raw) {
        fs.writeFileSync(full, next, 'utf8')
      }
    }
  }
}

walk(root)
console.log(`[inject-analytics] tenant=${tenant} updated=${updated} normalized=${normalized} under ${root}`)
