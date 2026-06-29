/**
 * Resty 서비스 퍼널 — 테넌트별 연관 서비스 링크 (SEO 유입 → 허브 → 교육)
 * publish 시 legal footer + (선택) 앱 컴포넌트에서 사용
 */

const SERVICE = {
  growup: { slug: 'growup', label: '그로우맘', desc: '부모 커뮤니티', url: 'https://growup.restyart.com' },
  wonder: { slug: 'wonder', label: 'WonderTale', desc: 'AI 영어 동화', url: 'https://wonder.restyart.com' },
  reading: { slug: 'reading', label: '리딩', desc: '독서·학습', url: 'https://reading.restyart.com' },
  sim: { slug: 'sim', label: 'CareerSim', desc: '진로 시뮬레이션', url: 'https://sim.restyart.com' },
  library: { slug: 'library', label: 'AI 백과', desc: '백과사전', url: 'https://library.restyart.com' },
  mind: { slug: 'mind', label: '마음케어', desc: 'AI 마음 상담', url: 'https://mind.restyart.com' },
  recipe: { slug: 'recipe', label: '레시피', desc: '요리·반찬', url: 'https://recipe.restyart.com' },
  today: { slug: 'today', label: '오늘의 메뉴', desc: '급식·메뉴', url: 'https://today.restyart.com' },
  food: { slug: 'food', label: '푸드', desc: '음식 정보', url: 'https://food.restyart.com' },
  cafe: { slug: 'cafe', label: '카페', desc: '카페·맛집', url: 'https://cafe.restyart.com' },
  qbox: { slug: 'qbox', label: 'Q&A', desc: '질문과 답변', url: 'https://qbox.restyart.com' },
  gpt: { slug: 'gpt', label: 'AI 커뮤니티', desc: 'GPT 토론', url: 'https://gpt.restyart.com' },
  sports: { slug: 'sports', label: '스포츠', desc: '스포츠 모임', url: 'https://sports.restyart.com' },
  chemistry: { slug: 'chemistry', label: '화학', desc: '과학 학습', url: 'https://chemistry.restyart.com' },
  physics: { slug: 'physics', label: '물리', desc: '물리 학습', url: 'https://physics.restyart.com' },
  english: { slug: 'english', label: '영어', desc: '영어 학습', url: 'https://english.restyart.com' },
  hotfeel: { slug: 'hotfeel', label: 'HotFeel', desc: '웹툰·콘텐츠', url: 'https://hotfeel.restyart.com' },
  career: { slug: 'career', label: '진로', desc: '커리어', url: 'https://career.restyart.com' },
  healing: { slug: 'healing', label: '힐링', desc: '마음 힐링', url: 'https://healing.restyart.com' },
}

/** slug → 우선 노출할 연관 slug 목록 */
const FUNNEL_MAP = {
  growup: ['wonder', 'reading', 'sim', 'recipe', 'mind', 'library'],
  wonder: ['growup', 'reading', 'english', 'library'],
  reading: ['growup', 'wonder', 'library', 'english'],
  sim: ['growup', 'hotfeel', 'career'],
  library: ['growup', 'qbox', 'wonder', 'gpt'],
  mind: ['growup', 'healing'],
  recipe: ['growup', 'today', 'food', 'cafe'],
  today: ['growup', 'recipe', 'food'],
  food: ['growup', 'recipe', 'cafe'],
  cafe: ['growup', 'recipe', 'food'],
  qbox: ['growup', 'gpt', 'library'],
  gpt: ['growup', 'qbox', 'sports'],
  sports: ['gpt', 'growup'],
  chemistry: ['growup', 'physics', 'library'],
  physics: ['growup', 'chemistry', 'library'],
  english: ['growup', 'wonder', 'reading'],
  hotfeel: ['sim', 'gpt'],
  career: ['sim', 'growup'],
}

const DEFAULT_LINKS = ['growup', 'wonder', 'recipe', 'library', 'gpt']

function getRelatedServices(tenant, limit = 5) {
  const slug = String(tenant || '').toLowerCase()
  const keys = FUNNEL_MAP[slug] || DEFAULT_LINKS
  const seen = new Set([slug])
  const out = []
  for (const key of keys) {
    if (seen.has(key)) continue
    const item = SERVICE[key]
    if (!item) continue
    seen.add(key)
    out.push(item)
    if (out.length >= limit) break
  }
  return out
}

function buildFunnelLinksHtml(tenant) {
  const links = getRelatedServices(tenant, 5)
  if (!links.length) return ''
  const items = links
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:none;margin-right:12px;white-space:nowrap;">${s.label}</a>`,
    )
    .join('')
  return `
<div data-resty-funnel="1" style="margin-top:10px;padding-top:10px;border-top:1px solid #e5e7eb;">
  <p style="margin:0 0 6px;font-weight:600;color:#374151;font-size:11px;">Resty 연관 서비스</p>
  <p style="margin:0;line-height:1.8;font-size:11px;">${items}</p>
</div>`
}

module.exports = {
  SERVICE,
  FUNNEL_MAP,
  getRelatedServices,
  buildFunnelLinksHtml,
}
