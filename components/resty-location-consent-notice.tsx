import { MapPin, Camera } from "lucide-react"

type Props = {
  purposes?: ("location" | "camera")[]
  className?: string
}

/** 위치·카메라 수집 목적 안내 (선택 권한) */
export function RestyLocationConsentNotice({
  purposes = ["location"],
  className = "",
}: Props) {
  const items: { icon: typeof MapPin; text: string }[] = []
  if (purposes.includes("location")) {
    items.push({
      icon: MapPin,
      text: "위치정보(선택): 경기장·역 인근 여부 확인, 체크인·AR 안내에만 사용하며 저장하지 않을 수 있습니다.",
    })
  }
  if (purposes.includes("camera")) {
    items.push({
      icon: Camera,
      text: "카메라(선택): AR 화면 표시에만 사용하며, 촬영 영상은 서버에 업로드하지 않습니다.",
    })
  }

  return (
    <div className={`rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 space-y-2 ${className}`}>
      <p className="font-semibold">권한 안내</p>
      {items.map(({ icon: Icon, text }) => (
        <p key={text} className="flex gap-2 leading-relaxed">
          <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden />
          <span>{text}</span>
        </p>
      ))}
      <p className="text-[11px] text-amber-800/80">
        거부해도 기본 기능 이용이 가능하며, 설정에서 권한을 변경할 수 있습니다.{" "}
        <a href="/privacy" className="underline">
          개인정보처리방침
        </a>
      </p>
    </div>
  )
}
