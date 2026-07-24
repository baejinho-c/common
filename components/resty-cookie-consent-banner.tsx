"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "resty_cookie_consent"

/**
 * Google Analytics 등 분석 쿠키 동의 배너 (법무 검토 후 활성화).
 * layout에 추가하고 enableAnalytics prop으로 GA 로드를 동의 후에만 실행하세요.
 */
export function RestyCookieConsentBanner({
  enabled = false,
  onAccept,
  onReject,
}: {
  enabled?: boolean
  onAccept?: () => void
  onReject?: () => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [enabled])

  if (!enabled || !visible) return null

  const save = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* ignore */
    }
    setVisible(false)
    if (value === "accepted") onAccept?.()
    else onReject?.()
  }

  return (
    <div
      role="dialog"
      aria-label="쿠키 및 분석 도구 동의"
      className="fixed bottom-0 inset-x-0 z-[100] border-t bg-background/95 backdrop-blur p-4 shadow-lg"
    >
      <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
        <p className="flex-1 text-muted-foreground">
          서비스 개선을 위해 Google Analytics 등 분석 쿠키를 사용할 수 있습니다.{" "}
          <Link href="/privacy" className="text-primary underline">
            개인정보처리방침
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={() => save("rejected")}>
            거부
          </Button>
          <Button type="button" size="sm" onClick={() => save("accepted")}>
            동의
          </Button>
        </div>
      </div>
    </div>
  )
}
