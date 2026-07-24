#!/usr/bin/env node
/** HTML 파일에 리스티아트 사업자·AI 표기 주입 */
const fs = require('fs')
const path = require('path')
const { injectLegalHtml, stripLegalHtml } = require('./legal-info')

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
      // 임베드 전용 HTML은 부모 페이지 푸터와 중복되므로 주입·기존 푸터 제거만
      if (/^gonchung-nara\.html$/i.test(ent.name)) {
        const raw = fs.readFileSync(full, 'utf8')
        const next = stripLegalHtml(raw)
        if (next !== raw) {
          fs.writeFileSync(full, next, 'utf8')
          count += 1
        }
        continue
      }
      // 맵 페이지는 iframe 풀스크린 — 부모에 푸터를 넣으면 채집 화면 아래에 또 생김
      if (/^(map|explore)\.html$/i.test(ent.name) && tenant === 'insect') {
        const raw = fs.readFileSync(full, 'utf8')
        const next = stripLegalHtml(raw)
        if (next !== raw) {
          fs.writeFileSync(full, next, 'utf8')
          count += 1
        }
        continue
      }
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
