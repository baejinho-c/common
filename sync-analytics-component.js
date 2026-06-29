#!/usr/bin/env node
/** app/layout.tsx에 통합 GA 컴포넌트 반영 (없는 프로젝트만) */
const fs = require('fs')
const path = require('path')
const { GA_MEASUREMENT_ID } = require('./analytics-info')

const WORKDIR = path.join(__dirname, '..')
const SRC = path.join(__dirname, 'components/restyart-google-analytics.tsx')
const IMPORT_LINE = 'import { RestyartGoogleAnalytics } from "@/components/restyart-google-analytics"'
const TAG = '<RestyartGoogleAnalytics />'

let copied = 0
let patched = 0
let skipped = 0

for (const name of fs.readdirSync(WORKDIR)) {
  if (name === 'common' || name.startsWith('.')) continue
  const root = path.join(WORKDIR, name)
  if (!fs.statSync(root).isDirectory()) continue
  const layout = path.join(root, 'app/layout.tsx')
  if (!fs.existsSync(layout)) continue

  fs.mkdirSync(path.join(root, 'components'), { recursive: true })
  fs.copyFileSync(SRC, path.join(root, 'components/restyart-google-analytics.tsx'))
  copied += 1

  let content = fs.readFileSync(layout, 'utf8')
  if (content.includes(GA_MEASUREMENT_ID) || content.includes('RestyartGoogleAnalytics')) {
    skipped += 1
    continue
  }

  if (!content.includes('from "next/script"') && !content.includes("from 'next/script'")) {
    const lastImport = content.lastIndexOf('\nimport ')
    if (lastImport === -1) {
      content = 'import Script from "next/script"\n' + content
    } else {
      const lineEnd = content.indexOf('\n', lastImport + 1)
      content = content.slice(0, lineEnd + 1) + 'import Script from "next/script"\n' + content.slice(lineEnd + 1)
    }
  }

  if (!content.includes(IMPORT_LINE)) {
    const lastImport = content.lastIndexOf('\nimport ')
    const lineEnd = content.indexOf('\n', lastImport + 1)
    content = content.slice(0, lineEnd + 1) + IMPORT_LINE + '\n' + content.slice(lineEnd + 1)
  }

  if (content.includes('</head>')) {
    content = content.replace(/\s*<\/head>/, `\n        ${TAG}\n      </head>`)
  } else if (content.includes('<body')) {
    content = content.replace(/<body([^>]*)>/, `<body$1>\n        ${TAG}`)
  } else {
    skipped += 1
    continue
  }

  fs.writeFileSync(layout, content, 'utf8')
  patched += 1
  console.log('[layout]', name)
}

console.log(`[sync-analytics] components: ${copied}, layouts patched: ${patched}, skipped: ${skipped}`)
