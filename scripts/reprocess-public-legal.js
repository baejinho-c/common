#!/usr/bin/env node
/** 배포된 public HTML에서 중복 legal bar 정리 (서비스 footer 있으면 주입 생략) */
const fs = require('fs')
const path = require('path')
const { injectLegalHtml } = require('../legal-info')

const publicRoot = path.join(__dirname, '../public')
const only = process.argv.find((a) => a.startsWith('--tenant='))?.split('=')[1]

let files = 0
let changed = 0

function walk(dir, tenant) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, tenant)
    else if (/\.html?$/i.test(ent.name)) {
      files += 1
      const raw = fs.readFileSync(full, 'utf8')
      const next = injectLegalHtml(raw, tenant)
      if (next !== raw) {
        fs.writeFileSync(full, next, 'utf8')
        changed += 1
      }
    }
  }
}

for (const name of fs.readdirSync(publicRoot)) {
  if (only && name !== only) continue
  const dir = path.join(publicRoot, name)
  if (!fs.statSync(dir).isDirectory()) continue
  walk(dir, name)
}

console.log(`[reprocess-public-legal] scanned ${files} html, updated ${changed}`)
