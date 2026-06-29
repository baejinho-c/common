/**
 * 테넌트별 브랜드 색상·표시명 (파비콘 / og:image / 로고 생성용)
 */
const BRANDS = {
  arc: { name: 'Insight Arc', color: '#6366F1', accent: '#4F46E5', letter: 'A', icon: 'arc' },
  blog: { name: 'AutoBlogger', color: '#F59E0B', accent: '#D97706', letter: 'B' },
  bucket: { name: '버킷리스트', color: '#0EA5E9', accent: '#0284C7', letter: '桶' },
  brochure: { name: 'Brochure Maker', color: '#0D9488', accent: '#0F766E', letter: 'B', icon: 'brochure' },
  cafe: { name: 'CaffeCritic', color: '#D97706', accent: '#92400E', letter: '☕', icon: 'cafe' },
  care: { name: '케어브릿지', color: '#2563EB', accent: '#1D4ED8', letter: '♥', icon: 'care' },
  career: { name: 'Career Compass', color: '#2563EB', accent: '#1D4ED8', letter: 'C' },
  chemistry: { name: '화학 연구소', color: '#8B5CF6', accent: '#7C3AED', letter: '⚗' },
  classic: { name: 'Classica', color: '#78716C', accent: '#57534E', letter: 'Cl' },
  crm: { name: 'AI Smart CRM', color: '#059669', accent: '#047857', letter: 'CRM' },
  dummy: { name: 'DummyGen', color: '#64748B', accent: '#475569', letter: 'D' },
  english: { name: 'AI 영어 회화', color: '#3B82F6', accent: '#2563EB', letter: 'En' },
  food: { name: '오늘 뭐 먹지', color: '#F97316', accent: '#EA580C', letter: '🍽', icon: 'food' },
  form: { name: 'FormStudio', color: '#3B82F6', accent: '#4F46E5', letter: 'F', icon: 'form' },
  foodsns: { name: '천하제일미식록', color: '#DC2626', accent: '#991B1B', letter: '食', icon: 'foodsns' },
  gpt: { name: 'SmartGPT Guide', color: '#10B981', accent: '#059669', letter: 'G' },
  goodprice: { name: '농부장부', color: '#16A34A', accent: '#15803D', letter: '農' },
  growup: { name: 'GrowUp', color: '#22C55E', accent: '#16A34A', letter: '↑' },
  healing: { name: '오늘의 한 줄', color: '#EC4899', accent: '#DB2777', letter: '💚' },
  hike: { name: 'HikeMate', color: '#84CC16', accent: '#65A30D', letter: '⛰', icon: 'hike' },
  hotfeel: { name: '요즘나봐', color: '#F43F5E', accent: '#E11D48', letter: '🔥' },
  hvalue: { name: 'HValue', color: '#14B8A6', accent: '#0D9488', letter: 'H' },
  jjreview: { name: '찐리뷰', color: '#FB923C', accent: '#F97316', letter: '찐' },
  klocal: { name: 'Taste Korea', color: '#E11D48', accent: '#BE123C', letter: 'KR' },
  korean: { name: 'Hello Hangul', color: '#DC2626', accent: '#B91C1C', letter: '한' },
  library: { name: 'AI 백과사전', color: '#6366F1', accent: '#4F46E5', letter: '📚' },
  light: { name: '빛', color: '#FBBF24', accent: '#F59E0B', letter: '光' },
  linker: { name: 'CorpLinker', color: '#0EA5E9', accent: '#0284C7', letter: 'L' },
  logo: { name: 'LogoStage', color: '#7C3AED', accent: '#6D28D9', letter: '✦' },
  mind: { name: '마음클리닉', color: '#A78BFA', accent: '#8B5CF6', letter: '♡' },
  mindmap: { name: 'MindMap', color: '#06B6D4', accent: '#0891B2', letter: 'M' },
  mud: { name: 'AiMUD School', color: '#854D0E', accent: '#713F12', letter: 'MUD' },
  mypage: { name: 'OnePage.AI', color: '#3B82F6', accent: '#2563EB', letter: '1' },
  physics: { name: 'Physics Lab', color: '#1E40AF', accent: '#1E3A8A', letter: '⚛' },
  play: { name: 'Play', color: '#8B5CF6', accent: '#7C3AED', letter: '▶' },
  plot: { name: 'PlotCraft', color: '#9333EA', accent: '#7E22CE', letter: 'P' },
  portfolio: { name: 'Portfolio', color: '#0F1729', accent: '#38BDF8', letter: 'JH' },
  qbank: { name: 'MyQBank', color: '#2563EB', accent: '#1D4ED8', letter: 'Q' },
  qbox: { name: 'QBox', color: '#0891B2', accent: '#0E7490', letter: 'QB' },
  reading: { name: '독서 탐험가', color: '#059669', accent: '#047857', letter: '📖' },
  recipe: { name: 'SecretRecipeBook', color: '#F97316', accent: '#EA580C', letter: 'R' },
  resume: { name: 'ResumeCraft', color: '#334155', accent: '#1E293B', letter: 'CV' },
  save: { name: 'SavePlay', color: '#6366F1', accent: '#4F46E5', letter: 'S' },
  search: { name: 'AIDA', color: '#0D9488', accent: '#0F766E', letter: '🔍' },
  'seo-foundry': { name: 'SEO Foundry', color: '#14B8A6', accent: '#0D9488', letter: 'SF', icon: 'seo-foundry' },
  sim: { name: 'CareerSim AI', color: '#3B82F6', accent: '#2563EB', letter: 'Sim' },
  special: { name: '익맛익리', color: '#E11D48', accent: '#BE123C', letter: '味' },
  sports: { name: '스포츠 커뮤니티', color: '#16A34A', accent: '#15803D', letter: '⚽', icon: 'sports' },
  story: { name: 'Storyflow AI', color: '#7C3AED', accent: '#6D28D9', letter: 'S', icon: 'story' },
  tech: { name: 'Vibe Coding', color: '#06B6D4', accent: '#0891B2', letter: '</>' },
  today: { name: '맛집추천 AI', color: '#F59E0B', accent: '#D97706', letter: '今', icon: 'food' },
  trace: { name: 'GoTrace', color: '#64748B', accent: '#475569', letter: 'T' },
  trips: { name: 'TRIPS', color: '#0284C7', accent: '#0369A1', letter: '✈' },
  vibe: { name: 'AI 바이브', color: '#A855F7', accent: '#9333EA', letter: 'V' },
  vtest: { name: 'AI 모의면접', color: '#4F46E5', accent: '#4338CA', letter: '面' },
  wish: { name: 'Wish', color: '#F472B6', accent: '#EC4899', letter: '★' },
  wonder: { name: 'WonderTale', color: '#F97316', accent: '#EA580C', letter: 'W', icon: 'wonder' },
  wookwang: { name: 'Wookwang', color: '#1D4ED8', accent: '#1E40AF', letter: 'W' },
  youtube: { name: 'CommentCraft', color: '#EF4444', accent: '#DC2626', letter: '▶' },
  'youtube-vo': { name: 'CommentCraft VO', color: '#DC2626', accent: '#B91C1C', letter: 'VO' },
}

