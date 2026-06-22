/** 리스티아트 공통 사업자·AI 표기 — common/legal-info.js 와 동기화 */
export const RESTYART_COMPANY = {
  name: "리스티아트",
  businessNumber: "3961701077",
  address: "경기도 성남시 분당구 대왕판교로 645번길 12, 7·9층 145호",
  mailOrderNumber: "2022-성남분당C-0670",
  email: "support@restyart.com",
} as const

export const RESTYART_AI_DISCLOSURE =
  "본 서비스의 일부 콘텐츠·응답·추천·이미지 등은 인공지능(AI) 기술을 활용하여 생성될 수 있으며, " +
  "AI 생성 결과는 참고용이며 정확성·완전성을 보장하지 않습니다."

export function RestyartLegalBar() {
  const c = RESTYART_COMPANY
  return (
    <div
      data-resty-legal="1"
      className="mt-auto border-t border-gray-200 bg-gray-50 text-gray-600 text-xs leading-relaxed"
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <p className="font-semibold text-gray-700 mb-2">{c.name}</p>
        <p className="mb-1">
          사업자등록번호 {c.businessNumber} · 통신판매업신고 {c.mailOrderNumber}
        </p>
        <p className="mb-1">{c.address}</p>
        <p className="mb-3">
          문의:{" "}
          <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">
            {c.email}
          </a>
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
