import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, Calendar, User, TrendingUp } from "lucide-react"

export default function SEOSuccessStoryPage() {
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
              <Badge className="bg-green-100 text-green-800">성공 사례</Badge>
              <Badge className="bg-purple-100 text-purple-800">마케팅</Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              AutoBlogger SEO 기능으로 검색 트래픽 10배 증가 달성!
            </CardTitle>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>이마케터</span>
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
                안녕하세요, 디지털 마케팅 전문가 이마케터입니다. 오늘은 AutoBlogger의 SEO 최적화 기능을 활용해서 놀라운
                성과를 거둔 경험을 공유하려고 합니다.
              </p>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg my-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold">핵심 성과 요약</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">1,000%</div>
                    <div className="text-sm text-gray-600">검색 트래픽 증가</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">156개</div>
                    <div className="text-sm text-gray-600">상위 10위 키워드</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">AutoBlogger 도입 배경</h2>
              <p>
                저는 중소기업의 디지털 마케팅을 담당하고 있습니다. 콘텐츠 마케팅의 중요성은 알고 있었지만, SEO에
                최적화된 고품질 콘텐츠를 꾸준히 생산하는 것은 정말 어려운 일이었습니다. 특히 키워드 리서치부터 콘텐츠
                작성, 최적화까지 모든 과정을 수동으로 진행하다 보니 시간과 비용이 많이 들었죠.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">AutoBlogger SEO 기능의 놀라운 점</h2>
              <p>
                AutoBlogger를 사용하면서 가장 놀란 점은 AI가 SEO를 정말 잘 이해하고 있다는 것이었습니다. 단순히 키워드를
                많이 넣는 것이 아니라, 자연스럽게 키워드를 배치하고 관련 키워드까지 함께 활용해서 콘텐츠를
                만들어주더라고요.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">AutoBlogger SEO 기능 상세</h3>
                <ul className="space-y-3">
                  <li>
                    <strong>스마트 키워드 분석:</strong> 타겟 키워드와 관련 키워드를 자동으로 분석하고 최적의 밀도로
                    배치
                  </li>
                  <li>
                    <strong>메타 태그 자동 생성:</strong> 제목, 설명, 키워드 메타 태그를 자동으로 최적화
                  </li>
                  <li>
                    <strong>구조화된 콘텐츠:</strong> H1, H2, H3 태그를 적절히 활용한 SEO 친화적 구조
                  </li>
                  <li>
                    <strong>내부 링크 최적화:</strong> 관련 콘텐츠 간의 내부 링크를 자동으로 생성
                  </li>
                  <li>
                    <strong>이미지 SEO:</strong> 이미지 alt 태그와 파일명까지 SEO에 최적화
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">구체적인 성과 데이터</h2>
              <p>AutoBlogger 도입 후 6개월간의 성과를 정리해보면 다음과 같습니다:</p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">도입 전 (6개월 평균)</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 월 방문자: 2,500명</li>
                    <li>• 검색 유입: 60%</li>
                    <li>• 상위 10위 키워드: 12개</li>
                    <li>• 평균 체류시간: 1분 30초</li>
                    <li>• 바운스율: 75%</li>
                  </ul>
                </Card>
                <Card className="p-4 border-green-200 bg-green-50">
                  <h4 className="font-semibold mb-2">도입 후 (최근 6개월)</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 월 방문자: 28,000명 (+1,020%)</li>
                    <li>• 검색 유입: 85%</li>
                    <li>• 상위 10위 키워드: 156개 (+1,200%)</li>
                    <li>• 평균 체류시간: 3분 45초 (+150%)</li>
                    <li>• 바운스율: 45% (-40%)</li>
                  </ul>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">가장 효과적이었던 전략</h2>
              <p>
                AutoBlogger를 활용하면서 가장 효과적이었던 전략은 <strong>롱테일 키워드 공략</strong>이었습니다. AI가
                메인 키워드와 관련된 다양한 롱테일 키워드를 자동으로 발굴하고, 이를 자연스럽게 콘텐츠에 녹여내면서 검색
                노출 기회를 크게 늘릴 수 있었습니다.
              </p>

              <div className="bg-yellow-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">실제 성공 사례</h3>
                <p className="mb-3">
                  <strong>타겟 키워드:</strong> "디지털 마케팅 전략"
                </p>
                <p className="mb-3">
                  <strong>AutoBlogger가 발굴한 롱테일 키워드:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>"중소기업 디지털 마케팅 전략"</li>
                  <li>"2024년 디지털 마케팅 트렌드"</li>
                  <li>"효과적인 온라인 마케팅 방법"</li>
                  <li>"디지털 마케팅 ROI 측정"</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  결과: 해당 포스트가 관련 키워드 23개에서 상위 10위 내 랭킹 달성
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">다른 SEO 도구와의 차이점</h2>
              <p>
                기존에 사용하던 SEO 도구들과 비교했을 때 AutoBlogger의 가장 큰 장점은
                <strong>콘텐츠 생성과 SEO 최적화가 동시에 이루어진다</strong>는 점입니다. 다른 도구들은 키워드 분석이나
                최적화 제안만 해주지만, AutoBlogger는 처음부터 SEO에 최적화된 콘텐츠를 생성해주니까 훨씬 효율적이에요.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">추천하고 싶은 이유</h2>
              <p>AutoBlogger의 SEO 기능을 추천하는 이유는 다음과 같습니다:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>시간 절약:</strong> SEO 최적화 작업 시간을 90% 단축
                </li>
                <li>
                  <strong>전문성:</strong> SEO 전문 지식이 없어도 최적화된 콘텐츠 생성 가능
                </li>
                <li>
                  <strong>일관성:</strong> 모든 콘텐츠가 동일한 수준의 SEO 최적화 적용
                </li>
                <li>
                  <strong>확장성:</strong> 대량의 콘텐츠도 빠르게 최적화 가능
                </li>
                <li>
                  <strong>비용 효율성:</strong> SEO 전문가 고용 비용 대비 매우 경제적
                </li>
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
                  AutoBlogger는 단순한 콘텐츠 생성 도구가 아니라, 진정한 SEO 파트너입니다. 검색 트래픽 10배 증가라는
                  놀라운 성과를 달성할 수 있었던 것은 AutoBlogger의 뛰어난 SEO 최적화 기능 덕분입니다.
                </p>
              </div>

              <p className="text-center mt-8">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    AutoBlogger로 SEO 성공하기
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
