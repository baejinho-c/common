/**
 * resty_likes API 클라이언트 — app.restyart.com/api/likes (테넌트별 subdomain + type + key)
 * 커뮤니티 테넌트에서 import 하거나 동일 내용을 lib/resty-likes.ts 로 복사해 사용합니다.
 */

export type RestyLikeType = "post" | "comment" | "book" | "dislike" | string

export function getRestyLikesApiBase(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname
    if (host.endsWith(".restyart.com")) {
      const sub = host.split(".")[0]
      if (sub && !["www", "play", "dashboard", "app"].includes(sub)) {
        return `${window.location.origin}/api`
      }
    }
    return "/api"
  }
  return "https://app.restyart.com/api"
}

export function parseRestyJwtUid(token: string): number | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
    const uid = payload?.uid ?? payload?.userId ?? payload?.id
    const n = Number(uid)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

export function getRestyLikeUserId(): number | null {
  if (typeof window === "undefined") return null
  const token =
    localStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("resty_auth_token")
  if (!token) return null
  return parseRestyJwtUid(token)
}

function likeHeaders(token?: string): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

export async function checkRestyLike(input: {
  subdomain: string
  type: RestyLikeType
  key: string
  userId?: number
}): Promise<{ isLiked: boolean; likeCount: number }> {
  const qs = new URLSearchParams({
    subdomain: input.subdomain,
    type: String(input.type),
    key: String(input.key),
  })
  if (input.userId) qs.set("user_id", String(input.userId))
  const res = await fetch(`${getRestyLikesApiBase()}/likes/check?${qs}`)
  if (!res.ok) return { isLiked: false, likeCount: 0 }
  return res.json()
}

export async function toggleRestyLike(input: {
  subdomain: string
  type: RestyLikeType
  key: string
  userId: number
  token?: string
}): Promise<{ isLiked: boolean; likeCount: number }> {
  const token =
    input.token ??
    (typeof window !== "undefined"
      ? localStorage.getItem("auth_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("resty_auth_token") ||
        undefined
      : undefined)

  const res = await fetch(`${getRestyLikesApiBase()}/likes`, {
    method: "POST",
    headers: likeHeaders(token),
    body: JSON.stringify({
      user_id: input.userId,
      subdomain: input.subdomain,
      type: input.type,
      key: String(input.key),
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || "좋아요 처리에 실패했습니다")
  }
  return res.json()
}
