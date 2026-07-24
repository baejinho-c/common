import {
  RESTYART_COMPANY,
  RESTYART_AI_DISCLOSURE,
  formatPrivacyOfficer,
} from "@/components/restyart-legal-bar"
import { AI_BASIC_LAW_COMMON, AI_LEGAL_APPENDIX } from "@/lib/ai-basic-law"

export interface RestyPrivacyPageProps {
  serviceName?: string
  /** 테넌트 slug — P0 별표 표시용 (mind, resume, …) */
  tenantSlug?: string
}

export function RestyPrivacyPage({
  serviceName = "본 서비스",
  tenantSlug,
}: RestyPrivacyPageProps) {
  const c = RESTYART_COMPANY
  const effectiveDate = "2026년 7월 22일"
  const slug =
    tenantSlug ||
    (typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_TENANT || process.env.NEXT_PUBLIC_SUBDOMAIN || ""
      : "")
  const appendix = slug ? AI_LEGAL_APPENDIX[slug] : undefined

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl prose prose-sm sm:prose">
      <h1>개인정보처리방침</h1>
      <p className="text-muted-foreground">
        {serviceName} · {c.name} · 시행일 {effectiveDate}
      </p>

      <h2>1. 수집하는 개인정보</h2>
      <ul>
        <li>필수: 이메일, 비밀번호(암호화 저장), 서비스 이용 기록</li>
        <li>선택: 이름, 전화번호, 프로필 이미지, 마케팅 수신 동의 여부</li>
        <li>자동: 접속 IP, 쿠키, 기기·브라우저 정보, 이용 로그</li>
        <li>
          위치정보: 위치 기반 기능을 이용하는 서비스(today, sports 등)에서만, 이용 시점에 브라우저/앱 권한
          동의 후 수집
        </li>
        {appendix?.outboundData?.length ? (
          <li>
            AI 기능 이용 시: {appendix.outboundData.join(", ")} (해당 기능 사용 시에만)
          </li>
        ) : null}
      </ul>
      <p className="text-sm">
        주민등록번호 등 고유식별정보는 원칙적으로 수집하지 않습니다. (레거시 sports 연동 API는 단계적
        폐지 예정)
      </p>

      <h2>2. 만 14세 미만 아동</h2>
      <p>
        {serviceName}은 만 14세 미만 아동의 회원가입을 원칙적으로 받지 않습니다. 법정대리인 동의가 필요한
        경우 별도 절차를 안내합니다.
      </p>
      {appendix?.extras?.map((line) => (
        <p key={line} className="text-sm">
          {line}
        </p>
      ))}

      <h2>3. 이용 목적</h2>
      <ul>
        <li>회원 식별·가입·로그인 및 리스티아트 통합 계정 관리</li>
        <li>서비스 제공, AI 기능 제공, 고객 문의 응대, 부정 이용 방지</li>
        <li>마케팅 정보 제공(별도 동의 시), 야간 수신(별도 동의 시)</li>
      </ul>

      <h2>4. AI 이용 안내 (AI 기본법)</h2>
      <p className="text-sm">{AI_BASIC_LAW_COMMON.effectiveNote}</p>
      <p className="text-sm bg-muted p-3 rounded-md">{RESTYART_AI_DISCLOSURE}</p>
      <ul>
        <li>{AI_BASIC_LAW_COMMON.generativeLabel}</li>
        <li>{AI_BASIC_LAW_COMMON.noTrainingGuarantee}</li>
        <li>{AI_BASIC_LAW_COMMON.logging}</li>
      </ul>
      {appendix ? (
        <div className="not-prose mt-4 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p className="font-semibold mb-2">【별표】 {serviceName} AI·개인정보 특화 안내</p>
          <p className="font-medium mb-1">AI 기능</p>
          <ul className="list-disc pl-5 mb-3 space-y-0.5">
            {appendix.aiFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="font-medium mb-1">외부 AI로 전송될 수 있는 정보</p>
          <ul className="list-disc pl-5 mb-3 space-y-0.5">
            {appendix.outboundData.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mb-2">{appendix.highImpactNote}</p>
          <p className="font-medium mb-1">이용 시 유의사항</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {appendix.humanReviewAndLimits.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <h2>5. 보유 및 파기</h2>
      <ul>
        <li>회원 탈퇴 시 지체 없이 개인정보를 삭제합니다.</li>
        <li>
          전자상거래 등 관련 법령에 따라 보존이 필요한 경우(계약·결제·분쟁 기록 등) 해당 기간 동안
          분리 보관합니다.
        </li>
        <li>크레딧 충전·사용 내역은 서비스 운영 및 분쟁 대응을 위해 일정 기간 보관될 수 있습니다.</li>
        <li>AI 관련 로그는 목적 달성 또는 관련 법령에 따른 기간 동안 보관될 수 있습니다.</li>
      </ul>

      <h2>6. 개인정보 처리위탁</h2>
      <p>서비스 운영을 위해 아래 업체에 업무를 위탁할 수 있습니다.</p>
      <ul>
        <li>클라우드·호스팅: AWS 등 (인프라)</li>
        <li>문자 발송: Solapi (인증·알림 SMS)</li>
        <li>이메일 발송: Resend 등 (비밀번호 재설정·알림)</li>
        <li>AI API: OpenAI, Google(Gemini) 등 (생성·분석 기능)</li>
        <li>결제(PG): {c.pgProvider || "[도입 시 고지]"} (유료 크레딧·결제 도입 시)</li>
      </ul>

      <h2>7. 국외 이전</h2>
      <p>
        OpenAI, Google(Gemini), Supabase, Google Analytics 등 해외 사업자의 API·분석 도구를 사용할 수
        있으며, AI 기능 이용 시 입력·출력 데이터가 해당 국가의 서버로 전송될 수 있습니다. 전송 항목은
        서비스 제공에 필요한 범위로 한정하며, 목적·보유는 각 수탁사 정책 및 계약을 따릅니다.
      </p>

      <h2>8. 이용자 권리</h2>
      <ul>
        <li>개인정보 열람·정정·삭제·처리정지 요청: {c.email}</li>
        <li>회원 탈퇴: 서비스 내 계정 설정 또는 고객센터 요청</li>
        <li>마케팅 수신 거부: 수신 동의 철회 또는 고객센터</li>
      </ul>

      <h2>9. 결제·구독 안내</h2>
      <p>
        현재 대부분의 서비스는 크레딧 기반 이용이며, 무료 체험(게스트 할당·가입 보너스) 후 자동 유료
        전환(자동결제)은 기본 제공하지 않습니다. 유료 구독·자동갱신 상품을 도입하는 경우 가격·갱신
        주기·해지 방법을 별도 고지합니다.
      </p>

      <h2>10. 개인정보 보호책임자</h2>
      <ul>
        <li>회사명: {c.name}</li>
        <li>주소: {c.address}</li>
        <li>연락처: {c.email}</li>
        <li>개인정보 보호책임자: {formatPrivacyOfficer(c)}</li>
      </ul>

      <p className="text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} {c.name}
      </p>
    </div>
  )
}
