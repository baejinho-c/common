#!/usr/bin/env node
/**
 * Sync legal components from common/ to tenant components/ and ensure app/privacy/page.tsx exists.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "../..")
const COMMON = path.join(ROOT, "common")
const SKIP = new Set(["common", "node_modules", "_analysis", "_deploy", "resty-api", "restyserver", "ogstudio"])

const PRIVACY_PAGE = `import { RestyPrivacyPage } from "@/components/resty-privacy-page"

export default function PrivacyPage() {
  const serviceName = process.env.NEXT_PUBLIC_SITE_NAME || process.env.NEXT_PUBLIC_SUBDOMAIN || "본 서비스"
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT || process.env.NEXT_PUBLIC_SUBDOMAIN || undefined
  return <RestyPrivacyPage serviceName={serviceName} tenantSlug={tenantSlug} />
}
`

const TERMS_PAGE = `import { RestyTermsPage } from "@/components/resty-terms-page"

export default function TermsPage() {
  const serviceName = process.env.NEXT_PUBLIC_SITE_NAME || process.env.NEXT_PUBLIC_SUBDOMAIN || "본 서비스"
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT || process.env.NEXT_PUBLIC_SUBDOMAIN || undefined
  return <RestyTermsPage serviceName={serviceName} tenantSlug={tenantSlug} />
}
`

const FILES_TO_SYNC = [
  "components/resty-signup-agreements.tsx",
  "components/resty-privacy-page.tsx",
  "components/resty-terms-page.tsx",
  "components/restyart-legal-bar.tsx",
  "components/resty-register-page.tsx",
  "components/resty-ai-generated-badge.tsx",
  "lib/ai-basic-law.ts",
  "legal-company.json",
]

function isNextTenant(dir) {
  return fs.existsSync(path.join(dir, "package.json")) && fs.existsSync(path.join(dir, "app"))
}

function listTenants() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP.has(d.name) && !d.name.startsWith("."))
    .map((d) => path.join(ROOT, d.name))
    .filter(isNextTenant)
}

let synced = 0
let privacyCreated = 0

for (const tenantDir of listTenants()) {
  const name = path.basename(tenantDir)

  for (const rel of FILES_TO_SYNC) {
    const src = path.join(COMMON, rel)
    const dest = path.join(tenantDir, rel)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    synced++
  }

  const privacyPath = path.join(tenantDir, "app/privacy/page.tsx")
  if (!fs.existsSync(privacyPath)) {
    fs.mkdirSync(path.dirname(privacyPath), { recursive: true })
    fs.writeFileSync(privacyPath, PRIVACY_PAGE, "utf8")
    privacyCreated++
    console.log(`[privacy] created ${name}/app/privacy/page.tsx`)
  }

  const termsPath = path.join(tenantDir, "app/terms/page.tsx")
  if (!fs.existsSync(termsPath)) {
    fs.mkdirSync(path.dirname(termsPath), { recursive: true })
    fs.writeFileSync(termsPath, TERMS_PAGE, "utf8")
    console.log(`[terms] created ${name}/app/terms/page.tsx`)
  }
}

/** P0/P1: 커스텀 privacy/terms 를 공통+별표 페이지로 교체 */
const FORCE_STANDARD_LEGAL = [
  // P0
  "mind",
  "resume",
  "vtest",
  "career",
  "qbank",
  "wonder",
  "growup",
  "toonsnap",
  "trip-course",
  // P1
  "care",
  "crm",
  "search",
  "seo-copilot",
  "blog",
  "sim",
  "today",
  "comic-studio",
  "food",
  "logo",
  "poster",
  "light",
  "vibecommunity",
  "arc",
  // P2
  "qbox",
  "tech",
  "rebrand",
  "comparison",
  "calli",
  "math",
  "english",
  "special",
  "plot",
  "mindmap",
  "concept",
  "recipe",
  // P3
  "mud",
  "form",
  "sight",
  "mypage",
  "video",
  "foodsns",
  "youtube",
]
for (const name of FORCE_STANDARD_LEGAL) {
  const tenantDir = path.join(ROOT, name)
  if (!isNextTenant(tenantDir)) continue
  const privacyPath = path.join(tenantDir, "app/privacy/page.tsx")
  const termsPath = path.join(tenantDir, "app/terms/page.tsx")
  fs.mkdirSync(path.dirname(privacyPath), { recursive: true })
  fs.mkdirSync(path.dirname(termsPath), { recursive: true })
  const privacyForced = `import { RestyPrivacyPage } from "@/components/resty-privacy-page"

export default function PrivacyPage() {
  const serviceName = process.env.NEXT_PUBLIC_SITE_NAME || "${name}"
  return <RestyPrivacyPage serviceName={serviceName} tenantSlug="${name}" />
}
`
  const termsForced = `import { RestyTermsPage } from "@/components/resty-terms-page"

export default function TermsPage() {
  const serviceName = process.env.NEXT_PUBLIC_SITE_NAME || "${name}"
  return <RestyTermsPage serviceName={serviceName} tenantSlug="${name}" />
}
`
  fs.writeFileSync(privacyPath, privacyForced, "utf8")
  fs.writeFileSync(termsPath, termsForced, "utf8")
  console.log(`[legal] forced standard privacy/terms + appendix → ${name}`)
}

console.log(`[sync-legal] copied ${synced} component files, created ${privacyCreated} privacy routes`)
