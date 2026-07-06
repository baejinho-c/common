/**
 * 플로팅 채팅 → resty-api /api/ask (inquiries 테이블 + AI 응답)
 * 브라우저 전용. 게이트웨이가 Host 기준 x-subdomain 을 주입합니다.
 */
export function getTenantSlug(fallback = 'unknown') {
  if (typeof window === 'undefined') return fallback
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) return fallback
  const slug = hostname.split('.')[0]
  return slug || fallback
}

export async function askInquiry(message, { type, fallback } = {}) {
  const tenant = type || getTenantSlug(type || 'unknown')
  const text = String(message || '').trim()
  if (!text) throw new Error('message is required')

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: tenant, message: text }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.response) return data.response
      if (data.message && data.message !== '문의가 접수되었습니다.') return data.message
    }
  } catch (err) {
    console.error('[inquiry-chat]', err)
  }

  if (typeof fallback === 'function') return fallback(text)
  if (typeof fallback === 'string') return fallback
  return '문의가 접수되었습니다. 잠시 후 다시 시도해 주세요.'
}
