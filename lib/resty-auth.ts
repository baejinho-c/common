/**
 * 리스티아트 통합 계정 API 클라이언트 (app.restyart.com /api/resty/*)
 * 각 테넌트는 subdomain + x-subdomain 헤더로 resty_users에 매핑됩니다.
 */

export const DEFAULT_RESTY_API_BASE = "https://app.restyart.com"

export interface RestyUser {
  id: number
  email: string
  name?: string | null
  phone?: string | null
  avatarUrl?: string | null
  role?: string
  status?: string
  locale?: string
  subdomain?: string
  createdAt?: string
  updatedAt?: string
}

export interface RestyAuthResult {
  success: boolean
  message?: string
  token?: string
  userId?: number
  user?: RestyUser
}

export function getRestyApiBase(): string {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
    ""
  const trimmed = String(raw).replace(/\/$/, "")
  if (!trimmed) return DEFAULT_RESTY_API_BASE
  if (trimmed.endsWith("/api")) return trimmed.slice(0, -4)
  return trimmed
}

/** 테넌트 slug: env → 서브도메인 → 경로 prefix */
export function getRestyTenant(fallback = "default"): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUBDOMAIN) {
    return process.env.NEXT_PUBLIC_SUBDOMAIN
  }
  if (typeof window === "undefined") return fallback

  const host = window.location.hostname
  if (host.endsWith(".restyart.com")) {
    const sub = host.split(".")[0]
    if (sub && !["www", "play", "dashboard", "app"].includes(sub)) return sub
  }

  const seg = window.location.pathname.split("/").filter(Boolean)[0]
  if (seg && !["api", "auth", "_next", "r"].includes(seg)) return seg

  return fallback
}

export function normalizeAuthResponse(data: Record<string, unknown>): RestyAuthResult {
  const token = typeof data.token === "string" ? data.token : undefined
  const userId = typeof data.userId === "number" ? data.userId : undefined
  let user = data.user as RestyUser | undefined

  if (!user && userId) {
    user = {
      id: userId,
      email: typeof data.email === "string" ? data.email : "",
      name: typeof data.name === "string" ? data.name : undefined,
      subdomain: typeof data.subdomain === "string" ? data.subdomain : undefined,
      role: "member",
      status: "active",
      locale: "ko-KR",
    }
  }

  return {
    success: data.success === true || !!token,
    message: typeof data.message === "string" ? data.message : undefined,
    token,
    userId: user?.id ?? userId,
    user,
  }
}

export function persistRestySession(result: RestyAuthResult, tenant: string): void {
  if (typeof window === "undefined" || !result.token) return
  localStorage.setItem("auth_token", result.token)
  if (result.user) {
    localStorage.setItem("user_data", JSON.stringify({ ...result.user, subdomain: tenant }))
    localStorage.setItem("user", JSON.stringify({ ...result.user, subdomain: tenant }))
  }
}

