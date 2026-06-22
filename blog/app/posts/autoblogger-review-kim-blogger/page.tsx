import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, Calendar, User } from "lucide-react"

export default function KimBloggerReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-800">사용자 후기</Badge>
              <Badge className="bg-green-100 text-green-800">여행 블로거</Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              AutoBlogger로 여행 블로그 운영이 완전히 바뀌었어요!
            </CardTitle>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>김블로거</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>2024년 12월 28일</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-1">5.0</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="text-lg leading-relaxed space-y-6">
              <p>
                안녕하세요! 여행 블로거 김블로거입니다. 오늘은 제가 3개월 동안 사용해본 AutoBlogger에 대한 솔직한 후기를
                공유하려고 합니다.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">AutoBlogger를 선택한 이유</h2>
              <p>
                여행을 다니면서 블로그를 운영하는 것은 정말 어려운 일이었습니다. 여행 중에는 사진 찍고 경험하는 것에
                집중하고 싶은데, 매일 블로그 포스팅을 해야 한다는 부담감이 컸어요. 그러던 중 AutoBlogger를 알게 되었고,
                AI가 자동으로 콘텐츠를 생성해준다는 점이 매력적이었습니다.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">실제 사용 경험</h2>
              <p>
                처음에는 AI가 만든 글이 과연 괜찮을까 의심스러웠는데, 막상 사용해보니 정말 놀라웠습니다. 제가 여행지에서
                찍은 사진 몇 장과 간단한 키워드만 입력하면, 마치 제가 직접 쓴 것 같은 자연스러운 여행기가
                완성되더라고요.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">가장 만족스러운 기능들</h3>
                <ul className="space-y-2">
                  <li>
                    • <strong>자동 포스팅:</strong> 네이버 블로그에 자동으로 업로드되어 정말 편해요
                  </li>
                  <li>
                    • <strong>SEO 최적화:</strong> 검색 노출이 확실히 늘어났어요
                  </li>
                  <li>
                    • <strong>예약 기능:</strong> 여행 중에도 정기적으로 포스팅이 올라가요
                  </li>
                  <li>
                    • <strong>다양한 스타일:</strong> 여행기, 맛집 리뷰, 숙소 후기 등 다양한 형태로 작성 가능
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">구체적인 성과</h2>
              <p>AutoBlogger 사용 전후를 비교해보면 정말 놀라운 변화가 있었습니다:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>월 평균 포스팅 수: 5개 → 25개 (5배 증가)</li>
                <li>블로그 방문자 수: 월 1,000명 → 월 8,000명 (8배 증가)</li>
                <li>네이버 검색 노출: 상위 10위 내 키워드 3개 → 47개</li>
                <li>포스팅 작성 시간: 포스트당 2시간 → 15분</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">아쉬운 점과 개선 사항</h2>
              <p>
                물론 완벽하지는 않습니다. 가끔 AI가 생성한 내용 중에 실제 경험과 다른 부분이 있어서 수정이 필요할 때가
                있어요. 하지만 전체적인 틀은 정말 잘 잡아주기 때문에 큰 문제는 아닙니다.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">추천하고 싶은 분들</h2>
              <p>AutoBlogger는 특히 이런 분들에게 추천하고 싶어요:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>블로그 운영에 시간을 많이 투자하기 어려운 분</li>
                <li>꾸준한 포스팅이 어려운 분</li>
                <li>SEO에 대한 지식이 부족한 분</li>
                <li>여러 플랫폼에 동시에 포스팅하고 싶은 분</li>
              </ul>

              <div className="bg-green-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">최종 평가</h3>
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xl font-bold">5.0 / 5.0</span>
                </div>
                <p>
                  AutoBlogger는 제 블로그 운영 방식을 완전히 바꿔놓았습니다. 이제 여행에만 집중할 수 있게 되었고,
                  블로그는 자동으로 성장하고 있어요. 정말 만족스러운 서비스입니다!
                </p>
              </div>

              <p className="text-center mt-8">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    AutoBlogger 무료로 시작하기
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
