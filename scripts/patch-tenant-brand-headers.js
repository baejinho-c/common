#!/usr/bin/env node
/**
 * 헤더/네비에 BrandLogo 적용
 * Usage: node common/scripts/patch-tenant-brand-headers.js [--slug=sports] [--all]
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '../..')
const onlySlug = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1]
const all = process.argv.includes('--all')

const IMPORT_LINE = 'import { BrandLogo } from "@/components/brand-logo"'

/** slug -> [{ file, find, replace }] relative to tenant root */
const PATCHES = {
  sports: [],
  foodsns: [],
  cafe: [
    {
      file: 'components/header.tsx',
      find: /<Link[^>]*href=["']\/["'][^>]*>[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  care: [],
  form: [],
  arc: [
    {
      file: 'components/site-nav.tsx',
      find: /<Link href="\/" className="text-2xl font-bold text-slate-900">\s*인사이트 아크\s*<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  food: [
    {
      file: 'components/Navigation.tsx',
      find: /<Link href="\/" className="flex items-center space-x-2">[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  hike: [
    {
      file: 'components/header.tsx',
      find: /<Link href="\/" className="flex items-center space-x-2">\s*<Logo \/>\s*<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  today: [
    {
      file: 'components/header.tsx',
      find: /<a className="mr-6 flex items-center space-x-2" href="\/">[\s\S]*?<\/a>/,
      replace: '<BrandLogo href="/" size="md" className="mr-6" />',
    },
  ],
  story: [
    {
      file: 'components/header.tsx',
      find: /<Link className="mr-6 flex items-center space-x-2" href="\/">[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" className="mr-6" />',
    },
  ],
  wonder: [
    {
      file: 'components/site-header.tsx',
      find: /<Link[\s\S]*?href="\/"[\s\S]*?aria-label="WonderTale 홈"[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="lg" />',
    },
  ],
  blog: [
    {
      file: 'components/site-header.tsx',
      find: /<Link href="\/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  tech: [
    {
      file: 'components/main-header.tsx',
      find: /<Link href="\/" className="flex items-center space-x-2">[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  reading: [
    {
      file: 'components/site-header.tsx',
      find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  crm: [
    {
      file: 'components/site-header.tsx',
      find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  dummy: [
    {
      file: 'components/header.tsx',
      find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  english: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  flower: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  gpt: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  light: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  mind: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  mindmap: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  smart: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  vibecommunity: [
    { file: 'components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  hvalue: [],
  classic: [
    { file: 'components/Navigation.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  save: [
    { file: 'components/Navigation.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  wookwang: [
    { file: 'components/church-header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  goodprice: [
    { file: 'components/back-header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  hotfeel: [
    { file: 'app/components/header.tsx', find: /<Link href="\/"[^>]*>[\s\S]*?<\/Link>/, replace: '<BrandLogo href="/" size="md" />' },
  ],
  youtube: [
    {
      file: 'app/page.tsx',
      find: /<div className="flex items-center gap-2">[\s\S]*?<h1[^>]*>CommentCraft<\/h1>[\s\S]*?<\/div>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  recipe: [
    {
      file: 'app/page.tsx',
      find: /<div className="flex items-center gap-3">[\s\S]*?<h1[^>]*>비법노트<\/h1>[\s\S]*?<\/div>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
  library: [
    {
      file: 'app/page.tsx',
      find: /<div className="flex items-center gap-3">[\s\S]*?<h1[^>]*>AI 백과사전<\/h1>[\s\S]*?<\/div>/,
      replace: '<BrandLogo href="/" size="md" />',
    },
  ],
}

const HEADER_CANDIDATES = [
  'components/header.tsx',
  'components/Header.tsx',
  'components/site-header.tsx',
  'components/site-nav.tsx',
  'components/main-header.tsx',
  'components/navigation/main-nav.tsx',
  'components/Navigation.tsx',
  'components/church-header.tsx',
  'components/back-header.tsx',
  'app/components/header.tsx',
]

function ensureImport(content) {
  if (content.includes('BrandLogo')) {
    if (!content.includes(IMPORT_LINE)) {
      // calli-style default import — leave as-is
      if (content.includes('from "@/components/brand-logo"') || content.includes("from '@/components/brand-logo'")) {
        return content
      }
    } else {
      return content
    }
  }
  const lines = content.split('\n')
  let lastImport = -1
  for (let i = 0; i < lines.length; i++) {
    if (/^import .+ from /.test(lines[i])) lastImport = i
  }
  if (lastImport >= 0) {
    lines.splice(lastImport + 1, 0, IMPORT_LINE)
    return lines.join('\n')
  }
  return `${IMPORT_LINE}\n${content}`
}

function patchFile(slug, relFile, find, replace) {
  const file = path.join(ROOT, slug, relFile)
  if (!fs.existsSync(file)) return false
  let content = fs.readFileSync(file, 'utf8')
  if (content.includes('BrandLogo') && content.includes(replace.trim())) return false
  if (!find.test(content)) return false
  content = content.replace(find, replace)
  content = ensureImport(content)
  fs.writeFileSync(file, content)
  return true
}

function autoPatchSlug(slug) {
  const explicit = PATCHES[slug] || []
  let count = 0
  for (const p of explicit) {
    if (patchFile(slug, p.file, p.find, p.replace)) {
      console.log(`  ✓ ${slug}/${p.file}`)
      count++
    }
  }
  if (count > 0 || explicit.length) return count

  for (const rel of HEADER_CANDIDATES) {
    const file = path.join(ROOT, slug, rel)
    if (!fs.existsSync(file)) continue
    let content = fs.readFileSync(file, 'utf8')
    if (content.includes('BrandLogo')) return count
    const find = /<Link[^>]*href=["']\/["'][^>]*>[\s\S]*?<\/Link>/
    if (!find.test(content)) continue
    if (patchFile(slug, rel, find, '<BrandLogo href="/" size="md" />')) {
      console.log(`  ✓ ${slug}/${rel} (auto)`)
      count++
      break
    }
  }
  return count
}

function listTenants() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .filter((e) => fs.existsSync(path.join(ROOT, e.name, 'package.json')))
    .map((e) => e.name)
    .filter((n) => !['common', 'resty-api', 'restyserver'].includes(n))
    .sort()
}

const slugs = onlySlug ? [onlySlug] : all ? listTenants() : []
if (!slugs.length) {
  console.error('Usage: node patch-tenant-brand-headers.js --slug=NAME | --all')
  process.exit(1)
}

let total = 0
for (const slug of slugs) {
  total += autoPatchSlug(slug)
}
console.log(`[patch-headers] updated ${total} file(s)`)
