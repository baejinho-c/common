#!/usr/bin/env node
/** Add basePath to tenant next.config if missing. Usage: node patch-tenant-basepath.js <tenant-folder> */
const fs = require('fs')
const path = require('path')

const tenant = process.argv[2]
if (!tenant) {
  console.error('Usage: node patch-tenant-basepath.js <tenant>')
  process.exit(1)
}

const baseDir = path.join(__dirname, '../..', tenant)
const candidates = ['next.config.mjs', 'next.config.js', 'next.config.ts']
const cfgPath = candidates.map((f) => path.join(baseDir, f)).find((p) => fs.existsSync(p))
if (!cfgPath) {
  console.error(`[SKIP] no next.config in ${baseDir}`)
  process.exit(0)
}

let text = fs.readFileSync(cfgPath, 'utf8')
if (/basePath/.test(text)) {
  console.log(`[OK] ${tenant}: basePath already set`)
  process.exit(0)
}

const header = `const tenant = process.env.TENANT || process.env.NEXT_PUBLIC_TENANT_PATH?.replace(/^\\//, '') || '${tenant}'
const basePath = process.env.NEXT_PUBLIC_TENANT_PATH || \`/\${tenant}\`

`

if (text.includes('const nextConfig = {')) {
  text = header + text.replace('const nextConfig = {', 'const nextConfig = {\n  basePath,')
} else if (text.includes('const nextConfig={')) {
  text = header + text.replace('const nextConfig={', 'const nextConfig={\n  basePath,')
} else {
  console.error(`[FAIL] ${tenant}: unexpected next.config shape`)
  process.exit(1)
}

fs.writeFileSync(cfgPath, text, 'utf8')
console.log(`[PATCH] ${tenant}: added basePath -> /${tenant}`)
