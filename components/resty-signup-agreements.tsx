import Link from "next/link"
import { RESTYART_COMPANY } from "@/components/restyart-legal-bar"

export interface RestySignupAgreementsProps {
  terms: boolean
  privacy: boolean
  age14?: boolean
  marketing?: boolean
  nightMarketing?: boolean
  onTermsChange: (checked: boolean) => void
  onPrivacyChange: (checked: boolean) => void
  onAge14Change?: (checked: boolean) => void
  onMarketingChange?: (checked: boolean) => void
  onNightMarketingChange?: (checked: boolean) => void
  disabled?: boolean
  termsError?: string
  privacyError?: string
  age14Error?: string
  linkClassName?: string
  privacyHref?: string
}

/** 회원가입 필수 약관 동의 — /terms, /privacy 링크 */
export function RestySignupAgreements({
  terms,
  privacy,
  age14 = false,
  marketing = false,
  nightMarketing = false,
  onTermsChange,
  onPrivacyChange,
  onAge14Change,
  onMarketingChange,
  onNightMarketingChange,
  disabled,
  termsError,
  privacyError,
  age14Error,
  linkClassName = "text-blue-600 hover:underline",
  privacyHref = "/privacy",
}: RestySignupAgreementsProps) {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-xs text-muted-foreground">
        리스티아트 통합 계정으로 가입되며, 동일 이메일은 서비스(테넌트)별로 별도 관리됩니다. 만 14세 미만은
        가입할 수 없습니다.
      </p>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 rounded border-gray-300"
          checked={terms}
          onChange={(e) => onTermsChange(e.target.checked)}
          disabled={disabled}
        />
        <span>
          <Link href="/terms" className={linkClassName} target="_blank" rel="noopener noreferrer">
            이용약관
          </Link>
          에 동의합니다 (필수)
        </span>
      </label>
      {termsError && <p className="text-destructive text-xs">{termsError}</p>}

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 rounded border-gray-300"
          checked={privacy}
          onChange={(e) => onPrivacyChange(e.target.checked)}
          disabled={disabled}
        />
        <span>
          <Link href={privacyHref} className={linkClassName} target="_blank" rel="noopener noreferrer">
            개인정보처리방침
          </Link>
          에 동의합니다 (필수)
        </span>
      </label>
      {privacyError && <p className="text-destructive text-xs">{privacyError}</p>}

      {onAge14Change && (
        <>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 rounded border-gray-300"
              checked={age14}
              onChange={(e) => onAge14Change(e.target.checked)}
              disabled={disabled}
            />
            <span>만 14세 이상입니다 (필수)</span>
          </label>
          {age14Error && <p className="text-destructive text-xs">{age14Error}</p>}
        </>
      )}

      {onMarketingChange && (
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300"
            checked={marketing}
            onChange={(e) => onMarketingChange(e.target.checked)}
            disabled={disabled}
          />
          <span>
            이메일·문자 등 광고성 정보 수신에 동의합니다 (선택). 동의하지 않아도 서비스 이용이 가능합니다.
          </span>
        </label>
      )}

      {onNightMarketingChange && marketing && (
        <label className="flex items-start gap-2 cursor-pointer ml-4">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300"
            checked={nightMarketing}
            onChange={(e) => onNightMarketingChange(e.target.checked)}
            disabled={disabled}
          />
          <span>야간(21:00~08:00) 광고성 정보 수신에 동의합니다 (선택)</span>
        </label>
      )}

      <p className="text-[11px] text-muted-foreground pt-1 border-t">
        운영자: {RESTYART_COMPANY.name} · 사업자등록번호 {RESTYART_COMPANY.businessNumber} · 문의{" "}
        <a href={`mailto:${RESTYART_COMPANY.email}`} className={linkClassName}>
          {RESTYART_COMPANY.email}
        </a>
      </p>
    </div>
  )
}
