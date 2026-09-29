"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import Link from "next/link"
import {
  ADMIN_USERNAME,
  isAdminAuthenticated,
  setAdminAuthenticated,
  verifyAdminLogin,
} from "@/lib/admin-auth"

export default function AdminLoginPage() {
  const [username, setUsername] = useState(ADMIN_USERNAME)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (verifyAdminLogin(username, password)) {
      setAdminAuthenticated()
      router.push("/admin/dashboard")
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">{{TENANT_NAME}} 관리자</CardTitle>
          <CardDescription>사이트 관리 · /admin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="테넌트명"
                autoComplete="current-password"
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            관리자 계정: admin / {{TENANT}}
          </p>
          <p className="text-center mt-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              ← 홈페이지로 돌아가기
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
