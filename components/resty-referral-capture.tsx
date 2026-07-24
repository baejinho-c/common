"use client"

import { useEffect } from "react"
import { captureReferralFromUrl } from "@/lib/referral-storage"

/** 랜딩 페이지에서 ?ref= 코드 캡처 */
export function RestyReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl()
  }, [])
  return null
}
