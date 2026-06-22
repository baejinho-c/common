"use client"

import { useEffect, useState } from "react"

interface ApiStatus {
  openai: boolean
  naver: boolean
  overall: boolean
}

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/status")
        const data = await response.json()
        if (data.success) {
          setStatus(data.status)
        } else {
          setStatus({ openai: false, naver: false, overall: false })
        }
      } catch (error) {
        console.error("[v0] Failed to check API status:", error)
        setStatus({ openai: false, naver: false, overall: false })
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
    // 5분마다 상태 확인
    const interval = setInterval(checkStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-xs text-gray-400">확인 중...</span>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="text-xs text-gray-400">상태 불명</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {/* OpenAI API 상태 */}
      <div className="flex items-center space-x-1">
        <div
          className={`w-2 h-2 rounded-full ${status.openai ? "bg-green-500" : "bg-red-500"}`}
          title={`OpenAI API: ${status.openai ? "연결됨" : "연결 안됨"}`}
        />
        <span className="text-xs text-gray-400">AI</span>
      </div>

      {/* 네이버 API 상태 */}
      <div className="flex items-center space-x-1">
        <div
          className={`w-2 h-2 rounded-full ${status.naver ? "bg-green-500" : "bg-red-500"}`}
          title={`네이버 API: ${status.naver ? "연결됨" : "연결 안됨"}`}
        />
        <span className="text-xs text-gray-400">네이버</span>
      </div>
    </div>
  )
}
