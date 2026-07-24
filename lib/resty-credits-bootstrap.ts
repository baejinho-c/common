import { restyClaimSignupBonus, type SignupBonus } from "./resty-auth"

/** 가입/로그인 직후 크레딧 잔액 확정 — 보너스 누락 시 claim-signup-bonus로 복구 */
export async function resolveRestyCreditsAfterAuth(
  userId: string | number,
  fetchBalance: (id: string) => Promise<number>,
  options: { tenant: string; signupBonus?: SignupBonus | null },
): Promise<{ balance: number; signupBonusAmount?: number }> {
  const uid = String(userId)

  let balance = await fetchBalance(uid)
  let signupBonusAmount = options.signupBonus?.amount

  if (balance <= 0) {
    const claimed = await restyClaimSignupBonus({ tenant: options.tenant })
    if (claimed?.amount && claimed.amount > 0) {
      signupBonusAmount = claimed.amount
    }
    balance = await fetchBalance(uid)
  }

  return { balance, signupBonusAmount }
}

export async function ensureRestySignupBonusAmount(
  tenant: string,
  signupBonus?: SignupBonus | null,
): Promise<number | undefined> {
  if (signupBonus?.amount && signupBonus.amount > 0) return signupBonus.amount
  const claimed = await restyClaimSignupBonus({ tenant })
  if (claimed?.amount && claimed.amount > 0) return claimed.amount
  return undefined
}
