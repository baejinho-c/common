#!/usr/bin/env node
/**
 * Bootstrap /admin dashboard for Resty tenants.
 * Login: admin / {tenant}
 *
 * Usage:
 *   node common/scripts/bootstrap-tenant-admin.js --all
 *   node common/scripts/bootstrap-tenant-admin.js career comparison search
 *   node common/scripts/bootstrap-tenant-admin.js --all --force-auth
 */

const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "../..")
const TEMPLATE_DIR = path.join(ROOT, "common/admin/templates")
const { getBrand } = require(path.join(ROOT, "common/lib/tenant-branding-config.js"))

const SKIP_TENANTS = new Set(["seo-copilot"])
const ARC_JWT_AUTH = new Set(["arc"])

const FILES = [
  { tpl: "lib/admin-auth.ts.tpl", out: "lib/admin-auth.ts" },
  { tpl: "components/admin-auth-guard.tsx.tpl", out: "components/admin-auth-guard.tsx" },
  { tpl: "components/admin-shell.tsx.tpl", out: "components/admin-shell.tsx" },
  { tpl: "app/admin/layout.tsx.tpl", out: "app/admin/layout.tsx" },
  { tpl: "app/admin/login/page.tsx.tpl", out: "app/admin/login/page.tsx" },
  { tpl: "app/admin/dashboard/page.tsx.tpl", out: "app/admin/dashboard/page.tsx" },
]

const UI_COMPONENTS = ["button.tsx", "card.tsx", "input.tsx", "label.tsx"]
const UI_SOURCE = path.join(ROOT, "career/components/ui")

function parseArgs(argv) {
  const args = { all: false, forceAuth: false, tenants: [] }
  for (const arg of argv) {
    if (arg === "--all") args.all = true
    else if (arg === "--force-auth") args.forceAuth = true
    else if (!arg.startsWith("-")) args.tenants.push(arg)
  }
  return args
}

function listNextTenants() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !["common", "resty-api", "restyserver", "seo-copilot"].includes(name))
    .filter((name) => fs.existsSync(path.join(ROOT, name, "package.json")))
    .filter((name) => fs.existsSync(path.join(ROOT, name, "app")))
    .sort()
}

function renderTemplate(tplPath, vars) {
  let content = fs.readFileSync(tplPath, "utf8")
  for (const [key, value] of Object.entries(vars)) {
    content = content.split(`{{${key}}}`).join(value)
  }
  return content
}

function writeFileIfNeeded(filePath, content, force = false) {
  if (fs.existsSync(filePath) && !force) {
    return false
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, "utf8")
  return true
}

function ensureUiComponents(tenantDir) {
  const copied = []
  const uiDir = path.join(tenantDir, "components/ui")
  for (const file of UI_COMPONENTS) {
    const dest = path.join(uiDir, file)
    if (fs.existsSync(dest)) continue
    const src = path.join(UI_SOURCE, file)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(uiDir, { recursive: true })
    fs.copyFileSync(src, dest)
    copied.push(`components/ui/${file}`)
  }
  return copied
}

function isRedirectAdminPage(content) {
  return (
    content.includes("router.replace") &&
    (content.includes("/admin/login") || content.includes("/admin/dashboard"))
  )
}

function readExistingAdminPage(tenantDir) {
  const pagePath = path.join(tenantDir, "app/admin/page.tsx")
  if (!fs.existsSync(pagePath)) return null
  return fs.readFileSync(pagePath, "utf8")
}

function createDashboardFromSearchStyle(tenantName) {
  return `"use client"

import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  )
}
`
}

