#!/usr/bin/env node
/**
 * 테넌트별 PROJECT.md 생성 (기능·API·유료화·개선점)
 * Usage: node common/scripts/generate-project-md.js [tenant...]
 */
const fs = require("fs")
const path = require("path")

const WORKDIR = path.join(__dirname, "../..")
const SKIP = new Set(["common", "restyserver", "resty-api", "node_modules", ".git"])

const MONETIZATION = {
  cafe: { model: "프리미엄 리뷰·AI 생성·지역 광고", potential: "높음", note: "카페/음식점 데이터+UGC 리뷰" },
  qbank: { model: "구독·문제팩·학원 B2B", potential: "높음", note: "교육 콘텐츠 반복 과금" },
  crm: { model: "SaaS 월 구독·팀 플랜", potential: "높음", note: "B2B 영업 도구" },
  mind: { model: "크레딧·상담 세션·프리미엄 테스트", potential: "높음", note: "AI 심리/상담" },
  blog: { model: "Pro 플랜·자동 포스팅·네이버 연동", potential: "높음", note: "크리에이터 도구" },
  tech: { model: "유료 아티클·북·광고", potential: "중상", note: "콘텐츠 미디어" },
  logo: { model: "로고 생성 크레딧·브랜드 패키지", potential: "중상", note: "AI 디자인" },
  resume: { model: "이력서 분석·프리미엄 템플릿", potential: "중상", note: "취업 도구" },
  career: { model: "학교/학원 라이선스·진로 리포트", potential: "중상", note: "교육 B2B" },
  reading: { model: "독서 챌린지·학부모 프리미엄", potential: "중", note: "교육 앱" },
  trips: { model: "여행 가이드·제휴 커미션", potential: "중", note: "트래블 콘텐츠" },
  light: { model: "성경 앱 기부·프리미엄 QT·교회 B2B", potential: "중", note: "종교 커뮤니티" },
  hike: { model: "등산 코스 프리미엄·장비 제휴", potential: "중", note: "아웃도어 커뮤니티" },
  hotfeel: { model: "트렌드 리포트·브랜드 인사이트", potential: "중", note: "SNS 트렌드" },
  english: { model: "학습 크레딧·튜터 매칭", potential: "중", note: "언어 학습" },
  healing: { model: "힐링 콘텐츠·세션 크레딧", potential: "중", note: "웰니스" },
  story: { model: "스토리 생성 크레딧·출판", potential: "중", note: "창작 도구" },
  mud: { model: "게임 크레딧·월드 확장", potential: "중", note: "교육 게임" },
  special: { model: "맛집 리스트·로컬 광고", potential: "중", note: "로컬 큐레이션" },
  default: { model: "크레딧·구독·B2B 라이선스", potential: "검토 필요", note: "서비스 특성 분석 후 결정" },
}

function walk(dir, acc = [], filter) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".") || ent.name === "node_modules") continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, acc, filter)
    else if (!filter || filter(full)) acc.push(full)
  }
  return acc
}

function collectRoutes(appDir) {
  const pages = walk(appDir, [], (f) => /\/page\.tsx?$/.test(f))
  const routes = new Set()
  for (const p of pages) {
    let rel = path.relative(appDir, p).replace(/\\/g, "/").replace(/\/page\.tsx?$/, "")
    if (rel === "page") rel = ""
    else if (rel.endsWith("/page")) rel = rel.slice(0, -5)
    routes.add("/" + rel.replace(/^\/+/, "") || "/")
  }
  return [...routes].sort()
}

