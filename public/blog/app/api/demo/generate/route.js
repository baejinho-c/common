(()=>{var e={};e.id=6131,e.ids=[6131],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},53037:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>g,routeModule:()=>p,serverHooks:()=>$,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>m});var r={};s.r(r),s.d(r,{POST:()=>c});var o=s(96559),n=s(48088),a=s(37719),i=s(32190),u=s(57932);async function c(e){try{let{topic:t}=await e.json();if(!t?.trim())return i.NextResponse.json({success:!1,message:"주제를 입력해주세요."},{status:400});console.log(`[Demo API] 데모 생성 요청: "${t}"`);let s=process.env.OPENAI_API_KEY;if(s&&!s.includes("sk-your")&&s.length>20){let e=new u.Ay({apiKey:s,dangerouslyAllowBrowser:!1}),r=`당신은 전문적인 블로그 작성자입니다. 주어진 주제에 대해 흥미롭고 유익한 블로그 포스트를 작성해주세요.

작성 가이드라인:
- 독자의 관심을 끄는 서론으로 시작
- 명확하고 구체적인 정보 제공
- 실용적인 팁이나 조언 포함
- 자연스러운 한국어 사용
- 적절한 길이 (800-1200자 정도)
- 단락을 적절히 나누어 가독성 향상
- 마무리는 독자의 행동을 유도하는 내용으로`,o=await e.chat.completions.create({model:"gpt-4o",messages:[{role:"system",content:r},{role:"user",content:`다음 주제에 대한 블로그 포스트를 작성해주세요: "${t}"`}],max_tokens:1500,temperature:.7}),n=o.choices[0]?.message?.content||"";return console.log(`[Demo API] AI 생성 완료, 길이: ${n.length}`),i.NextResponse.json({success:!0,content:n,isDemo:!1})}{console.log(`[Demo API] 데모 콘텐츠 제공`);let e=l(t);return await new Promise(e=>setTimeout(e,2e3)),i.NextResponse.json({success:!0,content:e,isDemo:!0})}}catch(r){console.error("[Demo API] 생성 오류:",r);let{topic:t}=await e.json(),s=l(t||"블로그 작성");return i.NextResponse.json({success:!0,content:s,isDemo:!0})}}function l(e){let t={건강:`# ${e}에 대한 완벽 가이드

안녕하세요! 오늘은 많은 분들이 관심을 가지고 계신 ${e}에 대해 자세히 알아보겠습니다.

## 왜 ${e}이 중요할까요?

현대 사회에서 ${e}은 우리 삶의 질을 결정하는 중요한 요소 중 하나입니다. 바쁜 일상 속에서도 ${e}을 제대로 관리한다면, 더 건강하고 활기찬 생활을 영위할 수 있습니다.

## 실천 가능한 방법들

### 1. 기본기 다지기
${e}의 기본 원리를 이해하고, 작은 것부터 시작해보세요. 무리하지 않는 선에서 꾸준히 실천하는 것이 가장 중요합니다.

### 2. 단계별 접근
처음부터 완벽하게 하려고 하지 마세요. 단계별로 목표를 설정하고, 하나씩 달성해나가는 것이 효과적입니다.

### 3. 전문가 조언 활용
혼자서 모든 것을 해결하려 하지 말고, 전문가의 조언을 구하는 것도 좋은 방법입니다.

## 주의사항

${e}을 실천할 때는 개인차를 고려해야 합니다. 다른 사람에게 효과적이었던 방법이 나에게도 반드시 맞는 것은 아니니까요.

## 마무리

${e}은 하루아침에 완성되는 것이 아닙니다. 꾸준한 노력과 인내가 필요하지만, 그만큼 얻는 것도 클 것입니다. 오늘부터 작은 변화를 시작해보세요!

여러분의 ${e} 여정을 응원합니다! 💪`,재테크:`# ${e} 초보자를 위한 실전 가이드

${e}에 관심은 있지만 어디서부터 시작해야 할지 막막하셨나요? 오늘은 초보자도 쉽게 따라할 수 있는 ${e} 방법을 알려드리겠습니다.

## ${e}의 첫걸음

### 1. 현재 상황 파악하기
먼저 자신의 재정 상태를 정확히 파악하는 것이 중요합니다. 수입과 지출을 체계적으로 정리해보세요.

### 2. 목표 설정하기
단기, 중기, 장기 목표를 명확히 설정하세요. 구체적인 목표가 있어야 효과적인 계획을 세울 수 있습니다.

## 실전 ${e} 전략

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

## 성공하는 ${e}의 비결

꾸준함이 가장 중요합니다. 작은 금액이라도 정기적으로 투자하는 습관을 기르세요.

${e}은 마라톤과 같습니다. 천천히, 하지만 꾸준히 나아가다 보면 분명 목표에 도달할 수 있을 것입니다! 🎯`,default:`# ${e}에 대해 알아보기

${e}에 대해 궁금하셨던 분들을 위해 유용한 정보를 정리해보았습니다.

## ${e}이란?

${e}은 현재 많은 사람들이 관심을 가지고 있는 주제 중 하나입니다. 올바른 정보와 체계적인 접근이 필요한 영역이기도 합니다.

## 핵심 포인트

### 1. 기본 이해하기
${e}의 기본 개념과 원리를 먼저 이해하는 것이 중요합니다. 기초가 탄탄해야 응용도 가능합니다.

### 2. 실전 적용하기
이론만으로는 부족합니다. 실제로 적용해보면서 경험을 쌓아가세요.

### 3. 지속적인 학습
${e} 분야는 계속 발전하고 있습니다. 최신 트렌드와 정보를 꾸준히 업데이트하세요.

## 시작하는 방법

1. **정보 수집**: 신뢰할 수 있는 자료를 통해 기본 지식을 쌓으세요
2. **계획 수립**: 명확한 목표와 단계별 계획을 세우세요
3. **실행**: 작은 것부터 시작해서 점차 확장해나가세요
4. **평가 및 개선**: 정기적으로 결과를 점검하고 개선하세요

## 주의사항

${e}을 다룰 때는 신중한 접근이 필요합니다. 성급한 결정보다는 충분한 검토를 거쳐 진행하세요.

## 결론

${e}은 올바른 방법으로 접근한다면 분명 좋은 결과를 얻을 수 있는 분야입니다. 꾸준한 노력과 학습을 통해 원하는 목표를 달성하시기 바랍니다!

더 자세한 정보가 필요하시다면 전문가의 도움을 받는 것도 좋은 방법입니다. 성공적인 ${e} 여정을 응원합니다! ✨`};return e.includes("건강")||e.includes("다이어트")||e.includes("운동")||e.includes("홈트")?t["건강"]:e.includes("재테크")||e.includes("투자")||e.includes("돈")||e.includes("부동산")?t["재테크"]:t.default}let p=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/demo/generate/route",pathname:"/api/demo/generate",filename:"route",bundlePath:"app/api/demo/generate/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/blog/app/api/demo/generate/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:m,serverHooks:$}=p;function g(){return(0,a.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:m})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[4447,580,7932],()=>s(53037));module.exports=r})();