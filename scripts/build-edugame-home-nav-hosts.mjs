import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')
const sourcePath = path.join(root, '.mobile-audit-catalog-with-urls.json')
const outputPath = path.join(root, 'common', 'edugame-home-nav-hosts.json')
const textOutputPath = path.join(root, 'common', 'edugame-home-nav-hosts.txt')
const rows = JSON.parse(await readFile(sourcePath, 'utf8'))

const hosts = [...new Set(rows
  .map((row) => {
    try { return new URL(row.url, 'https://edugame.restyart.com').hostname.toLowerCase() } catch { return null }
  })
  .filter((host) => host && host.endsWith('.restyart.com') && host !== 'edugame.restyart.com')
)].sort()

await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), hosts }, null, 2)}\n`, 'utf8')
await writeFile(textOutputPath, `${hosts.join('\n')}\n`, 'utf8')
console.log(JSON.stringify({ count: hosts.length, outputPath, textOutputPath }, null, 2))