export async function restyRegister(
  input: { email: string; password: string; name?: string; phone?: string; locale?: string },
  options?: { tenant?: string; apiBase?: string },
): Promise<RestyAuthResult> {
  const tenant = options?.tenant ?? getRestyTenant()
  const base = options?.apiBase ?? getRestyApiBase()

  const response = await fetch(`${base}/api/resty/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-subdomain": tenant,
    },
    body: JSON.stringify({
      subdomain: tenant,
      email: input.email,
      password: input.password,
      name: input.name,
      phone: input.phone,
      locale: input.locale ?? "ko-KR",
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { success: false, message: data.message || `회원가입 실패 (${response.status})` }
  }

  const result = normalizeAuthResponse(data)
  if (result.success) persistRestySession(result, tenant)
  return result
}

export interface RestySocialLoginInput {
  provider: "google" | "naver" | "kakao"
  providerUserId: string
  email?: string
  name?: string
  accessToken?: string
  refreshToken?: string
  scope?: string
  expiresAt?: string
}

export function parseRestyJwtUid(token: string): number | null {
  try {
    const base64Url = token.split(".")[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    const payload = JSON.parse(jsonPayload) as { uid?: number; userId?: number }
    const id = payload.uid ?? payload.userId
    return typeof id === "number" ? id : null
  } catch {
    return null
  }
}

export async function restySocialLogin(
  input: RestySocialLoginInput,
  options?: { tenant?: string; apiBase?: string },
): Promise<RestyAuthResult> {
  const tenant = options?.tenant ?? getRestyTenant()
  const base = options?.apiBase ?? getRestyApiBase()

  const response = await fetch(`${base}/api/resty/auth/social`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-subdomain": tenant,
    },
    body: JSON.stringify({
      subdomain: tenant,
      ...input,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { success: false, message: data.message || `소셜 로그인 실패 (${response.status})` }
  }

  const result = normalizeAuthResponse(data)
  if (result.success) persistRestySession(result, tenant)
  return result
}

export async function restyFetchUser(
  userId: number,
  options?: { tenant?: string; apiBase?: string; token?: string },
): Promise<RestyUser | null> {
  const tenant = options?.tenant ?? getRestyTenant()
  const base = options?.apiBase ?? getRestyApiBase()
  const token =
    options?.token ??
    (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null)

  const headers: Record<string, string> = { "x-subdomain": tenant }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${base}/api/resty/users/${userId}?subdomain=${encodeURIComponent(tenant)}`, {
    headers,
  })
  if (!response.ok) return null
  const row = await response.json().catch(() => null)
  if (!row || typeof row.id !== "number") return null
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    avatarUrl: row.avatar_url ?? row.avatarUrl,
    role: row.role,
    status: row.status,
    locale: row.locale,
    subdomain: row.subdomain,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  }
}

export async function restyUpdateUser(
  userId: number,
  updates: { name?: string; phone?: string; avatarUrl?: string; locale?: string },
  options?: { tenant?: string; apiBase?: string; token?: string },
): Promise<{ success: boolean; message?: string }> {
  const tenant = options?.tenant ?? getRestyTenant()
  const base = options?.apiBase ?? getRestyApiBase()
  const token =
    options?.token ??
    (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-subdomain": tenant,
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${base}/api/resty/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ subdomain: tenant, ...updates }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { success: false, message: data.message || `프로필 수정 실패 (${response.status})` }
  }
  return { success: true, message: data.message }
}

export async function restyLogin(
  input: { email: string; password: string },
  options?: { tenant?: string; apiBase?: string },
): Promise<RestyAuthResult> {
  const tenant = options?.tenant ?? getRestyTenant()
  const base = options?.apiBase ?? getRestyApiBase()

  const response = await fetch(`${base}/api/resty/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-subdomain": tenant,
    },
    body: JSON.stringify({
      subdomain: tenant,
      email: input.email,
      password: input.password,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { success: false, message: data.message || `로그인 실패 (${response.status})` }
  }

  const result = normalizeAuthResponse(data)
  if (result.success) persistRestySession(result, tenant)
  return result
}

export async function restyForgotPassword(
  email: string,
  options?: { tenant?: string; apiBase?: string },
): Promise<{ success: boolean; message?: string }> {
  const tenant = options?.tenant ?? getRestyTenant()
  const base = options?.apiBase ?? getRestyApiBase()

  const response = await fetch(`${base}/api/resty/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-subdomain": tenant,
    },
    body: JSON.stringify({ subdomain: tenant, email }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { success: false, message: data.message || `요청 실패 (${response.status})` }
  }
  return { success: true, message: data.message || "등록된 이메일이면 비밀번호 재설정 안내를 보냈습니다." }
}

export async function restyResetPassword(
  input: { token: string; newPassword: string },
  options?: { tenant?: string; apiBase?: string },
): Promise<{ success: boolean; message?: string }> {
  const tenant = options?.tenant ?? getRestyTenant()
  const base = options?.apiBase ?? getRestyApiBase()

  const response = await fetch(`${base}/api/resty/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-subdomain": tenant,
    },
    body: JSON.stringify({
      subdomain: tenant,
      token: input.token,
      newPassword: input.newPassword,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { success: false, message: data.message || `재설정 실패 (${response.status})` }
  }
  return { success: true, message: data.message || "비밀번호가 변경되었습니다." }
}
