/**
 * 서비스 자체 footer가 있는 테넌트 감지 (RestyartLegalBar 미사용)
 * publish.sh · inject-legal · tenant-proxy 에서 공통 사용
 */
const fs = require('fs')
const path = require('path')

const WORKDIR = path.join(__dirname, '..')

/** 독립 사이트 — 리스티아트 legal bar 전혀 미주입 */
const LEGAL_SKIP_TENANTS = new Set(['wookwang', 'portfolio', 'goodprice', 'clef'])

function layoutHasTenantFooter(content) {
  return (
    /<Footer[\s/>]/.test(content) ||
    /ClassicaFooter/.test(content) ||
    /from\s+["']@\/components\/[^"']*[Ff]ooter[^"']*["']/.test(content) ||
    /ConditionalFooter/.test(content) ||
    /<footer\b/i.test(content)
  )
}

function findFooterFiles(tenantDir) {
  const candidates = [
    'components/footer.tsx',
    'components/Footer.tsx',
    'components/classica-footer.tsx',
    'app/components/footer.tsx',
    'app/components/Footer.tsx',
  ]
  const seen = new Set()
  const out = []
  for (const rel of candidates) {
    const p = path.join(tenantDir, rel)
    if (!fs.existsSync(p)) continue
    const real = fs.realpathSync(p)
    if (seen.has(real)) continue
    seen.add(real)
    out.push(p)
  }
  for (const sub of ['components', 'app/components']) {
    const dir = path.join(tenantDir, sub)
    if (!fs.existsSync(dir)) continue
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isFile() || !/footer/i.test(ent.name) || !ent.name.endsWith('.tsx')) continue
      const p = path.join(dir, ent.name)
      const real = fs.realpathSync(p)
      if (seen.has(real)) continue
      seen.add(real)
      out.push(p)
    }
  }
  return out
}

function tenantUsesServiceFooter(name) {
  if (!name || LEGAL_SKIP_TENANTS.has(name)) return false
  const tenantDir = path.join(WORKDIR, name)
  if (!fs.existsSync(tenantDir)) return false

  const layoutPath = path.join(tenantDir, 'app/layout.tsx')
  if (!fs.existsSync(layoutPath)) return false

  const layout = fs.readFileSync(layoutPath, 'utf8')
  if (/RestyartLegalBar/.test(layout)) return false

  if (layoutHasTenantFooter(layout)) return true
  if (findFooterFiles(tenantDir).length > 0) return true

  const clientLayout = path.join(tenantDir, 'app/ClientLayout.tsx')
  if (fs.existsSync(clientLayout) && /<footer\b/i.test(fs.readFileSync(clientLayout, 'utf8'))) {
    return true
  }
  return false
}

module.exports = {
  LEGAL_SKIP_TENANTS,
  tenantUsesServiceFooter,
}
