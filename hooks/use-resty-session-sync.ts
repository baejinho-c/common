"use client"

import { useEffect } from "react"
import { RESTY_SESSION_UPDATED_EVENT } from "@/lib/resty-auth"

/** RestyRegisterPage 등 외부 로그인/가입 후 AuthProvider 세션을 다시 불러올 때 사용 */
export function useRestySessionSync(reload: () => void | Promise<void>) {
  useEffect(() => {
    const handler = () => {
      void reload()
    }
    window.addEventListener(RESTY_SESSION_UPDATED_EVENT, handler)
    return () => window.removeEventListener(RESTY_SESSION_UPDATED_EVENT, handler)
  }, [reload])
}
