import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { topic } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ success: false, message: "주제를 입력해주세요." }, { status: 400 })
    }

    console.log(`[Demo API] 데모 생성 요청: "${topic}"`)

    // OpenAI API 키가 있으면 실제 AI 생성, 없으면 데모 콘텐츠 제공
    const apiKey = process.env.OPENAI_API_KEY

    if (apiKey && !apiKey.includes("sk-your") && apiKey.length > 20) {
      // 실제 AI 생성
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: false,
      })

      const systemPrompt = `당신은 전문적인 블로그 작성자입니다. 주어진 주제에 대해 흥미롭고 유익한 블로그 포스트를 작성해주세요.

작성 가이드라인:
- 독자의 관심을 끄는 서론으로 시작
- 명확하고 구체적인 정보 제공
- 실용적인 팁이나 조언 포함
- 자연스러운 한국어 사용
- 적절한 길이 (800-1200자 정도)
- 단락을 적절히 나누어 가독성 향상
- 마무리는 독자의 행동을 유도하는 내용으로`

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `다음 주제에 대한 블로그 포스트를 작성해주세요: "${topic}"` },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content || ""
      console.log(`[Demo API] AI 생성 완료, 길이: ${content.length}`)

      return NextResponse.json({
        success: true,
        content,
        isDemo: false,
      })
    } else {
      // 데모 콘텐츠 제공
      console.log(`[Demo API] 데모 콘텐츠 제공`)

      const demoContent = generateDemoContent(topic)

      // 실제 AI 생성처럼 보이게 하기 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        content: demoContent,
        isDemo: true,
      })
    }
  } catch (error) {
    console.error("[Demo API] 생성 오류:", error)

    // 오류 발생 시에도 데모 콘텐츠 제공
    const { topic } = await request.json()
    const demoContent = generateDemoContent(topic || "블로그 작성")

    return NextResponse.json({
      success: true,
      content: demoContent,
      isDemo: true,
    })
  }
}

function generateDemoContent(topic: string): string {
  const templates = {
    건강: `# ${topic}에 대한 완벽 가이드

안녕하세요! 오늘은 많은 분들이 관심을 가지고 계신 ${topic}에 대해 자세히 알아보겠습니다.

## 왜 ${topic}이 중요할까요?

현대 사회에서 ${topic}은 우리 삶의 질을 결정하는 중요한 요소 중 하나입니다. 바쁜 일상 속에서도 ${topic}을 제대로 관리한다면, 더 건강하고 활기찬 생활을 영위할 수 있습니다.

## 실천 가능한 방법들

### 1. 기본기 다지기
${topic}의 기본 원리를 이해하고, 작은 것부터 시작해보세요. 무리하지 않는 선에서 꾸준히 실천하는 것이 가장 중요합니다.

### 2. 단계별 접근
처음부터 완벽하게 하려고 하지 마세요. 단계별로 목표를 설정하고, 하나씩 달성해나가는 것이 효과적입니다.

### 3. 전문가 조언 활용
혼자서 모든 것을 해결하려 하지 말고, 전문가의 조언을 구하는 것도 좋은 방법입니다.

## 주의사항

${topic}을 실천할 때는 개인차를 고려해야 합니다. 다른 사람에게 효과적이었던 방법이 나에게도 반드시 맞는 것은 아니니까요.

## 마무리

${topic}은 하루아침에 완성되는 것이 아닙니다. 꾸준한 노력과 인내가 필요하지만, 그만큼 얻는 것도 클 것입니다. 오늘부터 작은 변화를 시작해보세요!

여러분의 ${topic} 여정을 응원합니다! 💪`,

    재테크: `# ${topic} 초보자를 위한 실전 가이드

${topic}에 관심은 있지만 어디서부터 시작해야 할지 막막하셨나요? 오늘은 초보자도 쉽게 따라할 수 있는 ${topic} 방법을 알려드리겠습니다.

## ${topic}의 첫걸음

### 1. 현재 상황 파악하기
먼저 자신의 재정 상태를 정확히 파악하는 것이 중요합니다. 수입과 지출을 체계적으로 정리해보세요.

### 2. 목표 설정하기
단기, 중기, 장기 목표를 명확히 설정하세요. 구체적인 목표가 있어야 효과적인 계획을 세울 수 있습니다.

## 실전 ${topic} 전략

### 안전한 투자부터
- 예적금으로 기본기 다지기
- 안정적인 수익률 확보
- 리스크 관리의 중요성

### 점진적 확장
경험이 쌓이면서 점차 투자 영역을 확장해나가세요. 무리한 투자는 금물입니다.

## 피해야 할 실수들

1. 감정적인 투자 결정
2. 한 곳에 모든 자금 집중
3. 단기 수익에만 집착

## 성공하는 ${topic}의 비결

꾸준함이 가장 중요합니다. 작은 금액이라도 정기적으로 투자하는 습관을 기르세요.

${topic}은 마라톤과 같습니다. 천천히, 하지만 꾸준히 나아가다 보면 분명 목표에 도달할 수 있을 것입니다! 🎯`,

    default: `# ${topic}에 대해 알아보기

${topic}에 대해 궁금하셨던 분들을 위해 유용한 정보를 정리해보았습니다.

## ${topic}이란?

${topic}은 현재 많은 사람들이 관심을 가지고 있는 주제 중 하나입니다. 올바른 정보와 체계적인 접근이 필요한 영역이기도 합니다.

## 핵심 포인트

### 1. 기본 이해하기
${topic}의 기본 개념과 원리를 먼저 이해하는 것이 중요합니다. 기초가 탄탄해야 응용도 가능합니다.

### 2. 실전 적용하기
이론만으로는 부족합니다. 실제로 적용해보면서 경험을 쌓아가세요.

### 3. 지속적인 학습
${topic} 분야는 계속 발전하고 있습니다. 최신 트렌드와 정보를 꾸준히 업데이트하세요.

## 시작하는 방법

1. **정보 수집**: 신뢰할 수 있는 자료를 통해 기본 지식을 쌓으세요
2. **계획 수립**: 명확한 목표와 단계별 계획을 세우세요
3. **실행**: 작은 것부터 시작해서 점차 확장해나가세요
4. **평가 및 개선**: 정기적으로 결과를 점검하고 개선하세요

## 주의사항

${topic}을 다룰 때는 신중한 접근이 필요합니다. 성급한 결정보다는 충분한 검토를 거쳐 진행하세요.

## 결론

${topic}은 올바른 방법으로 접근한다면 분명 좋은 결과를 얻을 수 있는 분야입니다. 꾸준한 노력과 학습을 통해 원하는 목표를 달성하시기 바랍니다!

더 자세한 정보가 필요하시다면 전문가의 도움을 받는 것도 좋은 방법입니다. 성공적인 ${topic} 여정을 응원합니다! ✨`,
  }

  // 주제에 따라 적절한 템플릿 선택
  if (topic.includes("건강") || topic.includes("다이어트") || topic.includes("운동") || topic.includes("홈트")) {
    return templates["건강"]
  } else if (topic.includes("재테크") || topic.includes("투자") || topic.includes("돈") || topic.includes("부동산")) {
    return templates["재테크"]
  } else {
    return templates["default"]
  }
}
