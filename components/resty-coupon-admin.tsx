"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Ticket } from "lucide-react"
import {
  restyCreateCoupon,
  restyListCoupons,
  restySetCouponActive,
  type CouponRow,
} from "@/lib/resty-coupons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  tenant: string
  adminKey?: string
}

export function RestyCouponAdmin({ tenant, adminKey }: Props) {
  const [coupons, setCoupons] = useState<CouponRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creditAmount, setCreditAmount] = useState("10")
  const [maxUses, setMaxUses] = useState("10")
  const [note, setNote] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await restyListCoupons({ tenant, adminKey })
      setCoupons(res.coupons ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "쿠폰 목록을 불러오지 못했습니다.")
    } finally {
      setLoading(false)
    }
  }, [tenant, adminKey])

  useEffect(() => {
    void load()
  }, [load])

  const handleCreate = async (autoGenerate: boolean) => {
    const amount = Number.parseInt(creditAmount, 10)
    const uses = Number.parseInt(maxUses, 10)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("크레딧 수량을 입력해 주세요.")
      return
    }
    setCreating(true)
    setError("")
    try {
      await restyCreateCoupon(
        {
          creditAmount: amount,
          maxUses: Number.isFinite(uses) && uses > 0 ? uses : 1,
          note: note.trim() || undefined,
          code: autoGenerate ? undefined : customCode.trim() || undefined,
          autoGenerate,
        },
        { tenant, adminKey },
      )
      setCustomCode("")
      setNote("")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "쿠폰 발행에 실패했습니다.")
    } finally {
      setCreating(false)
    }
  }

  const toggleActive = async (row: CouponRow) => {
    try {
      await restySetCouponActive(row.id, !row.active, { tenant, adminKey })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "상태 변경 실패")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            쿠폰 발행
          </CardTitle>
          <CardDescription>크레딧 쿠폰 코드를 생성합니다. 코드는 자동 생성하거나 직접 지정할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="coupon-credits">크레딧 수량</Label>
              <Input
                id="coupon-credits"
                type="number"
                min={1}
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-max">최대 사용 횟수</Label>
              <Input
                id="coupon-max"
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon-note">메모 (선택)</Label>
            <Input id="coupon-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="이벤트명 등" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon-code">직접 코드 (선택)</Label>
            <Input
              id="coupon-code"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              placeholder="비우면 자동 생성"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={creating} onClick={() => handleCreate(true)}>
              <Plus className="h-4 w-4 mr-1" />
              자동 코드 발행
            </Button>
            {customCode.trim() ? (
              <Button type="button" variant="outline" disabled={creating} onClick={() => handleCreate(false)}>
                지정 코드 발행
              </Button>
            ) : null}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>발행된 쿠폰</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">불러오는 중...</p>
          ) : coupons.length === 0 ? (
            <p className="text-sm text-muted-foreground">발행된 쿠폰이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {coupons.map((c) => (
                <li key={c.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono font-semibold">{c.code}</p>
                    <p className="text-muted-foreground text-xs">
                      {c.credit_amount}크레딧 · {c.used_count}/{c.max_uses}회 사용
                      {c.note ? ` · ${c.note}` : ""}
                    </p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={() => toggleActive(c)}>
                    {c.active ? "비활성화" : "활성화"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
