/** 리스티아트 공통 사업자·AI 표기 (단일 출처) */
const COMPANY = {
  name: '리스티아트',
  businessNumber: '3961701077',
  address: '경기도 성남시 분당구 대왕판교로 645번길 12, 7·9층 145호',
  mailOrderNumber: '2022-성남분당C-0670',
  email: 'support@restyart.com',
}

const AI_DISCLOSURE =
  '본 서비스의 일부 콘텐츠·응답·추천·이미지 등은 인공지능(AI) 기술을 활용하여 생성될 수 있으며, ' +
  'AI 생성 결과는 참고용이며 정확성·완전성을 보장하지 않습니다.'

const MARKER = 'data-resty-legal'

function buildLegalFooterHtml() {
  return `
<div id="restyart-legal-bar" ${MARKER}="1" style="margin-top:auto;border-top:1px solid #e5e7eb;background:#f9fafb;color:#4b5563;font-size:12px;line-height:1.6;">
  <div style="max-width:1200px;margin:0 auto;padding:16px 20px;">
    <p style="margin:0 0 8px;font-weight:600;color:#374151;">${COMPANY.name}</p>
    <p style="margin:0 0 4px;">사업자등록번호 ${COMPANY.businessNumber} · 통신판매업신고 ${COMPANY.mailOrderNumber}</p>
    <p style="margin:0 0 4px;">${COMPANY.address}</p>
    <p style="margin:0 0 8px;">문의: <a href="mailto:${COMPANY.email}" style="color:#2563eb;text-decoration:none;">${COMPANY.email}</a></p>
    <p style="margin:0;padding:10px 12px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;color:#6b7280;">
      <strong style="color:#374151;">AI 이용 안내</strong> — ${AI_DISCLOSURE}
    </p>
    <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">&copy; ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.</p>
  </div>
</div>`
}

function injectLegalHtml(html) {
  if (!html || html.includes(MARKER)) return html
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${buildLegalFooterHtml()}\n</body>`)
  }
  return html + buildLegalFooterHtml()
}

module.exports = {
  COMPANY,
  AI_DISCLOSURE,
  MARKER,
  buildLegalFooterHtml,
  injectLegalHtml,
}
