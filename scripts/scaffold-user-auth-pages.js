#!/usr/bin/env node
/**
 * Batch-add user login/signup pages for tenants missing auth routes.
 * Usage: node common/scripts/scaffold-user-auth-pages.js [--dry]
 *
 * - Does not overwrite existing auth pages
 * - Syncs common/lib/resty-auth.ts when missing
 * - Adds AuthProvider to layout when missing
 * - Fixes mud /login links and smart /auth/login links
 */
const fs = require("fs")
const path = require("path")

const BASE = path.resolve(__dirname, "../..")
const COMMON = path.join(BASE, "common")
const DRY = process.argv.includes("--dry")

const { getBrand } = require("../lib/tenant-branding-config")

/** Group C + smart: need full auth UI */
const FULL = [
  "chemistry",
  "jjreview",
  "library",
  "mindmap",
  "physics",
  "recipe",
  "trace",
  "wonder",
  "youtube",
  "youtube-vo",
  "smart",
]

/** Group A: modal auth exists — add deep-link pages only */
const PAGES_ONLY = [
  "appicon",
  "brochure",
  "idea",
  "logo",
  "research",
  "seo-foundry",
  "light",
  "english",
  "klocal",
  "hotfeel",
  "growup",
  "hike",
  "mind",
  "dummy",
  "form",
  "linker",
  "search",
  "trips",
  "today",
  "food",
]

/** Group B: combined /auth page — add aliases */
const ALIAS = ["career", "wish", "mypage", "crm"]

const restyAuthSrc = fs.readFileSync(path.join(COMMON, "lib/resty-auth.ts"), "utf8")

