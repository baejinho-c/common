#!/usr/bin/env node
/**
 * Scaffold forgot-password + reset-password pages for resty-auth tenants.
 * Usage: node common/scripts/scaffold-password-reset-pages.js
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '../..')

/** @type {{ tenant: string, loginPath: string, basePath: '' | '/auth' }[]} */
const TENANTS = [
  { tenant: 'sports', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'save', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'healing', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'qbank', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'reading', loginPath: '/auth/signin', basePath: '/auth' },
  { tenant: 'korean', loginPath: '/auth/signin', basePath: '/auth' },
  { tenant: 'classic', loginPath: '/auth/signin', basePath: '/auth' },
  { tenant: 'tech', loginPath: '/auth/signin', basePath: '/auth' },
  { tenant: 'resume', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'special', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'story', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'vtest', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'gpt', loginPath: '/auth/login', basePath: '/auth' },
  { tenant: 'arc', loginPath: '/login', basePath: '' },
  { tenant: 'cafe', loginPath: '/login', basePath: '' },
  { tenant: 'bucket', loginPath: '/login', basePath: '' },
  { tenant: 'qbox', loginPath: '/login', basePath: '' },
  { tenant: 'mind', loginPath: '/', basePath: '' },
  { tenant: 'mud', loginPath: '/login', basePath: '' },
  { tenant: 'foodsns', loginPath: '/login', basePath: '' },
]

function forgotPage({ tenant, loginPath, basePath }) {
  const forgotPath = `${basePath}/forgot-password`
  return `"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle2, KeyRound, Mail } from "lucide-react"
import { restyForgotPassword } from "@/lib/resty-auth"

const TENANT = "${tenant}"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const result = await restyForgotPassword(email, { tenant: TENANT })
    if (result.success) setSubmitted(true)
    else setError(result.message || "요청 처리 중 오류가 발생했습니다.")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <Link href="${loginPath}">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            로그인으로 돌아가기
          </Button>
        </Link>
        <Card>
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle>비밀번호 찾기</CardTitle>
            <CardDescription>가입 이메일로 재설정 안내를 보내드립니다</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {email}로 재설정 안내 메일을 보냈습니다. 메일이 없으면 스팸함을 확인해 주세요.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "처리 중..." : "재설정 메일 받기"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`
}

function resetPage({ tenant, loginPath, basePath }) {
  const forgotPath = `${basePath}/forgot-password`
  const appDir = basePath ? `app${basePath}` : 'app'
  return `"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react"
import { restyResetPassword } from "@/lib/resty-auth"

const TENANT = "${tenant}"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!token) {
      setError("유효하지 않은 재설정 링크입니다.")
      return
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.")
      return
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    setIsLoading(true)
    const result = await restyResetPassword({ token, newPassword: password }, { tenant: TENANT })
    if (result.success) {
      setDone(true)
      setTimeout(() => router.push("${loginPath}"), 2500)
    } else {
      setError(result.message || "비밀번호 재설정에 실패했습니다.")
    }
    setIsLoading(false)
  }

  if (!token && !done) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          링크가 올바르지 않습니다.{" "}
          <Link href="${forgotPath}" className="underline">
            비밀번호 찾기
          </Link>
          를 다시 시도해 주세요.
        </AlertDescription>
      </Alert>
    )
  }

  if (done) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.</AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">새 비밀번호</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "변경 중..." : "비밀번호 변경"}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <Link href="${loginPath}">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            로그인으로 돌아가기
          </Button>
        </Link>
        <Card>
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle>새 비밀번호 설정</CardTitle>
            <CardDescription>새 비밀번호를 입력해 주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p className="text-sm text-muted-foreground">로딩 중...</p>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`
}

let created = 0
for (const cfg of TENANTS) {
  const tenantRoot = path.join(root, cfg.tenant)
  if (!fs.existsSync(path.join(tenantRoot, 'lib/resty-auth.ts'))) {
    console.log(`[skip] ${cfg.tenant}: no resty-auth.ts`)
    continue
  }

  const forgotDir = cfg.basePath
    ? path.join(tenantRoot, 'app/auth/forgot-password')
    : path.join(tenantRoot, 'app/forgot-password')
  const resetDir = cfg.basePath
    ? path.join(tenantRoot, 'app/auth/reset-password')
    : path.join(tenantRoot, 'app/reset-password')

  fs.mkdirSync(forgotDir, { recursive: true })
  fs.mkdirSync(resetDir, { recursive: true })

  fs.writeFileSync(path.join(forgotDir, 'page.tsx'), forgotPage(cfg), 'utf8')
  fs.writeFileSync(path.join(resetDir, 'page.tsx'), resetPage(cfg), 'utf8')
  created += 2
  console.log(`[ok] ${cfg.tenant}${cfg.basePath}/forgot-password + reset-password`)
}

console.log(`[done] ${created} pages in ${TENANTS.length} tenants`)
