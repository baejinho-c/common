/**
 * Resty 쿠폰 크레딧 API
 */
import { getRestyApiBase, getRestyTenant } from "./resty-auth"

export interface CouponPreview {
  valid: boolean
  creditAmount?: number
  note?: string
  remainingUses?: number
  message?: string
}

export interface CouponRow {
  id: number
  code: string
  credit_amount: number
  max_uses: number
  used_count: number
  expires_at: string | null
  active: number
  note: string | null
  created_at: string
  updated_at: string
}

async function couponFetch<T>(
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
    throw new Error(data.message || `Coupon API error (${response.status})`)
  }
  return data as T
}

export async function restyPreviewCoupon(
  code: string,
  options?: { tenant?: string },
): Promise<CouponPreview> {
  return couponFetch<CouponPreview>(
    `/api/resty/coupons/preview?code=${encodeURIComponent(code)}`,
    { tenant: options?.tenant },
  )
}

export async function restyRedeemCoupon(
  code: string,
  options?: { tenant?: string; token?: string },
): Promise<{ success: boolean; message?: string; creditsGranted?: number; balance?: number }> {
  return couponFetch(`/api/resty/coupons/redeem`, {
    method: "POST",
    body: JSON.stringify({ code }),
    ...options,
  })
}

export async function restyListCoupons(options?: {
  tenant?: string
  adminKey?: string
  token?: string
}): Promise<{ coupons: CouponRow[] }> {
  return couponFetch(`/api/resty/admin/coupons`, options)
}

export async function restyCreateCoupon(
  input: {
    code?: string
    creditAmount: number
    maxUses?: number
    expiresAt?: string | null
    note?: string
    autoGenerate?: boolean
  },
  options?: { tenant?: string; adminKey?: string; token?: string },
): Promise<{ success: boolean; id: number; code: string; creditAmount: number }> {
  return couponFetch(`/api/resty/admin/coupons`, {
    method: "POST",
    body: JSON.stringify({
      code: input.code,
      creditAmount: input.creditAmount,
      maxUses: input.maxUses ?? 1,
      expiresAt: input.expiresAt ?? null,
      note: input.note ?? null,
      autoGenerate: input.autoGenerate ?? !input.code,
    }),
    ...options,
  })
}

export async function restySetCouponActive(
  id: number,
  active: boolean,
  options?: { tenant?: string; adminKey?: string; token?: string },
): Promise<{ success: boolean }> {
  return couponFetch(`/api/resty/admin/coupons/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
    ...options,
  })
}
