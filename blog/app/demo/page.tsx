"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, FileText, ArrowRight, Wand2 } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [topic, setTopic] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState(1) // 1: 입력, 2: 생성중, 3: 결과
  const { toast } = useToast()

  const generateDemo = async () => {
    if (!topic.trim()) {
      toast({
        title: "주제를 입력해주세요",
        description: "AI가 분석할 블로그 주제를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setStep(2)

    try {
      const response = await fetch("/api/demo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) throw new Error("생성에 실패했습니다")

      const data = await response.json()
      setGeneratedContent(data.content)
      setStep(3)

      toast({
        title: "AI 초안 생성 완료!",
        description: "생성된 블로그 초안을 확인해보세요.",
      })
    } catch (error) {
      toast({
        title: "생성 실패",
        description: "AI 초안 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setStep(1)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetDemo = () => {
    setTopic("")
    setGeneratedContent("")
    setStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              AI 블로그 생성 데모
            </Badge>
            <h1 className="text-4xl font-bold mb-4 text-balance">AI가 만드는 완벽한 블로그 포스트</h1>
            <p className="text-xl text-muted-foreground text-balance">
              주제만 입력하면 AI가 자동으로 고품질 블로그 초안을 생성합니다
            </p>
          </div>

          {/* Step 1: 주제 입력 */}
          {step === 1 && (
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  어떤 주제로 블로그를 작성하고 싶으신가요?
                </CardTitle>
                <CardDescription>AI가 분석하여 완성도 높은 블로그 포스트 초안을 생성해드립니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="demo-topic" className="text-base font-medium">
                    블로그 주제
                  </Label>
                  <Input
                    id="demo-topic"
                    placeholder="예: 건강한 다이어트 방법, 부동산 투자 가이드, 여행 준비 체크리스트"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2 text-lg py-6"
                    onKeyPress={(e) => e.key === "Enter" && generateDemo()}
                  />
                </div>

                {/* 예시 주제들 */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">인기 주제 예시:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "홈트레이닝 루틴",
                      "재테크 초보 가이드",
                      "반려동물 건강관리",
                      "카페 창업 준비",
                      "독서 습관 만들기",
                    ].map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => setTopic(example)}
                        className="text-sm"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateDemo}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  AI로 블로그 초안 생성하기
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: 생성 중 */}
          {step === 2 && (
            <Card className="shadow-lg">
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                      <Sparkles className="h-8 w-8 absolute top-4 left-4 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">AI가 블로그를 작성하고 있습니다</h3>
                    <p className="text-muted-foreground">
                      주제: <span className="font-medium text-foreground">"{topic}"</span>
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✨ 주제 분석 중...</p>
                    <p>📝 구조 설계 중...</p>
                    <p>🎯 콘텐츠 생성 중...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: 결과 */}
          {step === 3 && generatedContent && (
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Sparkles className="h-6 w-6" />
                    AI 생성 완료!
                  </CardTitle>
                  <CardDescription>"{topic}" 주제로 생성된 블로그 포스트 초안입니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">생성된 블로그 초안</Label>
                    <Textarea value={generatedContent} readOnly rows={20} className="mt-2 text-sm leading-relaxed" />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={resetDemo} variant="outline" className="flex-1 bg-transparent">
                      다른 주제로 다시 시도
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Link href="/signup">
                        회원가입하고 더 많은 기능 사용하기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 추가 기능 소개 */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="py-6">
                  <h3 className="font-bold text-lg mb-3">회원가입하면 더 많은 기능을 사용할 수 있어요!</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">네이버 블로그 자동 발행</p>
                        <p className="text-muted-foreground">생성된 글을 바로 네이버 블로그에 발행</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">SEO 최적화</p>
                        <p className="text-muted-foreground">검색 엔진 최적화된 키워드 분석</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">스타일 분석</p>
                        <p className="text-muted-foreground">기존 블로그 스타일 학습 및 적용</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
