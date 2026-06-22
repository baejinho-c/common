import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, Calendar, User, Clock } from "lucide-react"

export default function TimeSavingStoryPage() {
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
              <Badge className="bg-purple-100 text-purple-800">생산성</Badge>
              <Badge className="bg-orange-100 text-orange-800">콘텐츠 제작</Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              AutoBlogger로 콘텐츠 제작 시간 90% 단축, 품질은 더 향상!
            </CardTitle>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>박작가</span>
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
                안녕하세요, 프리랜서 콘텐츠 크리에이터 박작가입니다. 오늘은 AutoBlogger를 사용해서 콘텐츠 제작 효율성을
                극대화한 경험을 공유하려고 합니다.
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-orange-50 p-6 rounded-lg my-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold">시간 절약 성과</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">90%</div>
                    <div className="text-sm text-gray-600">제작 시간 단축</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">5배</div>
                    <div className="text-sm text-gray-600">생산성 향상</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">200%</div>
                    <div className="text-sm text-gray-600">품질 개선</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">콘텐츠 크리에이터의 고민</h2>
              <p>
                프리랜서로 일하면서 가장 큰 고민은 시간 관리였습니다. 클라이언트마다 다른 톤앤매너, 다양한 주제의
                콘텐츠를 제작해야 하는데, 리서치부터 초안 작성, 수정까지 하나의 콘텐츠를 완성하는 데 평균 4-5시간이
                걸렸어요. 이렇게 되니 하루에 1-2개의 콘텐츠밖에 만들 수 없었고, 수익에도 한계가 있었죠.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">AutoBlogger와의 만남</h2>
              <p>
                AutoBlogger를 처음 접했을 때는 솔직히 반신반의했습니다. 'AI가 만든 콘텐츠가 과연 클라이언트가 만족할
                수준일까?' 하는 의구심이 있었거든요. 하지만 무료 체험을 해보고 나서 생각이 완전히 바뀌었습니다.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">AutoBlogger 활용 워크플로우</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">키워드 및 방향성 입력 (5분)</h4>
                      <p className="text-sm text-gray-600">클라이언트 요구사항과 타겟 키워드를 간단히 입력</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">AI 초안 생성 (2분)</h4>
                      <p className="text-sm text-gray-600">AutoBlogger가 구조화된 고품질 초안을 자동 생성</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">개인화 및 수정 (15분)</h4>
                      <p className="text-sm text-gray-600">클라이언트 브랜드에 맞게 톤앤매너 조정 및 세부 수정</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">최종 검토 및 전달 (8분)</h4>
                      <p className="text-sm text-gray-600">품질 확인 후 클라이언트에게 전달</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
                  <strong>총 소요 시간: 30분</strong> (기존 4-5시간 대비 90% 단축)
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">품질 향상의 비밀</h2>
              <p>
                시간이 단축되었다고 해서 품질이 떨어진 것은 전혀 아닙니다. 오히려 품질이 더 좋아졌어요. 그 이유는 다음과
                같습니다:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>일관된 구조:</strong> AutoBlogger가 생성하는 콘텐츠는 항상 논리적이고 체계적인 구조를 가지고
                  있어요
                </li>
                <li>
                  <strong>풍부한 정보:</strong> AI가 방대한 데이터를 바탕으로 관련 정보를 자동으로 수집하고 정리해줍니다
                </li>
                <li>
                  <strong>SEO 최적화:</strong> 자연스럽게 키워드가 배치되고 검색 엔진에 최적화된 구조로 작성됩니다
                </li>
                <li>
                  <strong>창의적 아이디어:</strong> 제가 생각하지 못했던 새로운 관점이나 아이디어를 제시해줍니다
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">클라이언트 반응</h2>
              <p>
                가장 중요한 것은 클라이언트의 반응이었는데, 정말 놀라웠습니다. 기존보다 더 빠른 시간에 더 좋은 품질의
                콘텐츠를 전달하니까 클라이언트 만족도가 크게 향상되었어요.
              </p>

              <div className="bg-green-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">실제 클라이언트 피드백</h3>
                <div className="space-y-4">
                  <blockquote className="border-l-4 border-green-500 pl-4 italic">
                    "박작가님이 최근에 보내주시는 콘텐츠들이 정말 좋아졌어요. 구조도 체계적이고 내용도 더 풍부해진 것
                    같습니다. 앞으로도 계속 부탁드릴게요!" - A 브랜드 마케팅 담당자
                  </blockquote>
                  <blockquote className="border-l-4 border-green-500 pl-4 italic">
                    "납기일보다 훨씬 빨리 완성해주시는데 품질까지 좋아서 정말 만족스럽습니다. 추가 프로젝트도 의뢰하고
                    싶어요." - B 스타트업 CEO
                  </blockquote>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">수익 증대 효과</h2>
              <p>시간 절약과 품질 향상은 자연스럽게 수익 증대로 이어졌습니다:</p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">AutoBlogger 도입 전</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 일일 콘텐츠 제작: 1-2개</li>
                    <li>• 월 평균 수익: 200만원</li>
                    <li>• 작업 시간: 하루 10-12시간</li>
                    <li>• 클라이언트 수: 3-4개</li>
                    <li>• 스트레스 지수: 매우 높음</li>
                  </ul>
                </Card>
                <Card className="p-4 border-purple-200 bg-purple-50">
                  <h4 className="font-semibold mb-2">AutoBlogger 도입 후</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 일일 콘텐츠 제작: 8-10개 (+400%)</li>
                    <li>• 월 평균 수익: 650만원 (+225%)</li>
                    <li>• 작업 시간: 하루 6-7시간 (-40%)</li>
                    <li>• 클라이언트 수: 12개 (+200%)</li>
                    <li>• 스트레스 지수: 낮음</li>
                  </ul>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">추천하고 싶은 이유</h2>
              <p>AutoBlogger를 다른 콘텐츠 크리에이터들에게 추천하는 이유는 명확합니다:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>시간 효율성:</strong> 더 적은 시간으로 더 많은 콘텐츠 제작 가능
                </li>
                <li>
                  <strong>품질 일관성:</strong> 항상 일정 수준 이상의 품질 보장
                </li>
                <li>
                  <strong>창의성 지원:</strong> 새로운 아이디어와 관점 제공
                </li>
                <li>
                  <strong>스트레스 감소:</strong> 빈 페이지 앞에서의 고민 시간 단축
                </li>
                <li>
                  <strong>수익 증대:</strong> 생산성 향상을 통한 직접적인 수익 증가
                </li>
                <li>
                  <strong>학습 효과:</strong> AI가 생성한 콘텐츠를 통해 새로운 작성 기법 습득
                </li>
              </ul>

              <div className="bg-orange-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">콘텐츠 크리에이터를 위한 팁</h3>
                <ul className="space-y-2 text-sm">
                  <li>• AutoBlogger는 완전한 대체재가 아닌 강력한 보조 도구로 활용하세요</li>
                  <li>• AI가 생성한 초안을 바탕으로 개인의 창의성을 더해주세요</li>
                  <li>• 클라이언트별 톤앤매너를 미리 정리해두면 수정 시간을 더 단축할 수 있어요</li>
                  <li>• 다양한 프롬프트를 실험해보며 최적의 결과를 찾아보세요</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3">최종 평가</h3>
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xl font-bold">5.0 / 5.0</span>
                </div>
                <p>
                  AutoBlogger는 제 콘텐츠 크리에이터 인생을 완전히 바꿔놓았습니다. 더 적은 시간으로 더 많은 수익을
                  올리면서도 품질은 향상시킬 수 있었어요. 콘텐츠 제작에 어려움을 겪고 있는 모든 분들에게 강력히
                  추천합니다!
                </p>
              </div>

              <p className="text-center mt-8">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                  >
                    AutoBlogger로 생산성 혁신하기
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