function defaultBrand(slug) {
  const letter = slug.slice(0, 2).toUpperCase()
  const hue = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    color: `hsl(${hue}, 65%, 48%)`,
    accent: `hsl(${hue}, 65%, 38%)`,
    letter,
  }
}

function getBrand(slug) {
  return BRANDS[slug] || defaultBrand(slug)
}

function gradDef(id, brand) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="${brand.color}"/>
    <stop offset="1" stop-color="${brand.accent}"/>
  </linearGradient>`
}

function buildIconPaths(icon, size = 32) {
  const s = size / 32
  const icons = {
    foodsns: `
      <path d="M${16 * s} ${5 * s}l${2 * s} ${8 * s}h${4 * s}l-${5 * s} ${13 * s}-${2 * s}-${8 * s}h-${4 * s}l${5 * s}-${13 * s}z" fill="#FCD34D"/>
      <path d="M${10 * s} ${24 * s}h${12 * s}" stroke="#FEF3C7" stroke-width="${1.5 * s}" stroke-linecap="round" opacity="0.6"/>
    `,
    cafe: `
      <path d="M${10 * s}" y="${12 * s}h${12 * s}v${10 * s}c0 ${2.2 * s}-${1.8 * s} ${4 * s}-${4 * s} ${4 * s}h-${4 * s}c-${2.2 * s} 0-${4 * s}-${1.8 * s}-${4 * s}-${4 * s}V${12 * s}z" fill="#fff"/>
      <path d="M${22 * s} ${14 * s}h${2 * s}c${1.1 * s} 0 ${2 * s} ${0.9 * s} ${2 * s} ${2 * s}s-${0.9 * s} ${2 * s}-${2 * s} ${2 * s}h-${2 * s}" stroke="#fff" stroke-width="${1.6 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${13 * s} ${8 * s}c0-1 ${1 * s}-2 ${3 * s}-2M${16 * s} ${7 * s}c0-1.2 ${1.2 * s}-2.2 ${3 * s}-2.2M${19 * s} ${8 * s}c0-1 ${1 * s}-2 ${3 * s}-2" stroke="#FEF3C7" stroke-width="${1.2 * s}" stroke-linecap="round"/>
    `,
    brochure: `
      <path d="M${9 * s} ${10 * s}h${8 * s}v${18 * s}H${9 * s}z" fill="#fff" opacity="0.92"/>
      <path d="M${17 * s} ${10 * s}h${8 * s}v${18 * s}h-${8 * s}z" fill="#fff" opacity="0.72"/>
      <path d="M${9 * s} ${10 * s}l${8 * s} ${3.5 * s} ${8 * s}-${3.5 * s}" stroke="#CCFBF1" stroke-width="${1.3 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${12 * s} ${16 * s}h${5 * s}M${12 * s} ${20 * s}h${7 * s}" stroke="#0F766E" stroke-width="${1 * s}" stroke-linecap="round" opacity="0.45"/>
    `,
    care: `
      <path d="M${16 * s} ${24 * s}c-${4 * s}-${3 * s}-${8 * s}-${6 * s}-${8 * s}-${10 * s}a${4 * s} ${4 * s} 0 0 1 ${8 * s} 0 ${4 * s} ${4 * s} 0 0 1 ${8 * s} 0c0 ${4 * s}-${4 * s} ${7 * s}-${8 * s} ${10 * s}z" fill="#fff"/>
      <path d="M${6 * s} ${26 * s}h${20 * s}" stroke="#BFDBFE" stroke-width="${2 * s}" stroke-linecap="round"/>
      <path d="M${8 * s} ${26 * s}q${8 * s}-${4 * s} ${16 * s} 0" stroke="#fff" stroke-width="${1.5 * s}" fill="none" stroke-linecap="round"/>
    `,
    food: `
      <ellipse cx="${16 * s}" cy="${20 * s}" rx="${8 * s}" ry="${5 * s}" fill="#fff"/>
      <path d="M${8 * s} ${20 * s}h${16 * s}" stroke="${'#FED7AA'}" stroke-width="${1.2 * s}"/>
      <path d="M${12 * s} ${12 * s}v${4 * s}M${16 * s} ${11 * s}v${5 * s}M${20 * s} ${12 * s}v${4 * s}" stroke="#FEF3C7" stroke-width="${1.4 * s}" stroke-linecap="round"/>
    `,
    hike: `
      <path d="M${8 * s} ${24 * s}l${8 * s}-${12 * s} ${4 * s} ${6 * s} ${8 * s}-${10 * s} ${4 * s} ${16 * s}z" fill="#fff"/>
      <circle cx="${24 * s}" cy="${10 * s}" r="${2 * s}" fill="#ECFCCB"/>
    `,
    arc: `
      <path d="M${10 * s} ${22 * s}h${12 * s}M${16 * s} ${10 * s}v${12 * s}" stroke="#fff" stroke-width="${2.2 * s}" stroke-linecap="round"/>
      <circle cx="${16 * s}" cy="${16 * s}" r="${9 * s}" stroke="#E0E7FF" stroke-width="${1.5 * s}" fill="none"/>
    `,
    sports: `
      <circle cx="${16 * s}" cy="${17 * s}" r="${7.5 * s}" fill="#fff"/>
      <path d="M${16 * s} ${9.5 * s}l${2.2 * s} ${3.2 * s} ${4.2 * s} .2-${1.8 * s} ${3.2 * s}-${3.2 * s}-2.2-${4.2 * s} .2z" fill="#15803D" opacity="0.85"/>
      <path d="M${11 * s} ${17 * s}l${2.5 * s}-1.5 ${2.5 * s} 1.5-${1 * s} ${2.8 * s}v-${3 * s}z" fill="#15803D" opacity="0.55"/>
      <path d="M${9 * s} ${26 * s}h${14 * s}" stroke="#BBF7D0" stroke-width="${1.8 * s}" stroke-linecap="round"/>
      <path d="M${13 * s} ${22 * s}h${6 * s}l${1 * s} ${4 * s}h-${8 * s}z" fill="#FEF3C7"/>
      <path d="M${14 * s} ${22 * s}h${4 * s}v${2 * s}h-${4 * s}z" fill="#FCD34D"/>
    `,
    form: `
      <rect x="${11 * s}" y="${8 * s}" width="${10 * s}" height="${16 * s}" rx="${1.5 * s}" fill="#fff"/>
      <path d="M${13 * s} ${12 * s}h${6 * s}M${13 * s} ${16 * s}h${6 * s}M${13 * s} ${20 * s}h${4 * s}" stroke="#4F46E5" stroke-width="${1.2 * s}" stroke-linecap="round"/>
      <path d="M${20 * s} ${9 * s}l${1.5 * s} ${1.5 * s} ${2.5 * s}-${3 * s}" stroke="#FCD34D" stroke-width="${1.3 * s}" fill="none" stroke-linecap="round"/>
      <circle cx="${22 * s}" cy="${9 * s}" r="${1 * s}" fill="#FCD34D"/>
    `,
    story: `
      <rect x="${9 * s}" y="${13 * s}" width="${11 * s}" height="${7 * s}" rx="${1.2 * s}" fill="#fff" opacity="0.92"/>
      <rect x="${13 * s}" y="${11 * s}" width="${11 * s}" height="${7 * s}" rx="${1.2 * s}" fill="#fff" opacity="0.72"/>
      <path d="M${11 * s} ${22 * s}h${10 * s}M${16 * s} ${22 * s}v${3 * s}" stroke="#E9D5FF" stroke-width="${1.4 * s}" stroke-linecap="round"/>
      <circle cx="${19 * s}" cy="${14 * s}" r="${1 * s}" fill="#C4B5FD"/>
    `,
    wonder: `
      <circle cx="${18 * s}" cy="${18 * s}" r="${6.5 * s}" fill="#fff"/>
      <circle cx="${15.5 * s}" cy="${17 * s}" r="${0.9 * s}" fill="#EA580C"/>
      <circle cx="${18.5 * s}" cy="${16 * s}" r="${0.9 * s}" fill="#EA580C"/>
      <path d="M${14 * s} ${21 * s}q${2 * s}-1.5 ${4 * s} 0" stroke="#EA580C" stroke-width="${1 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${12 * s} ${24 * s}q${4 * s}-${3.5 * s} ${8 * s} 0q${4 * s} ${3.5 * s} ${8 * s} 0" fill="#FED7AA"/>
      <path d="M${14 * s} ${10 * s}l${2 * s} ${2 * s} ${4 * s}-${2.5 * s}" stroke="#FEF3C7" stroke-width="${1.2 * s}" fill="none" stroke-linecap="round"/>
    `,
    'seo-foundry': `
      <path d="M${16 * s} ${7 * s}l${7 * s} ${4 * s}v${8 * s}l-${7 * s} ${4 * s}-${7 * s}-${4 * s}v-${8 * s}z" fill="#fff" opacity="0.92"/>
      <circle cx="${21 * s}" cy="${21 * s}" r="${4.5 * s}" stroke="#fff" stroke-width="${1.4 * s}" fill="none"/>
      <path d="M${24 * s} ${24 * s}l${3 * s} ${3 * s}" stroke="#CCFBF1" stroke-width="${1.6 * s}" stroke-linecap="round"/>
      <path d="M${11 * s} ${25 * s}h${6 * s}M${11 * s} ${21 * s}h${4 * s}" stroke="#5EEAD4" stroke-width="${1 * s}" stroke-linecap="round" opacity="0.7"/>
    `,
  }
  return icons[icon] || ''
}

function buildMarkContent(brand, size = 32) {
  const letter = String(brand.letter).slice(0, 3)
  const fontSize = letter.length > 2 ? size * 0.34 : letter.length > 1 ? size * 0.4 : size * 0.5
  const icon = brand.icon ? buildIconPaths(brand.icon, size) : ''
  if (icon) return icon
  return `<text x="${size / 2}" y="${size * 0.66}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${letter}</text>`
}

