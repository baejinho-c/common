"use client"

import { useState } from "react"
import { Ticket } from "lucide-react"
import { restyRedeemCoupon } from "@/lib/resty-coupons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Props = {
  tenant: string
  onRedeemed?: (credits: number) => void
}

export function RestyCouponRedeem({ tenant, onRedeemed }: Props) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleRedeem = async () => {
    const trimmed = code.trim()
    if (!trimmed) {
      setError("쿠폰 코드를 입력해 주세요.")
      return
    }
    setLoading(true)
    setError("")
    setMessage("")
    try {
      const res = await restyRedeemCoupon(trimmed, { tenant })
      setMessage(res.message || "쿠폰이 적용되었습니다.")
      setCode("")
      if (res.creditsGranted) onRedeemed?.(res.creditsGranted)
    } catch (e) {
      setError(e instanceof Error ? e.message : "쿠폰 적용에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ticket className="h-5 w-5" />
          쿠폰 코드
        </CardTitle>
        <CardDescription>발급받은 쿠폰 코드를 입력하면 크레딧이 충전됩니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="쿠폰 코드 입력"
            disabled={loading}
          />
          <Button type="button" onClick={handleRedeem} disabled={loading} className="shrink-0">
            {loading ? "적용 중..." : "적용하기"}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
      </CardContent>
    </Card>
  )
}
