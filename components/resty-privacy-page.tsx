import { RESTYART_COMPANY, RESTYART_AI_DISCLOSURE } from "@/components/restyart-legal-bar"

export interface RestyPrivacyPageProps {
  serviceName?: string
}

export function RestyPrivacyPage({ serviceName = "본 서비스" }: RestyPrivacyPageProps) {
  const c = RESTYART_COMPANY
  const effectiveDate = "2025년 1월 1일"

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl prose prose-sm sm:prose">
      <h1>개인정보처리방침</h1>
      <p className="text-muted-foreground">
        {serviceName} · {c.name} · 시행일 {effectiveDate}
      </p>

      <h2>1. 수집하는 개인정보</h2>
      <ul>
        <li>필수: 이메일, 비밀번호(암호화 저장), 서비스 이용 기록</li>
        <li>선택: 이름, 전화번호, 프로필 이미지</li>
        <li>자동: 접속 IP, 쿠키, 기기 정보</li>
      </ul>

      <h2>2. 이용 목적</h2>
      <ul>
        <li>회원 식별·가입·로그인 및 리스티아트 통합 계정 관리</li>
        <li>서비스 제공, 고객 문의 응대, 부정 이용 방지</li>
      </ul>

      <h2>3. AI 이용 안내</h2>
      <p className="text-sm bg-muted p-3 rounded-md">{RESTYART_AI_DISCLOSURE}</p>

      <h2>4. 개인정보 보호책임자</h2>
      <ul>
        <li>회사명: {c.name}</li>
        <li>연락처: {c.email}</li>
        <li>주소: {c.address}</li>
      </ul>

      <p className="text-xs text-muted-foreground mt-8">© {new Date().getFullYear()} {c.name}</p>
    </div>
  )
}
