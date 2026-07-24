"use client"

import { AlertCircle, Gift } from "lucide-react"
import { RestyReferralPanel } from "@/components/resty-referral-panel"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Props = {
  tenant: string
  siteName?: string
  className?: string
}

/**
 * 유료 결제 충전은 미제공. 친구 추천 링크로 크레딧을 받도록 안내.
 */
export function RestyChargeGate({ tenant, siteName = "본 서비스", className }: Props) {
  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      <Alert className="border-amber-200 bg-amber-50 text-amber-950 [&>svg]:text-amber-700">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="space-y-2 text-sm">
          <p className="font-semibold text-base text-amber-950">결제 기능이 없습니다</p>
          <p>
            현재 <strong>유료 결제·카드 충전</strong> 기능은 제공되지 않습니다. 버튼을 눌러도 결제가
            진행되지 않으며, 크레딧이 임의로 추가되지 않습니다.
          </p>
          <p className="flex items-start gap-1.5">
            <Gift className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              대신 <strong>친구 추천</strong>으로 크레딧을 받아 보세요. 아래 초대 링크를 공유하면
              친구가 가입할 때 나와 친구 모두에게 크레딧이 지급됩니다.
            </span>
          </p>
        </AlertDescription>
      </Alert>

      <RestyReferralPanel tenant={tenant} siteName={siteName} />
    </div>
  )
}
