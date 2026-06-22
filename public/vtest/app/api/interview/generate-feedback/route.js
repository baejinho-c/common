(()=>{var e={};e.id=461,e.ids=[461],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1820:e=>{"use strict";e.exports=require("os")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},4368:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>g,routeModule:()=>d,serverHooks:()=>x,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>m});var s={};t.r(s),t.d(s,{POST:()=>u});var a=t(6559),o=t(8088),n=t(7719),i=t(2190),p=t(9239);let c=(0,t(1248).ry)({apiKey:process.env.OPEN_AI_KEY});async function u(e){try{let{messages:r,config:t,duration:s,questionsAnswered:a}=await e.json(),o=r.filter(e=>"user"===e.type).map(e=>e.analysis?.score||3),n=o.reduce((e,r)=>e+r,0)/o.length,u=r.map(e=>`${"interviewer"===e.type?"면접관":"지원자"}: ${e.content}`).join("\n"),d=`다음은 ${t.jobCategory} 직군 ${t.difficulty} 수준의 모의면접 결과입니다.

면접 정보:
- 직군: ${t.jobCategory}
- 난이도: ${t.difficulty}
- 면접관 스타일: ${t.persona}
- 진행 시간: ${Math.floor(s/60)}분 ${s%60}초
- 답변한 질문 수: ${a}개
- 개별 답변 평균 점수: ${n.toFixed(1)}/5

면접 대화 내용:
${u}

다음 형식으로 종합적인 피드백을 제공해주세요 (JSON 형식):

{
  "overallScore": 전체 점수 (1-5),
  "overallGrade": "등급 (A+, A, B+, B, C+, C, D)",
  "summary": "전체적인 면접 평가 요약 (2-3문장)",
  "strengths": [
    "구체적인 강점 1",
    "구체적인 강점 2",
    "구체적인 강점 3"
  ],
  "improvements": [
    "개선점 1과 구체적인 방법",
    "개선점 2와 구체적인 방법",
    "개선점 3과 구체적인 방법"
  ],
  "categoryScores": {
    "communication": 의사소통 점수 (1-5),
    "technical": 전문성 점수 (1-5),
    "problemSolving": 문제해결 점수 (1-5),
    "teamwork": 협업능력 점수 (1-5),
    "leadership": 리더십 점수 (1-5)
  },
  "starMethodUsage": {
    "used": STAR 기법 사용 여부 (boolean),
    "examples": STAR 기법을 사용한 답변 수,
    "feedback": "STAR 기법 사용에 대한 피드백"
  },
  "recommendations": [
    "다음 면접을 위한 구체적인 추천사항 1",
    "다음 면접을 위한 구체적인 추천사항 2",
    "다음 면접을 위한 구체적인 추천사항 3"
  ],
  "nextSteps": [
    "학습할 주제나 기술 1",
    "연습할 면접 유형 2",
    "개선할 소프트 스킬 3"
  ]
}

모든 피드백은 한국어로 작성하고, 건설적이고 격려적인 톤을 유지해주세요.`,{text:l}=await (0,p.Df)({model:c("gpt-4o"),prompt:d,temperature:.3,maxTokens:1500}),m=function(e){let r=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/);return r?r[1].trim():e.trim()}(l),x=JSON.parse(m);return i.NextResponse.json(x)}catch(e){return console.error("Error generating feedback:",e),i.NextResponse.json({overallScore:3,overallGrade:"B",summary:"피드백 생성 중 오류가 발생했습니다. 전반적으로 성실하게 답변해주셨습니다.",strengths:["성실한 답변","적극적인 참여","시간 준수"],improvements:["더 구체적인 사례 제시","논리적 구조화","자신감 있는 표현"],categoryScores:{communication:3,technical:3,problemSolving:3,teamwork:3,leadership:3},starMethodUsage:{used:!1,examples:0,feedback:"STAR 기법을 활용한 답변 구조화를 연습해보세요."},recommendations:["구체적인 경험 사례 준비","STAR 기법 연습","모의면접 반복 연습"],nextSteps:["면접 예상 질문 리스트 작성","경험 사례 정리","발표 연습"]},{status:200})}}let d=new a.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/interview/generate-feedback/route",pathname:"/api/interview/generate-feedback",filename:"route",bundlePath:"app/api/interview/generate-feedback/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/vtest/app/api/interview/generate-feedback/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:m,serverHooks:x}=d;function g(){return(0,n.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:m})}},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9021:e=>{"use strict";e.exports=require("fs")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[447,580,866],()=>t(4368));module.exports=s})();