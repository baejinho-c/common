"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { restyDeleteUser, getRestyTenant } from "@/lib/resty-auth"

type Props = {
  userId: number
  tenant?: string
  onDeleted?: () => void
  confirmPhrase?: string
}

/** 회원 탈퇴 — 본인 JWT 필요 (resty-api DELETE /api/resty/users/:id) */
export function RestyAccountDeleteSection({
  userId,
  tenant,
  onDeleted,
  confirmPhrase = "계정삭제",
}: Props) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    const typed = window.prompt(`계정을 삭제하려면 '${confirmPhrase}'를 입력하세요.`)
    if (typed !== confirmPhrase) return

    setDeleting(true)
    setError("")
    const result = await restyDeleteUser(userId, { tenant: tenant ?? getRestyTenant() })
    setDeleting(false)

    if (!result.success) {
      setError(result.message || "계정 삭제에 실패했습니다.")
      return
    }
    onDeleted?.()
  }

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive text-base">
          <Trash2 className="h-4 w-4" />
          회원 탈퇴
        </CardTitle>
        <CardDescription>
          탈퇴 시 개인정보는 삭제되며, 법령상 보존이 필요한 거래·분쟁 기록은 별도 보관될 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="button" variant="destructive" disabled={deleting} onClick={handleDelete}>
          {deleting ? "삭제 중..." : "계정 삭제"}
        </Button>
      </CardContent>
    </Card>
  )
}
