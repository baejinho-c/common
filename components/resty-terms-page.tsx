import Link from "next/link"
import { RESTYART_COMPANY, RESTYART_AI_DISCLOSURE } from "@/components/restyart-legal-bar"
import { AI_BASIC_LAW_COMMON, AI_LEGAL_APPENDIX } from "@/lib/ai-basic-law"

export interface RestyTermsPageProps {
  serviceName?: string
  tenantSlug?: string
}

export function RestyTermsPage({
  serviceName = "본 서비스",
  tenantSlug,
}: RestyTermsPageProps) {
  const c = RESTYART_COMPANY
  const effectiveDate = "2026년 7월 22일"
  const slug =
    tenantSlug ||
    (typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_TENANT || process.env.NEXT_PUBLIC_SUBDOMAIN || ""
      : "")
  const appendix = slug ? AI_LEGAL_APPENDIX[slug] : undefined

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
          본 약관은 {c.name}(이하 &quot;회사&quot;)이 제공하는 {serviceName}(이하 &quot;서비스&quot;)의
          이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <h2>제2조 (회원가입 및 리스티아트 계정)</h2>
        <ul>
          <li>
            회원가입 시 이메일·비밀번호 등 정보를 제공하며, 서비스별 테넌트(subdomain) 단위로 계정이
            생성됩니다.
          </li>
          <li>동일 이메일이라도 서비스마다 별도 계정으로 관리될 수 있습니다.</li>
          <li>회원은 정확한 정보를 제공해야 하며, 타인의 정보를 도용해서는 안 됩니다.</li>
        </ul>

        <h2>제3조 (서비스의 제공)</h2>
        <p>회사는 콘텐츠 열람, 커뮤니티, AI 기능, 크레딧·유료 기능 등 서비스를 제공합니다.</p>
        <p className="text-sm bg-muted p-3 rounded-md">{RESTYART_AI_DISCLOSURE}</p>

        <h2>제4조 (AI 서비스 — AI 기본법)</h2>
        <p className="text-sm">{AI_BASIC_LAW_COMMON.effectiveNote}</p>
        <ul>
          <li>{AI_BASIC_LAW_COMMON.generativeLabel}</li>
          <li>
            AI 결과는 환각·오류·편향이 있을 수 있으며, 회사는 특정 결과의 정확성·완전성을 보장하지
            않습니다.
          </li>
          <li>
            이용자는 AI 결과를 의료 진단, 채용·인사 최종 결정, 공식 시험·성적 평가, 법률·투자 자문 등
            중대한 의사결정의 유일한 근거로 사용해서는 안 됩니다.
          </li>
          <li>회사는 서비스 안정·보안을 위해 모델을 변경하거나 AI 기능을 제한·중단할 수 있습니다.</li>
        </ul>
        {appendix ? (
          <div className="not-prose mt-4 rounded-lg border p-4 text-sm">
            <p className="font-semibold mb-2">【별표】 {serviceName} AI 이용 조건</p>
            <p className="mb-2">{appendix.highImpactNote}</p>
            <ul className="list-disc pl-5 space-y-1">
              {appendix.humanReviewAndLimits.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <h2>제5조 (회사 정보)</h2>
        <ul>
          <li>상호: {c.name}</li>
          <li>사업자등록번호: {c.businessNumber}</li>
          <li>통신판매업신고: {c.mailOrderNumber}</li>
          <li>주소: {c.address}</li>
          <li>문의: {c.email}</li>
        </ul>

        <h2>제6조 (준거법)</h2>
        <p>
          본 약관은 대한민국 법률을 준거법으로 하며, AI 관련 사항은 AI 기본법 및 관련 시행령·고시를
          참고합니다.
        </p>

        <p className="text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} {c.name}
        </p>
      </div>
    </div>
  )
}
