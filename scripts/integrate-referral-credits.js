#!/usr/bin/env node
/**
 * 추천·쿠폰 공통 모듈을 크레딧 테넌트에 복사
 * Usage: node common/scripts/integrate-referral-credits.js [tenant ...]
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const COMMON = path.join(ROOT, 'common')

const CREDIT_TENANTS = [
  'appicon',
  'seo-copilot',
  'logo',
  'arc',
  'career',
  'resume',
  'healing',
  'qbank',
]

const FILES = [
  ['lib/referral-storage.ts', 'lib/referral-storage.ts'],
  ['lib/resty-referrals.ts', 'lib/resty-referrals.ts'],
  ['lib/resty-coupons.ts', 'lib/resty-coupons.ts'],
  ['components/resty-referral-panel.tsx', 'components/resty-referral-panel.tsx'],
  ['components/resty-referral-capture.tsx', 'components/resty-referral-capture.tsx'],
  ['components/resty-charge-gate.tsx', 'components/resty-charge-gate.tsx'],
  ['components/resty-coupon-redeem.tsx', 'components/resty-coupon-redeem.tsx'],
  ['components/resty-coupon-admin.tsx', 'components/resty-coupon-admin.tsx'],
]

function copyToTenant(slug) {
  const destRoot = path.join(ROOT, slug)
  if (!fs.existsSync(destRoot)) {
    console.warn(`[skip] ${slug}: folder not found`)
    return false
  }
  let n = 0
  for (const [srcRel, destRel] of FILES) {
    const src = path.join(COMMON, srcRel)
    const dest = path.join(destRoot, destRel)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    n += 1
  }
  console.log(`[${slug}] copied ${n} referral/coupon files`)
  return true
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : CREDIT_TENANTS
for (const slug of targets) copyToTenant(slug)

// patch common resty-auth referralCode if missing in tenant copy
const authPatchNote = `
// restyRegister: referralCode 지원 — common/lib/resty-auth.ts 와 동기화하세요.
`
console.log(authPatchNote.trim())
console.log('Done.')
