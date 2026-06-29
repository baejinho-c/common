#!/usr/bin/env node
/** 약관 페이지·가입 동의·resty-auth 클라이언트를 모든 테넌트에 동기화 */
const fs = require('fs')
const path = require('path')

const WORKDIR = path.join(__dirname, '..')
const FILES = [
  ['lib/resty-auth.ts', 'lib/resty-auth.ts'],
  ['lib/resty-credits.ts', 'lib/resty-credits.ts'],
  ['components/resty-signup-agreements.tsx', 'components/resty-signup-agreements.tsx'],
  ['components/resty-terms-page.tsx', 'components/resty-terms-page.tsx'],
  ['components/resty-privacy-page.tsx', 'components/resty-privacy-page.tsx'],
]

const TERMS_PAGE = `import { RestyTermsPage } from "@/components/resty-terms-page"

export default function TermsPage() {
  const serviceName = process.env.NEXT_PUBLIC_SITE_NAME || process.env.NEXT_PUBLIC_SUBDOMAIN || "본 서비스"
  return <RestyTermsPage serviceName={serviceName} />
}
`

const PRIVACY_PAGE = `import { RestyPrivacyPage } from "@/components/resty-privacy-page"

export default function PrivacyPage() {
  const serviceName = process.env.NEXT_PUBLIC_SITE_NAME || process.env.NEXT_PUBLIC_SUBDOMAIN || "본 서비스"
  return <RestyPrivacyPage serviceName={serviceName} />
}
`

let copied = 0
let termsAdded = 0
let privacyAdded = 0

for (const name of fs.readdirSync(WORKDIR)) {
  if (name === 'common' || name.startsWith('.')) continue
  const root = path.join(WORKDIR, name)
  if (!fs.statSync(root).isDirectory()) continue
  const appDir = path.join(root, 'app')
  if (!fs.existsSync(appDir)) continue

  for (const [srcRel, destRel] of FILES) {
    const src = path.join(__dirname, srcRel)
    const dest = path.join(root, destRel)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    copied += 1
  }

  const termsPath = path.join(appDir, 'terms', 'page.tsx')
  if (!fs.existsSync(termsPath)) {
    fs.mkdirSync(path.dirname(termsPath), { recursive: true })
    fs.writeFileSync(termsPath, TERMS_PAGE, 'utf8')
    termsAdded += 1
    console.log('[terms]', name)
  }

  const privacyPath = path.join(appDir, 'privacy', 'page.tsx')
  if (!fs.existsSync(privacyPath)) {
    fs.mkdirSync(path.dirname(privacyPath), { recursive: true })
    fs.writeFileSync(privacyPath, PRIVACY_PAGE, 'utf8')
    privacyAdded += 1
    console.log('[privacy]', name)
  }
}

console.log(`[sync-auth-legal] files: ${copied}, terms added: ${termsAdded}, privacy added: ${privacyAdded}`)
