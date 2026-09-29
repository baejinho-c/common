"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, LayoutDashboard, LogOut, Shield } from "lucide-react"
import { clearAdminAuth } from "@/lib/admin-auth"

interface AdminShellProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AdminShell({
  children,
  title = "{{TENANT_NAME}} 관리자",
  description,
}: AdminShellProps) {
  const router = useRouter()

  const handleLogout = () => {
    clearAdminAuth()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-3 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">{title}</h1>
                {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  대시보드
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-1" />
                  홈페이지
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-1" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
