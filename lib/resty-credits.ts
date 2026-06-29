/**
 * Resty 통합 크레딧 API (app.restyart.com /api/resty/credits/*)
 */
import { getRestyApiBase, getRestyTenant } from "./resty-auth"

export interface CreditBalance {
  balance: number
  lastUpdated?: string
}

export interface CreditTransaction {
  id: string | number
  type: string
  amount: number
  description?: string
  createdAt?: string
  created_at?: string
}

export interface CreditHistory {
  transactions: CreditTransaction[]
  total?: number
  page?: number
  pageSize?: number
}

async function creditsFetch<T>(
  path: string,
  options: RequestInit & { tenant?: string; token?: string } = {},
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

  const response = await fetch(`${base}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || `Credits API error (${response.status})`)
  }
  return data as T
}

export async function restyGetCreditBalance(
  userId: number,
  options?: { tenant?: string; token?: string },
): Promise<CreditBalance> {
  const tenant = options?.tenant ?? getRestyTenant()
  const data = await creditsFetch<{ balance: number }>(
    `/api/resty/credits/balance?subdomain=${encodeURIComponent(tenant)}&userId=${userId}`,
    options,
  )
  return { balance: data.balance ?? 0, lastUpdated: new Date().toISOString() }
}

export async function restyGetCreditHistory(
  userId: number,
  page = 1,
  pageSize = 20,
  options?: { tenant?: string; token?: string },
): Promise<CreditHistory> {
  const tenant = options?.tenant ?? getRestyTenant()
  const data = await creditsFetch<{
    items?: CreditTransaction[]
    transactions?: CreditTransaction[]
    total?: number
  }>(
    `/api/resty/credits/history?subdomain=${encodeURIComponent(tenant)}&userId=${userId}&page=${page}&pageSize=${pageSize}`,
    options,
  )
  return {
    transactions: data.items ?? data.transactions ?? [],
    total: data.total,
    page,
    pageSize,
  }
}

export async function restyChargeCredits(
  userId: number,
  amount: number,
  description: string,
  options?: { tenant?: string; token?: string },
): Promise<{ success: boolean; balance?: number }> {
  const tenant = options?.tenant ?? getRestyTenant()
  return creditsFetch("/api/resty/credits/charge", {
    method: "POST",
    body: JSON.stringify({
      subdomain: tenant,
      userId,
      amount,
      description,
      idempotencyKey: `charge_${userId}_${Date.now()}`,
    }),
    ...options,
  })
}

export async function restySpendCredits(
  userId: number,
  amount: number,
  description: string,
  options?: { tenant?: string; token?: string },
): Promise<{ success: boolean; balance?: number }> {
  const tenant = options?.tenant ?? getRestyTenant()
  return creditsFetch("/api/resty/credits/spend", {
    method: "POST",
    body: JSON.stringify({
      subdomain: tenant,
      userId,
      amount,
      description,
      idempotencyKey: `spend_${userId}_${Date.now()}`,
    }),
    ...options,
  })
}

export async function restyDailyTopup(
  userId: number,
  options?: { tenant?: string; token?: string },
): Promise<{ success: boolean; amount?: number; balance?: number }> {
  const tenant = options?.tenant ?? getRestyTenant()
  return creditsFetch("/api/resty/credits/topup-daily", {
    method: "POST",
    body: JSON.stringify({ subdomain: tenant, userId }),
    ...options,
  })
}
