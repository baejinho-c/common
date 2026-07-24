export type RegisterConsentState = {
  terms: boolean
  privacy: boolean
  age14: boolean
}

export function validateRegisterConsent(
  consent: RegisterConsentState,
): { ok: true } | { ok: false; message: string } {
  if (!consent.terms || !consent.privacy || !consent.age14) {
    return { ok: false, message: "필수 약관 및 만 14세 이상 확인에 동의해 주세요." }
  }
  return { ok: true }
}