function analyzeApi(tenant, files, text) {
  const authFiles = files.filter((f) => /auth|api-client|api\.ts|credits/i.test(f))
  const authText = authFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n")

  const wired = files.some(
    (f) =>
      !f.endsWith("resty-auth.ts") &&
      /restyLogin|restyRegister|from ["']@\/lib\/resty-auth["']/.test(fs.readFileSync(f, "utf8")),
  )
  const restyFetch = /\/api\/resty\/auth|restyAuthFetch/.test(authText)
  const mockAuth = /mock-jwt|MOCK_USERS|mockUsers\.find|mock-token|caffe-critic-user/i.test(authText) &&
    !wired && !restyFetch
  const mockCredits = /mockBalance|mockCredits|Mock 데이터 - 실제 API/i.test(text)
  const mockData = /mockCompanies|mockReviews|mockTrending|const mock/i.test(text)
  const legacyAuth = /\/api\/auth\/(login|signup)/.test(text) && !restyFetch

  const posts = /\/api\/posts/.test(text)
  const company = /\/api\/resty_company/.test(text)
  const credits = /\/api\/resty\/credits|restyGetCreditBalance|getBalance\(/.test(text)
  const hasSignup = /signup|register|회원가입/i.test(text)
  const hasCreditsUi = /credits|크레딧/i.test(text)
  const hasSitemap = fs.existsSync(path.join(WORKDIR, tenant, "app/sitemap.ts"))

  let authStatus = "없음"
  if (mockAuth) authStatus = "❌ Mock"
  else if (wired) authStatus = "✅ resty-auth lib"
  else if (restyFetch) authStatus = "🔶 fetch 직접"
  else if (legacyAuth) authStatus = "⚠️ 로컬 /api/auth"
  else if (hasSignup) authStatus = "⚠️ 미연동"

  const dataApis = []
  if (posts) dataApis.push("posts")
  if (company) dataApis.push("company")
  if (credits) dataApis.push("credits")

  const gaps = []
  if (mockAuth) gaps.push("인증 Mock → play.restyart.com /api/resty/auth 연동")
  if (legacyAuth) gaps.push("로컬 /api/auth → resty-auth 마이그레이션")
  if (hasSignup && !wired && !restyFetch) gaps.push("회원가입 UI 있으나 Resty 계정 API 미연동")
  if (mockCredits) gaps.push("크레딧 Mock → /api/resty/credits 연동")
  if (mockData) gaps.push("목업 비즈니스 데이터 → 실 API 또는 DB 연동")
  if (hasCreditsUi && !credits) gaps.push("크레딧 UI 있으나 결제 API 미연동")
  if (!hasSitemap) gaps.push("sitemap.ts 없음 (SEO)")
  if (!posts && !company && /write|create|post|review|blog/i.test(text))
    gaps.push("콘텐츠 작성 UI 있으나 posts API 미연동")

  return { authStatus, dataApis, gaps, wired, mockAuth, mockCredits, mockData, hasSignup, hasCreditsUi, hasSitemap }
}

function featureSummary(routes) {
  const publicRoutes = routes.filter(
    (r) => !r.startsWith("/api") && !r.includes("[") && !["/monitor", "/test"].includes(r),
  )
  const categories = {
    auth: publicRoutes.filter((r) => /auth|login|signup|register/i.test(r)),
    content: publicRoutes.filter((r) => /post|blog|write|create|review|article|book/i.test(r)),
    dashboard: publicRoutes.filter((r) => /dashboard|profile|settings/i.test(r)),
    legal: publicRoutes.filter((r) => /privacy|terms/i.test(r)),
    credits: publicRoutes.filter((r) => /credit|billing|pricing/i.test(r)),
  }
  return { publicRoutes, categories }
}

function generateMd(tenant) {
  const root = path.join(WORKDIR, tenant)
  const appDir = path.join(root, "app")
  if (!fs.existsSync(appDir)) return null

  const files = walk(root, [], (f) => /\.(ts|tsx|js|jsx)$/.test(f))
  const text = files.map((f) => fs.readFileSync(f, "utf8")).join("\n")
  const routes = collectRoutes(appDir)
  const api = analyzeApi(tenant, files, text)
  const { publicRoutes, categories } = featureSummary(routes)
  const mon = MONETIZATION[tenant] || MONETIZATION.default
  const url = tenant === "trips" ? "https://trips.co.kr" : `https://${tenant}.restyart.com`
  const published = fs.existsSync(path.join(WORKDIR, "common/public", tenant, "index.html"))

  const lines = [
    `# ${tenant}`,
    "",
    `> 자동 생성: ${new Date().toISOString().slice(0, 10)} | URL: ${url}`,
    "",
    "## 개요",
    "",
    `${tenant} 테넌트 Next.js 앱. 공개 경로 ${publicRoutes.length}개, 전체 라우트 ${routes.length}개.`,
    published ? "프로덕션 게이트웨이에 배포됨." : "미배포 또는 빌드 필요.",
    "",
    "## 주요 기능",
    "",
  ]

  if (categories.content.length) lines.push(`- **콘텐츠**: ${categories.content.join(", ")}`)
  if (categories.auth.length) lines.push(`- **인증**: ${categories.auth.join(", ")}`)
  if (categories.dashboard.length) lines.push(`- **사용자**: ${categories.dashboard.join(", ")}`)
  if (categories.credits.length) lines.push(`- **결제/크레딧**: ${categories.credits.join(", ")}`)
  if (categories.legal.length) lines.push(`- **약관**: ${categories.legal.join(", ")}`)

  const other = publicRoutes.filter(
    (r) => !Object.values(categories).flat().includes(r) && r !== "/",
  )
  if (other.length) lines.push(`- **기타**: ${other.slice(0, 12).join(", ")}${other.length > 12 ? "…" : ""}`)

  lines.push(
    "",
    "## API 연동 현황",
    "",
    "| 항목 | 상태 |",
    "|------|------|",
    `| 인증 (resty_users) | ${api.authStatus} |`,
    `| 데이터 API | ${api.dataApis.length ? api.dataApis.join(", ") : "없음"} |`,
    `| sitemap | ${api.hasSitemap ? "✅" : "❌"} |`,
    "",
    "## 유료화 가능성",
    "",
    `| 항목 | 내용 |`,
    `|------|------|`,
    `| 잠재력 | **${mon.potential}** |`,
    `| 모델 | ${mon.model} |`,
    `| 근거 | ${mon.note} |`,
    "",
    "## 미흡한 점 / 개선 우선순위",
    "",
  )

  if (api.gaps.length) {
    api.gaps.forEach((g, i) => lines.push(`${i + 1}. ${g}`))
  } else {
    lines.push("- 현재 코드 기준 치명적 Mock 없음. 라이브 검증 및 UX polish 권장.")
  }

  lines.push(
    "",
    "## 공개 페이지 목록",
    "",
    publicRoutes.map((r) => `- \`${r}\``).join("\n"),
    "",
    "## 연동 체크리스트",
    "",
    "- [ ] `restyLogin` / `restyRegister` (`@/lib/resty-auth`)",
    "- [ ] 크레딧 API (`/api/resty/credits/*`)",
    "- [ ] 콘텐츠 API (`/api/posts` 또는 도메인 API)",
    "- [ ] 약관/개인정보 페이지",
    "- [ ] sitemap.xml + robots.txt",
    "- [ ] `publish.sh` 배포",
    "",
  )

  return lines.join("\n")
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"))
  let tenants = args.length
    ? args
    : fs.readdirSync(WORKDIR).filter((n) => {
        if (SKIP.has(n) || n.startsWith(".")) return false
        return fs.existsSync(path.join(WORKDIR, n, "app"))
      })

  let written = 0
  const summary = { mock: [], partial: [], ok: [], noAuth: [] }

  for (const tenant of tenants.sort()) {
    const md = generateMd(tenant)
    if (!md) continue
    const out = path.join(WORKDIR, tenant, "PROJECT.md")
    fs.writeFileSync(out, md)
    written++
    const api = analyzeApi(tenant, walk(path.join(WORKDIR, tenant), [], (f) => /\.(ts|tsx)$/.test(f)), fs.readFileSync(out, "utf8"))
    if (api.mockAuth || api.mockCredits) summary.mock.push(tenant)
    else if (api.authStatus.includes("미연동") || api.authStatus.includes("로컬")) summary.partial.push(tenant)
    else if (api.authStatus === "없음") summary.noAuth.push(tenant)
    else summary.ok.push(tenant)
  }

  console.log(`PROJECT.md 생성: ${written}개`)
  console.log(`Mock 잔존: ${summary.mock.join(", ") || "없음"}`)
  console.log(`인증 미완: ${summary.partial.join(", ") || "없음"}`)
}

main()
