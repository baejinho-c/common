#!/usr/bin/env node
/** auth/register 페이지를 RestyRegisterPage 래퍼로 교체 (restyRegister 사용·동의 미적용) */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const SKIP = new Set(["common", "node_modules", "_analysis", "_deploy", "resty-api", "restyserver", "ogstudio"])

const DISPLAY = {
  food: "Food",
  today: "Today",
  trips: "Trips",
  search: "Search",
  linker: "CorpLinker",
  form: "Form",
  mind: "Mind",
  hike: "Hike",
  growup: "GrowUp",
  hotfeel: "Hotfeel",
  klocal: "K-Local",
  english: "English",
  light: "Light",
  "seo-foundry": "SEO Foundry",
  research: "Research",
  idea: "Idea",
  brochure: "Brochure",
  mud: "Mud",
  crm: "CRM",
  career: "Career",
  wish: "Wish",
  vtest: "VTest",
}

function wrapper(tenant, title) {
  return `"use client"

import { RestyRegisterPage } from "@/components/resty-register-page"

export default function RegisterPage() {
  return (
    <RestyRegisterPage
      tenant="${tenant}"
      title="${title}"
      subtitle="무료로 가입하고 ${title}을(를) 시작하세요"
    />
  )
}
`
}

let patched = 0
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name) || name.startsWith(".")) continue
  const registerPath = path.join(ROOT, name, "app/auth/register/page.tsx")
  if (!fs.existsSync(registerPath)) continue
  const src = fs.readFileSync(registerPath, "utf8")
  if (src.includes("RestyRegisterPage")) continue
  if (!src.includes("restyRegister")) continue
  const title = DISPLAY[name] || name.charAt(0).toUpperCase() + name.slice(1)
  fs.writeFileSync(registerPath, wrapper(name, title), "utf8")
  patched++
  console.log(`[patch] ${name}/app/auth/register/page.tsx`)
}
console.log(`[patch-auth-register] updated ${patched} pages`)
