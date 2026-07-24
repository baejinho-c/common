import Link from "next/link"
import company from "../legal-company.json"

/** 리스티아트 공통 사업자·AI 표기 — common/legal-company.json 과 동기화 */
export const RESTYART_COMPANY = company

export const RESTYART_AI_DISCLOSURE =
  "본 서비스의 일부 콘텐츠·응답·추천·이미지 등은 인공지능(AI) 기술을 활용하여 생성될 수 있으며, " +
  "AI 생성 결과는 참고용이며 정확성·완전성을 보장하지 않습니다."

export function formatPrivacyOfficer(
  c: Pick<
    typeof company,
    "privacyOfficerName" | "privacyOfficerTitle" | "privacyOfficerPhone" | "privacyOfficerEmail" | "email"
  > = company,
) {
  if (c.privacyOfficerName) {
    const title = c.privacyOfficerTitle ? ` (${c.privacyOfficerTitle})` : ""
    const phone = c.privacyOfficerPhone ? ` · ${c.privacyOfficerPhone}` : ""
    const email = c.privacyOfficerEmail || c.email
    return `${c.privacyOfficerName}${title} · ${email}${phone}`
  }
  return `[입력 필요] 운영팀 (${c.email})`
}

export function RestyartAiDisclosure({ className }: { className?: string }) {
  return (
    <p
      className={
        className ??
        "mt-4 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-500"
      }
    >
      <span className="font-semibold text-gray-700">AI 이용 안내</span> — {RESTYART_AI_DISCLOSURE}
    </p>
  )
}

export function RestyartLegalBar() {
  const c = RESTYART_COMPANY
  return (
    <div
      data-resty-legal="1"
      className="mt-auto border-t border-gray-200 bg-gray-50 text-gray-600 text-xs leading-relaxed"
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <p className="font-semibold text-gray-700 mb-2">{c.name}</p>
        <p className="mb-1">{c.address}</p>
        <p className="mb-1">사업자등록번호 {c.businessNumber}</p>
        <p className="mb-1 text-gray-500">개인정보 보호책임자: {formatPrivacyOfficer(c)}</p>
        <p className="mb-3">
          문의:{" "}
          <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">
            {c.email}
          </a>
          {" · "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            개인정보처리방침
          </Link>
          {" · "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            이용약관
          </Link>
        </p>
        <p className="p-3 bg-white border border-gray-200 rounded-md text-gray-500">
          <span className="font-semibold text-gray-700">AI 이용 안내</span> — {RESTYART_AI_DISCLOSURE}
        </p>
        <p className="mt-2 text-[11px] text-gray-400">
          &copy; {new Date().getFullYear()} {c.name}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
