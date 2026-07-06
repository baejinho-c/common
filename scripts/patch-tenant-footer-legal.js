#!/usr/bin/env node
/**
 * 서비스별 footer가 있는 테넌트:
 * - layout에서 RestyartLegalBar 제거 (중복 푸터 방지)
 * - footer에 AI 이용 안내 + 회사명(리스티아트) 반영
 *
 * Usage: node common/scripts/patch-tenant-footer-legal.js [--tenant=light]
 */
const fs = require('fs')
const path = require('path')

const WORKDIR = path.join(__dirname, '../..')
const AI_IMPORT =
  'import { RESTYART_AI_DISCLOSURE, RestyartAiDisclosure } from "@/components/restyart-legal-bar"'
const AI_SNIPPET = '        <RestyartAiDisclosure />'
const COMPANY = '리스티아트'

const tenantArg = process.argv.find((a) => a.startsWith('--tenant='))
const onlyTenant = tenantArg ? tenantArg.split('=')[1] : null

function layoutHasTenantFooter(content) {
  return (
    /<Footer[\s/>]/.test(content) ||
    /from\s+["']@\/components\/[Ff]ooter["']/.test(content) ||
    /ConditionalFooter/.test(content) ||
    /<footer\b/i.test(content)
  )
}

function removeLegalBarFromLayout(content) {
  let next = content
  next = next.replace(
    /\nimport\s+\{[^}]*\bRestyartLegalBar\b[^}]*\}\s+from\s+["']@\/components\/restyart-legal-bar["']/g,
    '',
  )
  next = next.replace(/\n\s*<RestyartLegalBar\s*\/>\s*/g, '\n')
  next = next.replace(/\n\s*<ConditionalLegalBar\s*\/>\s*/g, '\n')
  return next
}

function findFooterFiles(tenantDir) {
  const candidates = [
    'components/footer.tsx',
    'components/Footer.tsx',
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
  return out
}

function tenantHasServiceFooter(tenantDir, layoutContent) {
  if (layoutHasTenantFooter(layoutContent)) return true
  if (findFooterFiles(tenantDir).length > 0) return true
  const clientLayout = path.join(tenantDir, 'app/ClientLayout.tsx')
  if (fs.existsSync(clientLayout) && /<footer\b/i.test(fs.readFileSync(clientLayout, 'utf8'))) return true
  return false
}

function patchClientLayoutFooter(filePath) {
  if (!fs.existsSync(filePath)) return false
  return patchFooterFile(filePath)
}

function normalizeCompanyName(text) {
  let next = text
  next = next.replace(/©\s*(\d{4})\s+[^.<\n]+(?=\.\s*All rights reserved)/g, `© $1 ${COMPANY}`)
  next = next.replace(/&copy;\s*(\d{4})\s+[^.<\n]+(?=\.\s*All rights reserved)/g, `&copy; $1 ${COMPANY}`)
  next = next.replace(/\bRestyart\b/g, COMPANY)
  next = next.replace(/\bRESTYART\b/g, COMPANY)
  return next
}

function patchFooterFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content

  content = normalizeCompanyName(content)

  if (!content.includes('AI 이용 안내') && content.includes('</footer>')) {
    if (!content.includes('RestyartAiDisclosure')) {
      if (content.includes('from "@/components/restyart-legal-bar"')) {
        content = content.replace(
          /import\s+\{([^}]+)\}\s+from\s+["']@\/components\/restyart-legal-bar["']/,
          (m, inner) => {
            const names = new Set(
              inner
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
            names.add('RestyartAiDisclosure')
            return `import { ${[...names].join(', ')} } from "@/components/restyart-legal-bar"`
          },
        )
      } else {
        const lastImport = content.lastIndexOf('\nimport ')
        if (lastImport !== -1) {
          const lineEnd = content.indexOf('\n', lastImport + 1)
          content = content.slice(0, lineEnd + 1) + AI_IMPORT + '\n' + content.slice(lineEnd + 1)
        } else {
          content = AI_IMPORT + '\n' + content
        }
      }

      content = content.replace(/(\s*)<\/footer>/i, `$1${AI_SNIPPET}\n$1</footer>`)
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  return false
}

function patchConditionalFooter(tenantDir) {
  const filePath = path.join(tenantDir, 'components/conditional-footer.tsx')
  if (!fs.existsSync(filePath)) return false
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content
  content = content.replace(/\nimport\s+\{[^}]*RestyartLegalBar[^}]*\}\s+from[^\n]+\n/g, '\n')
  content = content.replace(/\nexport function ConditionalLegalBar\(\)[\s\S]*?\n\}\n/, '\n')
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  return false
}

