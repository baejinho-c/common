import Link from "next/link"
import { RESTYART_COMPANY, RESTYART_AI_DISCLOSURE } from "@/components/restyart-legal-bar"

export interface RestyTermsPageProps {
  serviceName?: string
}

export function RestyTermsPage({ serviceName = "본 서비스" }: RestyTermsPageProps) {
  const c = RESTYART_COMPANY
  const effectiveDate = "2026년 6월 30일"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="text-sm font-medium hover:opacity-80 transition-opacity">
              홈으로 돌아가기
            </Link>
            <p className="text-xs text-muted-foreground">{serviceName}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl prose prose-sm sm:prose">
        <h1>이용약관</h1>
        <p className="text-muted-foreground">
          {serviceName}({c.name} 운영) · 시행일 {effectiveDate}
        </p>

        <h2>제1조 (목적)</h2>
        <p>
          본 약관은 {c.name}(이하 &quot;회사&quot;)이 제공하는 {serviceName}(이하 &quot;서비스&quot;)의 이용과
          관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <h2>제2조 (회원가입 및 리스티아트 계정)</h2>
        <ul>
          <li>회원가입 시 이메일·비밀번호 등 정보를 제공하며, 서비스별 테넌트(subdomain) 단위로 계정이 생성됩니다.</li>
          <li>동일 이메일이라도 서비스마다 별도 계정으로 관리될 수 있습니다.</li>
          <li>회원은 정확한 정보를 제공해야 하며, 타인의 정보를 도용해서는 안 됩니다.</li>
        </ul>

        <h2>제3조 (서비스의 제공)</h2>
        <p>회사는 콘텐츠 열람, 커뮤니티, 크레딧·유료 기능 등 서비스를 제공합니다.</p>
        <p className="text-sm bg-muted p-3 rounded-md">{RESTYART_AI_DISCLOSURE}</p>

        <h2>제4조 (회사 정보)</h2>
        <ul>
          <li>상호: {c.name}</li>
          <li>사업자등록번호: {c.businessNumber}</li>
          <li>통신판매업신고: {c.mailOrderNumber}</li>
          <li>주소: {c.address}</li>
          <li>문의: {c.email}</li>
        </ul>

        <p className="text-xs text-muted-foreground mt-8">© {new Date().getFullYear()} {c.name}</p>
      </div>
    </div>
  )
}