function buildFaviconSvg(brand) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" role="img" aria-label="${brand.name}">
  <defs>${gradDef('bg', brand)}</defs>
  <rect width="32" height="32" rx="8" fill="url(#bg)"/>
  <rect x="1" y="1" width="30" height="30" rx="7" fill="none" stroke="#ffffff" stroke-opacity="0.12"/>
  ${buildMarkContent(brand, 32)}
</svg>`
}

function buildLogoMarkSvg(brand) {
  const size = 48
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none" role="img" aria-label="${brand.name}">
  <defs>${gradDef('mark-bg', brand)}</defs>
  <rect width="${size}" height="${size}" rx="12" fill="url(#mark-bg)"/>
  <rect x="1.5" y="1.5" width="${size - 3}" height="${size - 3}" rx="10.5" fill="none" stroke="#ffffff" stroke-opacity="0.14"/>
  ${buildMarkContent(brand, size)}
</svg>`
}

function getWordmarkParts(slug, brand) {
  const map = {
    sports: [
      { text: '스포츠 ', color: 'foreground' },
      { text: '커뮤니티', color: brand.color },
    ],
    foodsns: [
      { text: '천하제일', color: 'foreground' },
      { text: '미식록', color: brand.color },
    ],
    cafe: [
      { text: 'Caffe', color: 'foreground' },
      { text: 'Critic', color: '#F59E0B' },
    ],
    care: [
      { text: '케어', color: 'foreground' },
      { text: '브릿지', color: brand.color },
    ],
    form: [
      { text: 'Form', color: 'foreground' },
      { text: 'Studio', color: brand.color },
    ],
    story: [
      { text: 'Storyflow ', color: 'foreground' },
      { text: 'AI', color: brand.color },
    ],
    wonder: [
      { text: 'Wonder', color: 'foreground' },
      { text: 'Tale', color: brand.color },
    ],
    arc: [
      { text: 'Insight ', color: 'foreground' },
      { text: 'Arc', color: brand.color },
    ],
    food: [
      { text: '오늘 뭐 ', color: 'foreground' },
      { text: '먹지', color: brand.color },
    ],
    hike: [
      { text: 'Hike', color: 'foreground' },
      { text: 'Mate', color: brand.color },
    ],
    today: [
      { text: '맛집', color: 'foreground' },
      { text: '추천 AI', color: brand.color },
    ],
    tech: [
      { text: 'Vibe ', color: 'foreground' },
      { text: 'Coding', color: brand.color },
    ],
    blog: [
      { text: 'Auto', color: 'foreground' },
      { text: 'Blogger', color: brand.color },
    ],
    recipe: [
      { text: '비법', color: 'foreground' },
      { text: '노트', color: brand.color },
    ],
    brochure: [
      { text: 'Brochure ', color: 'foreground' },
      { text: 'Maker', color: brand.color },
    ],
    'seo-foundry': [
      { text: 'SEO ', color: 'foreground' },
      { text: 'Foundry', color: brand.color },
    ],
  }
  if (map[slug]) return map[slug]

  const camel = brand.name.match(/^(.+?)([A-Z][a-zA-Z].*)$/)
  if (camel) {
    return [
      { text: camel[1], color: 'foreground' },
      { text: camel[2], color: brand.color },
    ]
  }
  return [{ text: brand.name, color: 'foreground' }]
}

