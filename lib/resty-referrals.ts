/**
 * Resty 추천(리퍼럴) 크레딧 API
 */
import { getRestyApiBase, getRestyTenant } from "./resty-auth"

export interface ReferralMe {
  enabled: boolean
  code?: string
  shareUrl?: string
  rewards?: { referrer: number; referee: number }
  stats?: { invites: number; creditsEarned: number }
  message?: string
}

async function referralFetch<T>(
  path: string,
  options: RequestInit & { tenant?: string; token?: string; adminKey?: string } = {},
): Promise<T> {
  const tenant = options.tenant ?? getRestyTenant()
  const base = getRestyApiBase()
  const token =
    options.token ??
    (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-subdomain": tenant,
    ...(options.headers as Record<string, string>),
  }
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.adminKey) headers["x-resty-admin-key"] = options.adminKey

  const response = await fetch(`${base}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || `Referral API error (${response.status})`)
  }
  return data as T
}

export async function restyGetMyReferral(options?: {
  tenant?: string
  token?: string
  baseUrl?: string
}): Promise<ReferralMe> {
  const tenant = options?.tenant ?? getRestyTenant()
  const qs = options?.baseUrl ? `?baseUrl=${encodeURIComponent(options.baseUrl)}` : ""
  return referralFetch<ReferralMe>(`/api/resty/referrals/me${qs}`, options)
}
