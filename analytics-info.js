/** 리스티아트 통합 Google Analytics 4 */
const GA_MEASUREMENT_ID = 'G-YVK657S8Q4'

const WRONG_IDS = ['G-YVK657S8Q4GA', 'GA_MEASUREMENT_ID', 'G-XXXXXXXXXX', 'G-XXXXXXXX']

function normalizeAnalyticsHtml(html) {
  if (!html) return html
  let next = html
  for (const wrong of WRONG_IDS) {
    next = next.split(wrong).join(GA_MEASUREMENT_ID)
  }
  return next
}

function hasValidAnalytics(html) {
  if (!html) return false
  return html.includes('googletagmanager.com/gtag/js') && html.includes(GA_MEASUREMENT_ID)
}

function analyticsSnippet(tenant) {
  const tenantLine = tenant
    ? `\n    gtag('set', 'user_properties', { resty_tenant: '${String(tenant).replace(/'/g, '')}' });`
    : ''
  return `
<script data-resty-analytics>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });${tenantLine}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
`
}

/** HTML에 통합 GA 스니펫 주입 (없을 때만) + 잘못된 ID 교정 */
function injectAnalyticsHtml(html, tenant) {
  if (!html) return html
  html = normalizeAnalyticsHtml(html)
  if (hasValidAnalytics(html)) return html
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, analyticsSnippet(tenant) + '</head>')
  }
  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/<body([^>]*)>/i, `<body$1>${analyticsSnippet(tenant)}`)
  }
  return analyticsSnippet(tenant) + html
}

module.exports = {
  GA_MEASUREMENT_ID,
  WRONG_IDS,
  normalizeAnalyticsHtml,
  hasValidAnalytics,
  injectAnalyticsHtml,
}