function patchInlineLayoutFooter(layoutPath) {
  let content = fs.readFileSync(layoutPath, 'utf8')
  if (!/<footer\b/i.test(content) || content.includes('AI 이용 안내')) return false

  const disclosure = `
                <p className="mt-6 rounded-md border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-slate-400">
                  <span className="font-semibold text-slate-200">AI 이용 안내</span> — 본 서비스의 일부 콘텐츠·응답·추천·이미지 등은 인공지능(AI) 기술을 활용하여 생성될 수 있으며, AI 생성 결과는 참고용이며 정확성·완전성을 보장하지 않습니다.
                </p>`

  let next = normalizeCompanyName(content)
  next = next.replace(/(\s*)<\/footer>/i, `${disclosure}\n$1</footer>`)
  if (next !== content) {
    fs.writeFileSync(layoutPath, next, 'utf8')
    return true
  }
  return false
}

let layoutPatched = 0
let footerPatched = 0
let inlinePatched = 0

for (const name of fs.readdirSync(WORKDIR)) {
  if (onlyTenant && name !== onlyTenant) continue
  if (name === 'common' || name.startsWith('.')) continue
  const tenantDir = path.join(WORKDIR, name)
  if (!fs.statSync(tenantDir).isDirectory()) continue

  const layoutPath = path.join(tenantDir, 'app/layout.tsx')
  if (!fs.existsSync(layoutPath)) continue

  const layout = fs.readFileSync(layoutPath, 'utf8')
  if (!tenantHasServiceFooter(tenantDir, layout)) continue

  const nextLayout = removeLegalBarFromLayout(layout)
  if (nextLayout !== layout) {
    fs.writeFileSync(layoutPath, nextLayout, 'utf8')
    layoutPatched += 1
    console.log('[layout]', name, '— removed RestyartLegalBar')
  }

  if (patchConditionalFooter(tenantDir)) {
    console.log('[conditional-footer]', name)
  }

  if (/<footer\b/i.test(layout) && !layout.includes('Footer')) {
    if (patchInlineLayoutFooter(layoutPath)) {
      inlinePatched += 1
      console.log('[inline-footer]', name)
    }
  }

  for (const footerPath of findFooterFiles(tenantDir)) {
    if (patchFooterFile(footerPath)) {
      footerPatched += 1
      console.log('[footer]', name, path.relative(tenantDir, footerPath))
    }
  }

  const clientLayout = path.join(tenantDir, 'app/ClientLayout.tsx')
  if (patchClientLayoutFooter(clientLayout)) {
    footerPatched += 1
    console.log('[client-layout-footer]', name)
  }
}

// sync RestyartAiDisclosure to all tenant copies
const src = path.join(WORKDIR, 'common/components/restyart-legal-bar.tsx')
for (const name of fs.readdirSync(WORKDIR)) {
  if (onlyTenant && name !== onlyTenant) continue
  if (name === 'common' || name.startsWith('.')) continue
  const comp = path.join(WORKDIR, name, 'components/restyart-legal-bar.tsx')
  if (fs.existsSync(path.dirname(comp))) {
    fs.copyFileSync(src, comp)
  }
}

console.log(
  `[patch-footer-legal] layouts: ${layoutPatched}, footers: ${footerPatched}, inline: ${inlinePatched}`,
)
