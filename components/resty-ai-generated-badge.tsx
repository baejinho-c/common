import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

/** AI 생성 콘텐츠 인라인 표시 */
export function RestyAiGeneratedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700",
        className,
      )}
      aria-label="AI 생성 콘텐츠"
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      AI 생성
    </span>
  )
}
