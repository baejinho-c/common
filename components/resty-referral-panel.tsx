"use client"

import { useCallback, useEffect, useState } from "react"
import { Copy, Gift, Share2, Users } from "lucide-react"
import { restyGetMyReferral, type ReferralMe } from "@/lib/resty-referrals"
import { buildShareUrl } from "@/lib/referral-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Props = {
  tenant: string
  siteName?: string
  baseUrl?: string
  onCopied?: () => void
}

export function RestyReferralPanel({ tenant, siteName = "본 서비스", baseUrl, onCopied }: Props) {
  const [data, setData] = useState<ReferralMe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await restyGetMyReferral({
        tenant,
        baseUrl: baseUrl || (typeof window !== "undefined" ? window.location.origin : undefined),
      })
      setData(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : "추천 정보를 불러오지 못했습니다.")
    } finally {
      setLoading(false)
    }
  }, [tenant, baseUrl])

  useEffect(() => {
    void load()
  }, [load])

  const shareUrl =
    data?.shareUrl ||
    (data?.code ? buildShareUrl(data.code, baseUrl) : "")

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      onCopied?.()
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const handleShare = async () => {
    if (!shareUrl || !data?.code) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${siteName} 초대`,
          text: `${siteName}에 가입하고 무료 크레딧을 받아 보세요!`,
          url: shareUrl,
        })
        return
      } catch {
        /* fall through */
      }
    }
    void handleCopy()
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">추천 링크 불러오는 중...</p>
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!data?.enabled) {
    return null
  }

  const referrerReward = data.rewards?.referrer ?? 5
  const refereeReward = data.rewards?.referee ?? 3

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-violet-600" />
          친구 초대 · 크레딧 받기
        </CardTitle>
        <CardDescription>
          링크를 공유하면 친구가 가입할 때 추천인에게 <strong>{referrerReward}크레딧</strong>, 친구에게{" "}
          <strong>{refereeReward}크레딧</strong>이 지급됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input readOnly value={shareUrl} className="font-mono text-xs" />
          <div className="flex gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "복사됨" : "복사"}
            </Button>
            <Button type="button" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              공유
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          내 추천 코드: <span className="font-mono font-semibold">{data.code}</span>
        </p>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            초대 {data.stats?.invites ?? 0}명
          </span>
          <span className="text-violet-700 font-medium">
            누적 +{data.stats?.creditsEarned ?? 0}크레딧
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