function buildLogoSvg(slug, brand) {
  const safeName = String(brand.name).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const isKo = /[가-힣]/.test(brand.name)
  const fontFamily = isKo
    ? "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif"
    : "system-ui, -apple-system, sans-serif"
  const accentText = slug === 'foodsns' ? '#FCD34D' : slug === 'cafe' ? '#F59E0B' : brand.color
  const parts = brand.name.match(/^(.+?)([A-Z][a-z].*)$/)
  const splitName =
    slug === 'cafe' && parts
      ? `<tspan fill="#111827">Caffe</tspan><tspan fill="${accentText}">Critic</tspan>`
      : slug === 'care'
        ? `<tspan fill="#111827">케어</tspan><tspan fill="${brand.color}">브릿지</tspan>`
        : slug === 'sports'
          ? `<tspan fill="#111827">스포츠 </tspan><tspan fill="${brand.color}">커뮤니티</tspan>`
            : slug === 'form'
            ? `<tspan fill="#111827">Form</tspan><tspan fill="${brand.color}">Studio</tspan>`
            : slug === 'brochure'
              ? `<tspan fill="#111827">Brochure </tspan><tspan fill="${brand.color}">Maker</tspan>`
              : slug === 'seo-foundry'
                ? `<tspan fill="#111827">SEO </tspan><tspan fill="${brand.color}">Foundry</tspan>`
                : slug === 'story'
              ? `<tspan fill="#111827">Storyflow </tspan><tspan fill="${brand.color}">AI</tspan>`
              : slug === 'wonder'
                ? `<tspan fill="#111827">Wonder</tspan><tspan fill="${brand.color}">Tale</tspan>`
                : `<tspan fill="#111827">${safeName}</tspan>`

  const width =
    slug === 'sports'
      ? 260
      : slug === 'form'
        ? 230
        : slug === 'brochure'
          ? 250
          : slug === 'seo-foundry'
            ? 240
            : slug === 'story'
            ? 250
            : slug === 'wonder'
              ? 230
              : 220

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 48" fill="none" role="img" aria-label="${safeName}">
  <defs>${gradDef('logo-grad', brand)}</defs>
  <rect x="0" y="4" width="40" height="40" rx="10" fill="url(#logo-grad)"/>
  <rect x="1" y="5" width="38" height="38" rx="9" fill="none" stroke="#ffffff" stroke-opacity="0.14"/>
  ${buildMarkContent(brand, 40)}
  <text x="50" y="33" font-family="${fontFamily}" font-size="22" font-weight="800">${splitName}</text>
</svg>`
}

function buildOgImageSvg(slug, brand) {
  const safeName = String(brand.name).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none" role="img" aria-label="${safeName}">
  <defs>
    ${gradDef('bg', brand)}
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="980" cy="120" r="200" fill="#ffffff" opacity="0.08"/>
  <circle cx="180" cy="520" r="240" fill="#000000" opacity="0.08"/>
  <rect x="80" y="180" width="112" height="112" rx="28" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-opacity="0.2"/>
  <g transform="translate(80,180) scale(3.5)" filter="url(#glow)">
    ${buildMarkContent(brand, 32)}
  </g>
  <text x="230" y="235" font-family="system-ui,sans-serif" font-size="68" font-weight="800" fill="#ffffff">${safeName}</text>
  <text x="230" y="300" font-family="system-ui,sans-serif" font-size="30" fill="#ffffff" opacity="0.8">${slug}.restyart.com</text>
  <text x="80" y="560" font-family="system-ui,sans-serif" font-size="22" fill="#ffffff" opacity="0.45">Powered by Restyart</text>
</svg>`
}

module.exports = {
  BRANDS,
  getBrand,
  getWordmarkParts,
  buildFaviconSvg,
  buildLogoMarkSvg,
  buildLogoSvg,
  buildOgImageSvg,
  defaultBrand,
}
