"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Target,
  BarChart3,
  Lightbulb,
} from "lucide-react"

interface SEOAnalyzerProps {
  title: string
  content: string
  onKeywordsUpdate: (keywords: string[]) => void
}

export default function SEOAnalyzer({ title, content, onKeywordsUpdate }: SEOAnalyzerProps) {
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null)
  const [keywords, setKeywords] = useState<any>(null)
  const [targetKeywords, setTargetKeywords] = useState<string>("")
  const [topic, setTopic] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const analyzeSEO = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage({ type: "error", text: "제목과 내용을 입력해주세요." })
      return
    }

    setIsAnalyzing(true)
    setMessage(null)

    try {
      const response = await fetch("/api/seo/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          targetKeywords: targetKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setSeoAnalysis(data.analysis)
        setMessage({ type: "success", text: "SEO 분석이 완료되었습니다!" })
      } else {
        setMessage({ type: "error", text: data.message || "SEO 분석 중 오류가 발생했습니다." })
      }
    } catch (error) {
      console.error("SEO 분석 오류:", error)
      setMessage({ type: "error", text: "서버 연결 오류가 발생했습니다." })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getKeywordSuggestions = async () => {
    if (!topic.trim()) {
      setMessage({ type: "error", text: "키워드 분석할 주제를 입력해주세요." })
      return
    }

    setIsLoadingKeywords(true)
    setMessage(null)

    try {
      const response = await fetch("/api/seo/keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          targetAudience: "블로그 독자",
          contentType: "블로그 포스트",
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setKeywords(data.keywords)
        setMessage({ type: "success", text: "키워드 추천이 완료되었습니다!" })

        // 추천된 키워드를 부모 컴포넌트에 전달
        const allKeywords = [
          ...(data.keywords.primary || []),
          ...(data.keywords.longTail || []),
          ...(data.keywords.related || []),
        ].slice(0, 10)
        onKeywordsUpdate(allKeywords)
      } else {
        setMessage({ type: "error", text: data.message || "키워드 분석 중 오류가 발생했습니다." })
      }
    } catch (error) {
      console.error("키워드 분석 오류:", error)
      setMessage({ type: "error", text: "서버 연결 오류가 발생했습니다." })
    } finally {
      setIsLoadingKeywords(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="h-5 w-5 mr-2" />
          SEO 최적화 도구
          <Badge variant="secondary" className="ml-2">
            AI 분석
          </Badge>
        </CardTitle>
        <CardDescription>콘텐츠의 SEO 점수를 분석하고 개선 방안을 제시합니다</CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert
            className={`mb-4 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">SEO 분석</TabsTrigger>
            <TabsTrigger value="keywords">키워드 도구</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="target-keywords">타겟 키워드 (쉼표로 구분)</Label>
                <Input
                  id="target-keywords"
                  placeholder="예: React, 성능 최적화, 웹 개발"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                />
              </div>

              <Button onClick={analyzeSEO} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-2" />
                )}
                SEO 분석 시작
              </Button>
            </div>

            {seoAnalysis && (
              <div className="space-y-4 mt-6">
                {/* 전체 SEO 점수 */}
                <Card className={getScoreBgColor(seoAnalysis.score)}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">전체 SEO 점수</h3>
                        <p className="text-sm text-gray-600">100점 만점</p>
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(seoAnalysis.score)}`}>
                        {seoAnalysis.score}
                      </div>
                    </div>
                    <Progress value={seoAnalysis.score} className="mt-3" />
                  </CardContent>
                </Card>

                {/* 세부 분석 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 제목 분석 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        제목 ({seoAnalysis.title.length}자)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-xl font-bold ${getScoreColor(seoAnalysis.title.score)}`}>
                        {seoAnalysis.title.score}
                      </div>
                      <Progress value={seoAnalysis.title.score} className="mt-2" />
                      {seoAnalysis.title.issues.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-red-600 mb-1">문제점:</p>
                          {seoAnalysis.title.issues.map((issue: string, index: number) => (
                            <p key={index} className="text-xs text-red-600">
                              • {issue}
                            </p>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 콘텐츠 분석 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        콘텐츠 ({seoAnalysis.content.wordCount}단어)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-xl font-bold ${getScoreColor(seoAnalysis.content.score)}`}>
                        {seoAnalysis.content.score}
                      </div>
                      <Progress value={seoAnalysis.content.score} className="mt-2" />
                      <div className="mt-3">
                        <p className="text-xs text-gray-600">가독성: {seoAnalysis.content.readability}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 구조 분석 */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        구조 ({seoAnalysis.structure.headings.length}개 헤딩)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-xl font-bold ${getScoreColor(seoAnalysis.structure.score)}`}>
                        {seoAnalysis.structure.score}
                      </div>
                      <Progress value={seoAnalysis.structure.score} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                {/* 메타 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">생성된 메타 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium">메타 설명</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded mt-1">{seoAnalysis.meta.description}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">추천 키워드</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {seoAnalysis.meta.keywords.slice(0, 8).map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 개선 제안 */}
                {seoAnalysis.content.suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        개선 제안
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {seoAnalysis.content.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">주제 또는 키워드</Label>
                <Input
                  id="topic"
                  placeholder="예: React 성능 최적화"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <Button onClick={getKeywordSuggestions} disabled={isLoadingKeywords} className="w-full">
                {isLoadingKeywords ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                키워드 추천 받기
              </Button>
            </div>

            {keywords && (
              <div className="space-y-4 mt-6">
                {/* 주요 키워드 */}
                {keywords.primary && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">주요 키워드</CardTitle>
                      <CardDescription className="text-xs">메인 타겟 키워드</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {keywords.primary.map((keyword: string, index: number) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 롱테일 키워드 */}
                {keywords.longTail && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">롱테일 키워드</CardTitle>
                      <CardDescription className="text-xs">구체적이고 경쟁이 낮은 키워드</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {keywords.longTail.map((keyword: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 관련 키워드 */}
                {keywords.related && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">관련 키워드</CardTitle>
                      <CardDescription className="text-xs">주제와 연관된 키워드</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {keywords.related.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 질문형 키워드 */}
                {keywords.questions && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">질문형 키워드</CardTitle>
                      <CardDescription className="text-xs">사용자가 검색하는 질문들</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {keywords.questions.map((question: string, index: number) => (
                          <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                            {question}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
