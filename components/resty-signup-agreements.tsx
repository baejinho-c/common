import Link from "next/link"
import { RESTYART_COMPANY } from "@/components/restyart-legal-bar"

export interface RestySignupAgreementsProps {
  terms: boolean
  privacy: boolean
  marketing?: boolean
  onTermsChange: (checked: boolean) => void
  onPrivacyChange: (checked: boolean) => void
  onMarketingChange?: (checked: boolean) => void
  disabled?: boolean
  termsError?: string
  privacyError?: string
  linkClassName?: string
}

/** 회원가입 필수 약관 동의 — /terms, /privacy 링크 */
export function RestySignupAgreements({
  terms,
  privacy,
  marketing = false,
  onTermsChange,
  onPrivacyChange,
  onMarketingChange,
  disabled,
  termsError,
  privacyError,
  linkClassName = "text-blue-600 hover:underline",
}: RestySignupAgreementsProps) {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-xs text-muted-foreground">
        리스티아트 통합 계정으로 가입되며, 동일 이메일은 서비스(테넌트)별로 별도 관리됩니다.
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
          <Link href="/privacy" className={linkClassName} target="_blank" rel="noopener noreferrer">
            개인정보처리방침
          </Link>
          에 동의합니다 (필수)
        </span>
      </label>
      {privacyError && <p className="text-destructive text-xs">{privacyError}</p>}

      {onMarketingChange && (
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300"
            checked={marketing}
            onChange={(e) => onMarketingChange(e.target.checked)}
            disabled={disabled}
          />
          <span>마케팅 정보 수신에 동의합니다 (선택)</span>
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
