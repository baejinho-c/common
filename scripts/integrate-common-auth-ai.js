#!/usr/bin/env node
/**
 * comic-studio, seo-copilot, comparison — common auth + inquiry AI 통합
 */
const fs = require('fs')
const path = require('path')

const BASE = path.resolve(__dirname, '../..')
const COMMON = path.join(BASE, 'common')

const TENANTS = [
  {
    slug: 'comic-studio',
    brand: 'AI Comic Studio',
    loginDesc: '계정에 로그인하여 스튜디오 작업을 이어가세요',
    registerDesc: '무료로 가입하고 AI 만화 스튜디오를 시작하세요',
    welcome:
      '안녕하세요, AI Comic Studio 고객지원입니다.\n\n스토리·페이지 구성, 캐릭터 DB, 세계관 설정 등 궁금한 점이나 건의사항을 편하게 남겨 주세요.',
    static: true,
  },
  {
    slug: 'seo-copilot',
    brand: 'SEO Copilot AI',
    loginDesc: '로그인하여 SEO 분석 결과를 저장하세요',
    registerDesc: '무료로 가입하고 AI SEO Copilot을 시작하세요',
    welcome:
      '안녕하세요, SEO Copilot AI 고객지원입니다.\n\n시장 검증, 키워드 분석, SEO 감사, 로드맵 생성 등 서비스 이용 문의를 도와드립니다.',
    static: false,
  },
  {
    slug: 'comparison',
    brand: '여행 견적 비교함',
    loginDesc: '로그인하여 여행 견적을 저장하고 비교하세요',
    registerDesc: '무료로 가입하고 여행 견적 비교를 시작하세요',
    welcome:
      '안녕하세요, 여행 견적 비교함 고객지원입니다.\n\n여행 후보 추가, AI 일정 생성, 총비용 비교 등 이용 방법을 안내해 드립니다.',
    static: false,
  },
]

const restyAuthSrc = fs.readFileSync(path.join(COMMON, 'lib/resty-auth.ts'), 'utf8')
const legalBarSrc = fs.readFileSync(path.join(COMMON, 'components/restyart-legal-bar.tsx'), 'utf8')

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
  console.log('  +', path.relative(BASE, filePath))
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

function loginPage(brand, desc) {
  return `"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push("/")
      return
    }
    setError(result.message || "로그인에 실패했습니다.")
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

function registerPage(brand, desc) {
  return `"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await register(email, password, name)
    setLoading(false)
    if (result.success) {
      router.push("/")
      return
    }
    setError(result.message || "회원가입에 실패했습니다.")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">${brand} 회원가입</h1>
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
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
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
              minLength={6}
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

function floatingChat(slug, welcome) {
  const welcomeEscaped = welcome.replace(/'/g, "\\'").replace(/\n/g, '\\n')
  return `'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const TENANT = '${slug}'
const WELCOME = '${welcomeEscaped}'

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', type: 'ai', content: WELCOME, timestamp: new Date() },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const getFallbackResponse = (): string =>
    '문의해 주셔서 감사합니다. AI 고객지원이 확인 후 안내해 드리겠습니다.'

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    const messageText = inputMessage.trim()
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: messageText, timestamp: new Date() },
    ])
    setInputMessage('')
    setIsLoading(true)

    let aiContent = getFallbackResponse()
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: TENANT, message: messageText }),
      })
      if (response.ok) {
        const data = await response.json()
        aiContent = data.response || aiContent
      }
    } catch {
      /* fallback */
    }

    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), type: 'ai', content: aiContent, timestamp: new Date() },
    ])
    setIsLoading(false)
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          aria-label="AI 문의 열기"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[32rem] w-80 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl sm:w-96">
          <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-medium">AI 고객지원</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={\`flex gap-2 \${m.type === 'user' ? 'justify-end' : 'justify-start'}\`}>
                {m.type === 'ai' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={\`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap \${m.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}\`}>
                  {m.content}
                </div>
                {m.type === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && <p className="text-xs text-muted-foreground">답변 생성 중...</p>}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2 border-t p-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
`
}

function askRoute(slug) {
  return `import { type NextRequest, NextResponse } from 'next/server'

const RESTY_API = (process.env.RESTY_API_BACKEND || 'https://app.restyart.com').replace(/\\/$/, '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, type } = body
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, error: '메시지가 필요합니다.' }, { status: 400 })
    }
    const tenant = type || '${slug}'
    const response = await fetch(\`\${RESTY_API}/api/ask\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-subdomain': tenant,
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
      },
      body: JSON.stringify({ type: tenant, message }),
    })
    const data = await response.json()
    if (!response.ok) return NextResponse.json(data, { status: response.status })
    return NextResponse.json({
      success: true,
      response: data.response,
      type: data.type || tenant,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('문의 API 오류:', error)
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
`
}

const inputComponent = `import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none',
        'placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
`

for (const t of TENANTS) {
  const dir = path.join(BASE, t.slug)
  if (!fs.existsSync(dir)) {
    console.warn('[skip]', t.slug)
    continue
  }
  console.log('\n[' + t.slug + ']')
  write(path.join(dir, 'lib/resty-auth.ts'), restyAuthSrc)
  write(path.join(dir, 'lib/auth-context.tsx'), authContext(t.slug))
  write(path.join(dir, 'components/auth-nav.tsx'), authNav())
  write(path.join(dir, 'components/floating-chat.tsx'), floatingChat(t.slug, t.welcome))
  write(path.join(dir, 'components/restyart-legal-bar.tsx'), legalBarSrc)
  write(path.join(dir, 'app/auth/login/page.tsx'), loginPage(t.brand, t.loginDesc))
  write(path.join(dir, 'app/auth/register/page.tsx'), registerPage(t.brand, t.registerDesc))
  if (!t.static) {
    write(path.join(dir, 'app/api/ask/route.ts'), askRoute(t.slug))
  }
  const inputPath = path.join(dir, 'components/ui/input.tsx')
  if (!fs.existsSync(inputPath)) {
    write(inputPath, inputComponent)
  }
}

console.log('\n[done] integrate-common-auth-ai')
