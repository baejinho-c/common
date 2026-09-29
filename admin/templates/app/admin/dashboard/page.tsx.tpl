"use client"

import Link from "next/link"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Globe, Settings, Shield } from "lucide-react"

export default function AdminDashboardPage() {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://{{TENANT}}.restyart.com"

  return (
    <AdminAuthGuard>
      <AdminShell description="{{TENANT_NAME}} 사이트 관리 대시보드">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">관리 대시보드</h2>
          <p className="text-muted-foreground">{{TENANT_NAME}} · {{TENANT}}.restyart.com</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">사이트 정보</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                테넌트: <strong>{{TENANT}}</strong>
                <br />
                도메인: {{TENANT}}.restyart.com
              </CardDescription>
              <Button variant="outline" className="w-full" asChild>
                <a href={siteUrl} target="_blank" rel="noreferrer">
                  사이트 열기
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">관리자 계정</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                아이디: admin
                <br />
                비밀번호: {{TENANT}}
              </CardDescription>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/login">로그인 페이지</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">운영 현황</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                사이트별 관리 기능은 이 대시보드에서 확장할 수 있습니다.
              </CardDescription>
              <Button variant="outline" className="w-full" disabled>
                <Settings className="w-4 h-4 mr-2" />
                준비 중
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminShell>
    </AdminAuthGuard>
  )
}
