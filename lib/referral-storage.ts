/**
 * 추천 코드 URL 캡처 — ?ref=CODE
 */
const STORAGE_KEY = "resty_referral_code"

export function captureReferralFromUrl(search?: string): string | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(search ?? window.location.search)
  const ref = params.get("ref") || params.get("referral") || params.get("invite")
  if (!ref) return null
  const code = ref.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (!code) return null
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* ignore */
  }
  return code
}

export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function clearStoredReferralCode(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function buildShareUrl(code: string, baseUrl?: string): string {
  const base =
    baseUrl ||
    (typeof window !== "undefined" ? window.location.origin : "https://appicon.restyart.com")
  return `${base.replace(/\/$/, "")}/?ref=${encodeURIComponent(code)}`
}
