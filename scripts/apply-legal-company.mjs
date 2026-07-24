#!/usr/bin/env node
/**
 * legal-company.json (+ optional override) 동기화 → 테넌트 components
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COMMON = path.resolve(__dirname, "..")
const ROOT = path.resolve(COMMON, "..")
const SKIP = new Set(["common", "node_modules", "_analysis", "_deploy", "resty-api", "restyserver", "ogstudio"])

const FILES = [
  "legal-company.json",
  "legal-company.override.json",
  "components/restyart-legal-bar.tsx",
  "components/resty-privacy-page.tsx",
  "components/resty-signup-agreements.tsx",
  "components/resty-register-page.tsx",
  "components/resty-account-delete-section.tsx",
  "components/resty-ai-generated-badge.tsx",
  "components/resty-location-consent-notice.tsx",
  "components/resty-cookie-consent-banner.tsx",
  "lib/resty-auth.ts",
  "lib/resty-credits-bootstrap.ts",
  "lib/register-consent.ts",
  "hooks/use-resty-session-sync.ts",
]

let copied = 0
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name) || name.startsWith(".")) continue
  const dir = path.join(ROOT, name)
  if (!fs.existsSync(path.join(dir, "package.json"))) continue
  for (const rel of FILES) {
    const src = path.join(COMMON, rel)
    const dest = path.join(dir, rel)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    copied++
  }
}

const base = JSON.parse(fs.readFileSync(path.join(COMMON, "legal-company.json"), "utf8"))
const overridePath = path.join(COMMON, "legal-company.override.json")
const merged = { ...base }
if (fs.existsSync(overridePath)) {
  Object.assign(merged, JSON.parse(fs.readFileSync(overridePath, "utf8")))
}

console.log(`[apply-legal-company] synced ${copied} files`)
if (!merged.privacyOfficerName) {
  console.log("[apply-legal-company] TODO: cp legal-company.override.example.json → legal-company.override.json 후 값 입력")
} else {
  console.log(`[apply-legal-company] privacy officer: ${merged.privacyOfficerName}`)
}
