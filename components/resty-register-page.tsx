"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { restyRegister } from "@/lib/resty-auth"
import { ensureRestySignupBonusAmount } from "@/lib/resty-credits-bootstrap"
import { RestySignupAgreements } from "@/components/resty-signup-agreements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  tenant: string
  title: string
  subtitle?: string
}

export function RestyRegisterPage({ tenant, title, subtitle }: Props) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [terms, setTerms] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [age14, setAge14] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [nightMarketing, setNightMarketing] = useState(false)
  const [consentError, setConsentError] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setConsentError("")
    if (!terms || !privacy || !age14) {
      setConsentError("필수 약관 및 만 14세 이상 확인에 동의해 주세요.")
      return
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    setLoading(true)
    const result = await restyRegister({ email, password, name }, { tenant })
    setLoading(false)
    if (result.success && result.token) {
      const bonusAmount = await ensureRestySignupBonusAmount(tenant, result.signupBonus)
      if (bonusAmount) {
        setSuccess(`회원가입 완료! 가입 보너스 크레딧 ${bonusAmount}회가 지급되었습니다.`)
      }
      router.push("/")
      return
    }
    setError(result.message || "회원가입에 실패했습니다.")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700">
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름
            </label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm" className="text-sm font-medium">
              비밀번호 확인
            </label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          <RestySignupAgreements
            terms={terms}
            privacy={privacy}
            age14={age14}
            marketing={marketing}
            nightMarketing={nightMarketing}
            onTermsChange={setTerms}
            onPrivacyChange={setPrivacy}
            onAge14Change={setAge14}
            onMarketingChange={setMarketing}
            onNightMarketingChange={setNightMarketing}
            disabled={loading}
            privacyError={consentError && !privacy ? consentError : undefined}
            age14Error={consentError && !age14 ? consentError : undefined}
            termsError={consentError && !terms ? consentError : undefined}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
