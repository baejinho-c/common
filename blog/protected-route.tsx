"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 개발 환경에서는 인증 체크를 우회
    if (process.env.NODE_ENV === "development") {
      return
    }

    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // 개발 환경에서는 항상 렌더링
  if (process.env.NODE_ENV === "development") {
    return <>{children}</>
  }

  // 로딩 중이거나 사용자가 없으면 로딩 표시
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}
