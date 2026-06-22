"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { pageview } from "@/lib/gtag"

export function useAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    pageview(pathname)
  }, [pathname])
}