function write(filePath, content, { force = false } = {}) {
  if (fs.existsSync(filePath) && !force) {
    console.log("  ~ skip", path.relative(BASE, filePath))
    return false
  }
  if (DRY) {
    console.log("  [dry]", path.relative(BASE, filePath))
    return true
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
  console.log("  +", path.relative(BASE, filePath))
  return true
}

function authContext(slug) {
  return `"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  restyLogin,
  restyRegister,
  getRestyTenant,
  persistRestySession,
  type RestyUser,
} from "@/lib/resty-auth"

const TENANT = "${slug}"

interface AuthContextType {
  user: RestyUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RestyUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const t = localStorage.getItem("auth_token")
      const u = localStorage.getItem("user_data")
      if (t && u) {
        setToken(t)
        setUser(JSON.parse(u))
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const result = await restyLogin({ email, password }, { tenant: TENANT })
    if (result.success && result.token && result.user) {
      persistRestySession(result, TENANT)
      setToken(result.token)
      setUser(result.user)
      return { success: true }
    }
    return { success: false, message: result.message || "로그인에 실패했습니다." }
  }

  const register = async (email: string, password: string, name: string) => {
    const result = await restyRegister({ email, password, name }, { tenant: TENANT })
    if (result.success && result.token && result.user) {
      persistRestySession(result, TENANT)
      setToken(result.token)
      setUser(result.user)
      return { success: true }
    }
    return { success: false, message: result.message || "회원가입에 실패했습니다." }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function getTenantSlug() {
  return getRestyTenant(TENANT)
}
`
}

function authNav() {
  return `"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AuthNav({ className }: { className?: string }) {
  const { user, loading, logout } = useAuth()

  if (loading) return null

  if (user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {user.name || user.email}
        </span>
        <Button variant="outline" size="sm" onClick={logout}>
          로그아웃
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link href="/auth/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        로그인
      </Link>
      <Link href="/auth/register" className={buttonVariants({ size: "sm" })}>
        회원가입
      </Link>
    </div>
  )
}
`
}

function loginPage(brand, desc, { direct = false, slug = "" } = {}) {
  const imports = direct
    ? `import { restyLogin, persistRestySession } from "@/lib/resty-auth"`
    : `import { useAuth } from "@/lib/auth-context"`
  const loginCall = direct
    ? `const result = await restyLogin({ email, password }, { tenant: "${slug}" })
    if (result.success && result.token) {
      persistRestySession(result, "${slug}")
      setLoading(false)
      router.push("/")
      return
    }
    setLoading(false)
    setError(result.message || "로그인에 실패했습니다.")`
    : `const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push("/")
      return
    }
    setError(result.message || "로그인에 실패했습니다.")`
  const hook = direct ? "" : `  const { login } = useAuth()\n`

  return `"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
${imports}
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
${hook}  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    ${loginCall}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">${brand}</h1>
          <p className="text-sm text-muted-foreground">${desc}</p>
        </div>
        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
`
}

function registerPage(brand, desc, { direct = false, slug = "" } = {}) {
  const imports = direct
    ? `import { restyRegister, persistRestySession } from "@/lib/resty-auth"`
    : `import { useAuth } from "@/lib/auth-context"`
  const hook = direct ? "" : `  const { register } = useAuth()\n`
  const registerCall = direct
    ? `const result = await restyRegister({ email, password, name }, { tenant: "${slug}" })
    setLoading(false)
    if (result.success && result.token) {
      persistRestySession(result, "${slug}")
      router.push("/")
      return
    }
    setError(result.message || "회원가입에 실패했습니다.")`
    : `const result = await register(email, password, name)
    setLoading(false)
    if (result.success) {
      router.push("/")
      return
    }
    setError(result.message || "회원가입에 실패했습니다.")`

  return `"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
${imports}
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
${hook}  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    setLoading(true)
    ${registerCall}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">${brand}</h1>
          <p className="text-sm text-muted-foreground">${desc}</p>
        </div>
        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium">
              비밀번호 확인
            </label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
`
}

function redirectPage(to) {
  // Client redirect: next/navigation redirect() does not emit HTTP redirects
  // in our static gateway export, so /login would 200 an error shell.
  return `"use client"

import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    window.location.replace("${to}")
  }, [])
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <p>
        <a href="${to}">페이지로 이동</a>
      </p>
    </main>
  )
}
`
}

function ensureInput(dir) {
  const inputPath = path.join(dir, "components/ui/input.tsx")
  if (fs.existsSync(inputPath)) return
  write(
    inputPath,
    `import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = "Input"

export { Input }
`,
  )
}

function ensureButton(dir) {
  const buttonPath = path.join(dir, "components/ui/button.tsx")
  if (fs.existsSync(buttonPath)) return
  write(
    buttonPath,
    `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,
  )
}

function wireAuthProvider(dir) {
  const layoutPath = path.join(dir, "app/layout.tsx")
  if (!fs.existsSync(layoutPath)) return
  let src = fs.readFileSync(layoutPath, "utf8")
  if (src.includes("AuthProvider")) {
    console.log("  ~ layout already has AuthProvider")
    return
  }

  if (!src.includes('from "@/lib/auth-context"')) {
    src = src.replace(
      /(import .+\n)(?![\s\S]*import)/,
      (m) => `${m}import { AuthProvider } from "@/lib/auth-context"\n`,
    )
    // fallback if first replace didn't work well
    if (!src.includes('from "@/lib/auth-context"')) {
      src = `import { AuthProvider } from "@/lib/auth-context"\n` + src
    }
  }

  // Wrap children / body content
  if (src.includes("<AuthProvider>")) return

  if (/\{children\}/.test(src)) {
    src = src.replace(
      /(\s*)\{children\}/,
      `$1<AuthProvider>\n$1  {children}\n$1</AuthProvider>`,
    )
  } else {
    console.log("  ! could not auto-wire AuthProvider in layout")
    return
  }

  if (DRY) {
    console.log("  [dry] wire AuthProvider", path.relative(BASE, layoutPath))
    return
  }
  fs.writeFileSync(layoutPath, src)
  console.log("  * wired AuthProvider", path.relative(BASE, layoutPath))
}

function hasExistingAuthProvider(dir) {
  const layout = path.join(dir, "app/layout.tsx")
  if (fs.existsSync(layout) && fs.readFileSync(layout, "utf8").includes("AuthProvider")) return true
  return [
    "lib/auth.tsx",
    "lib/auth.ts",
    "lib/auth-context.tsx",
    "contexts/AuthContext.tsx",
    "contexts/auth-context.tsx",
  ].some((p) => fs.existsSync(path.join(dir, p)))
}

function scaffoldTenant(slug, { pagesOnly = false } = {}) {
  const dir = path.join(BASE, slug)
  if (!fs.existsSync(dir)) {
    console.warn("[skip missing dir]", slug)
    return
  }
  console.log(`\n[${slug}]`)
  const brand = getBrand(slug)
  const name = brand.name || slug
  const loginDesc = `로그인하여 ${name} 서비스를 이용하세요`
  const registerDesc = `무료로 가입하고 ${name}을(를) 시작하세요`

  const restyPath = path.join(dir, "lib/resty-auth.ts")
  if (!fs.existsSync(restyPath)) write(restyPath, restyAuthSrc)

  const existing = hasExistingAuthProvider(dir)
  const useDirect = pagesOnly || existing

  if (!useDirect) {
    const ctxPath = path.join(dir, "lib/auth-context.tsx")
    if (!fs.existsSync(ctxPath)) write(ctxPath, authContext(slug))
    write(path.join(dir, "components/auth-nav.tsx"), authNav())
  }

  ensureInput(dir)
  ensureButton(dir)

  write(
    path.join(dir, "app/auth/login/page.tsx"),
    loginPage(name, loginDesc, { direct: useDirect, slug }),
  )
  write(
    path.join(dir, "app/auth/register/page.tsx"),
    registerPage(name, registerDesc, { direct: useDirect, slug }),
  )

  // Convenience aliases used by some headers
  write(path.join(dir, "app/login/page.tsx"), redirectPage("/auth/login"))
  write(path.join(dir, "app/signup/page.tsx"), redirectPage("/auth/register"))

  if (!useDirect) wireAuthProvider(dir)
  else console.log("  ~ keep existing AuthProvider / direct resty pages")
}

function fixMud() {
  const dir = path.join(BASE, "mud")
  console.log("\n[mud] fix /login links")
  // Prefer redirecting /login -> modal-compatible auth pages using resty pattern
  scaffoldTenant("mud")
  // Also keep forgot/reset links working via /login alias (already created)
}

function fixSmart() {
  console.log("\n[smart] full auth + header already points to /auth/login")
  scaffoldTenant("smart")
}

function aliasAuth(slug) {
  const dir = path.join(BASE, slug)
  console.log(`\n[${slug}] alias /auth/login -> /auth`)
  write(path.join(dir, "app/auth/login/page.tsx"), redirectPage("/auth"))
  write(path.join(dir, "app/auth/register/page.tsx"), redirectPage("/auth"))
  write(path.join(dir, "app/login/page.tsx"), redirectPage("/auth"))
  write(path.join(dir, "app/signup/page.tsx"), redirectPage("/auth"))
}

console.log(`[scaffold-user-auth] dry=${DRY}`)

fixMud()
fixSmart()

for (const slug of FULL.filter((s) => s !== "smart")) {
  scaffoldTenant(slug)
}

for (const slug of PAGES_ONLY) {
  scaffoldTenant(slug, { pagesOnly: true })
}

for (const slug of ALIAS) {
  aliasAuth(slug)
}

console.log("\n[done] scaffold-user-auth-pages")
