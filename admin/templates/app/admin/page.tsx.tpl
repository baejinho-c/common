"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(isAdminAuthenticated() ? "/admin/dashboard" : "/admin/login")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">관리자 페이지로 이동 중…</p>
    </div>
  )
}
