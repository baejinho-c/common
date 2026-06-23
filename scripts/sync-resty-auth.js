#!/usr/bin/env node
/** Copy canonical common/lib/resty-auth.ts to every tenant lib/resty-auth.ts */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '../..')
const canonical = path.join(root, 'common/lib/resty-auth.ts')
const src = fs.readFileSync(canonical, 'utf8')

let count = 0
for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
  if (!ent.isDirectory() || ent.name === 'common' || ent.name.startsWith('.')) continue
  const target = path.join(root, ent.name, 'lib/resty-auth.ts')
  if (!fs.existsSync(target)) continue
  fs.writeFileSync(target, src, 'utf8')
  count += 1
}

console.log(`[sync-resty-auth] updated ${count} tenant files from common/lib/resty-auth.ts`)