function wrapClientPageWithGuard(content) {
  if (content.includes("AdminAuthGuard")) return content

  let updated = content
  if (!updated.includes('from "@/components/admin-auth-guard"')) {
    updated = updated.replace(
      /^(\"use client\"\s*\n)/,
      '$1\nimport { AdminAuthGuard } from "@/components/admin-auth-guard"\n'
    )
  }

  const defaultExportMatch = updated.match(/export default function (\w+)/)
  if (!defaultExportMatch) return updated

  const fnName = defaultExportMatch[1]
  updated = updated.replace(`export default function ${fnName}`, `function ${fnName}`)

  updated += `\n\nexport default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <${fnName} />
    </AdminAuthGuard>
  )
}
`
  return updated
}

function migrateExistingAdminPage(tenantDir, tenant, vars) {
  const pagePath = path.join(tenantDir, "app/admin/page.tsx")
  const dashboardPath = path.join(tenantDir, "app/admin/dashboard/page.tsx")
  const content = readExistingAdminPage(tenantDir)

  if (!content || isRedirectAdminPage(content)) {
    return { migrated: false, reason: "redirect_or_missing" }
  }

  if (fs.existsSync(dashboardPath)) {
    return { migrated: false, reason: "dashboard_exists" }
  }

  // search-style: server page importing AdminDashboard component
  if (
    !content.includes('"use client"') &&
    content.includes("@/components/admin-dashboard")
  ) {
    writeFileIfNeeded(dashboardPath, createDashboardFromSearchStyle(vars.TENANT_NAME), true)
    writeFileIfNeeded(pagePath, renderTemplate(path.join(TEMPLATE_DIR, "app/admin/page.tsx.tpl"), vars), true)
    return { migrated: true, reason: "search_style" }
  }

  // Client page with inline admin UI (gpt, qbox, etc.)
  if (content.includes('"use client"')) {
    const wrapped = wrapClientPageWithGuard(content)
    writeFileIfNeeded(dashboardPath, wrapped, true)
    writeFileIfNeeded(pagePath, renderTemplate(path.join(TEMPLATE_DIR, "app/admin/page.tsx.tpl"), vars), true)
    return { migrated: true, reason: "client_page" }
  }

  // Server page with custom client (arc AdminLoginClient)
  if (content.includes("AdminLoginClient")) {
    writeFileIfNeeded(pagePath, renderTemplate(path.join(TEMPLATE_DIR, "app/admin/page.tsx.tpl"), vars), true)
    return { migrated: true, reason: "arc_login" }
  }

  return { migrated: false, reason: "unknown_pattern" }
}

function bootstrapTenant(tenant, options = {}) {
  const tenantDir = path.join(ROOT, tenant)
  if (!fs.existsSync(tenantDir)) {
    return { tenant, status: "skip", reason: "not_found" }
  }

  if (SKIP_TENANTS.has(tenant)) {
    return { tenant, status: "skip", reason: "skipped" }
  }

  const brand = getBrand(tenant)
  const vars = {
    TENANT: tenant,
    TENANT_NAME: brand.name || tenant,
  }

  const written = []
  const skipped = []

  // wookwang already complete — only fill missing pieces
  const isWookwangComplete =
    tenant === "wookwang" &&
    fs.existsSync(path.join(tenantDir, "app/admin/login/page.tsx")) &&
    fs.existsSync(path.join(tenantDir, "lib/admin-auth.ts"))

  const uiCopied = ensureUiComponents(tenantDir)
  if (uiCopied.length) written.push(...uiCopied)

  const pagePath = path.join(tenantDir, "app/admin/page.tsx")
  const existingPage = readExistingAdminPage(tenantDir)
  let migration = { migrated: false }

  // Migrate custom /admin pages before writing generic dashboard
  if (existingPage && !isRedirectAdminPage(existingPage)) {
    migration = migrateExistingAdminPage(tenantDir, tenant, vars)
    if (migration.migrated) {
      written.push(`app/admin/page.tsx (migrated: ${migration.reason})`)
    }
  }

  for (const { tpl, out } of FILES) {
    const outPath = path.join(tenantDir, out)

    if (isWookwangComplete) {
      skipped.push(out)
      continue
    }

    // arc: keep JWT admin-auth + custom guard; use site-admin-auth for login
    if (ARC_JWT_AUTH.has(tenant)) {
      if (out === "lib/admin-auth.ts") {
        const siteAdminPath = path.join(tenantDir, "lib/site-admin-auth.ts")
        if (!fs.existsSync(siteAdminPath) || options.forceAuth) {
          fs.mkdirSync(path.dirname(siteAdminPath), { recursive: true })
          fs.writeFileSync(siteAdminPath, renderTemplate(path.join(TEMPLATE_DIR, tpl), vars), "utf8")
          written.push("lib/site-admin-auth.ts")
        } else {
          skipped.push("lib/site-admin-auth.ts")
        }
        continue
      }
      if (out === "components/admin-auth-guard.tsx") {
        skipped.push(out)
        continue
      }
      if (out === "app/admin/dashboard/page.tsx") {
        skipped.push(out)
        continue
      }
    }

    if (out === "lib/admin-auth.ts" && fs.existsSync(outPath) && !options.forceAuth) {
      skipped.push(out)
      continue
    }

    if (out === "app/admin/dashboard/page.tsx" && migration.migrated) {
      skipped.push(out)
      continue
    }

    const tplPath = path.join(TEMPLATE_DIR, tpl)
    const content = renderTemplate(tplPath, vars)

    if (writeFileIfNeeded(outPath, content, options.forceAuth || out === "lib/admin-auth.ts")) {
      written.push(out)
    } else {
      skipped.push(out)
    }
  }

  if (ARC_JWT_AUTH.has(tenant)) {
    patchArcAdmin(tenantDir, vars)
  }

  if (!existingPage && !fs.existsSync(pagePath)) {
    writeFileIfNeeded(
      pagePath,
      renderTemplate(path.join(TEMPLATE_DIR, "app/admin/page.tsx.tpl"), vars),
      true
    )
    written.push("app/admin/page.tsx")
  } else if (existingPage && isRedirectAdminPage(existingPage)) {
    skipped.push("app/admin/page.tsx")
  }

  return { tenant, status: "ok", written, skipped, migration }
}

function patchArcAdmin(tenantDir, vars) {
  const loginPath = path.join(tenantDir, "app/admin/login/page.tsx")
  const loginContent = `"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ADMIN_USERNAME,
  isAdminAuthenticated,
  setAdminAuthenticated,
  verifyAdminLogin,
} from "@/lib/site-admin-auth"
import { isAdminLoggedIn, setAdminToken } from "@/lib/admin-auth"
import { adminLogin } from "@/lib/api/admin"

export default function AdminLoginPage() {
  const [username, setUsername] = useState(ADMIN_USERNAME)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAdminAuthenticated() && isAdminLoggedIn()) {
      router.replace("/admin/books")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!verifyAdminLogin(username, password)) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.")
      setIsLoading(false)
      return
    }

    try {
      const res = await adminLogin(password.trim())
      setAdminToken(res.token)
      setAdminAuthenticated()
      router.push("/admin/books")
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">${vars.TENANT_NAME} 관리자</CardTitle>
          <CardDescription>전자책 관리 · /admin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">관리자 계정: admin / ${vars.TENANT}</p>
          <p className="text-center mt-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← 홈페이지로 돌아가기</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
`
  fs.mkdirSync(path.dirname(loginPath), { recursive: true })
  fs.writeFileSync(loginPath, loginContent, "utf8")

  const pagePath = path.join(tenantDir, "app/admin/page.tsx")
  fs.writeFileSync(
    pagePath,
    `"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/site-admin-auth"
import { isAdminLoggedIn } from "@/lib/admin-auth"

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(isAdminAuthenticated() && isAdminLoggedIn() ? "/admin/books" : "/admin/login")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">관리자 페이지로 이동 중…</p>
    </div>
  )
}
`,
    "utf8"
  )

  const guardPath = path.join(tenantDir, "components/admin-auth-guard.tsx")
  if (fs.existsSync(guardPath)) {
    let guard = fs.readFileSync(guardPath, "utf8")
    if (!guard.includes("/admin/login")) {
      guard = guard.replace('router.replace("/admin")', 'router.replace("/admin/login")')
      fs.writeFileSync(guardPath, guard, "utf8")
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const tenants = args.all ? listNextTenants() : args.tenants

  if (tenants.length === 0) {
    console.error("Usage: node common/scripts/bootstrap-tenant-admin.js --all [tenant...]")
    process.exit(1)
  }

  console.log(`Bootstrapping admin for ${tenants.length} tenant(s)...\n`)

  const results = []
  for (const tenant of tenants) {
    const result = bootstrapTenant(tenant, { forceAuth: args.forceAuth })
    results.push(result)
    const icon = result.status === "ok" ? "✓" : "–"
    const files = result.written?.length ? result.written.join(", ") : result.reason
    console.log(`${icon} ${tenant}: ${files}`)
  }

  const ok = results.filter((r) => r.status === "ok").length
  console.log(`\nDone: ${ok}/${results.length} tenants processed.`)
}

main()
