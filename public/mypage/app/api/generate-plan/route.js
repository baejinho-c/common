"use strict";(()=>{var e={};e.id=790,e.ids=[790],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},7650:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>P,patchFetch:()=>x,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>g});var n={};t.r(n),t.d(n,{POST:()=>l});var o=t(3278),a=t(5002),s=t(4877),i=t(1309),p=t(1173),u=t(1584);async function l(e){try{let{description:r,businessType:t,targetAudience:n,style:o,features:a}=await e.json(),s=process.env.OPEN_API_KEY||process.env.OPENAI_API_KEY;if(!s)return i.NextResponse.json({error:"OpenAI API key not configured"},{status:500});let l=`
당신은 전문 웹 기획자입니다. 다음 정보를 바탕으로 실무에서 사용할 수 있는 상세한 웹사이트 기획서를 작성해주세요:

📋 프로젝트 정보:
• 비즈니스 설명: ${r}
• 비즈니스 유형: ${t}
• 타겟 고객: ${n}
• 원하는 스타일: ${o}
• 필요한 기능: ${a?.join(", ")||"기본 기능"}

📝 다음 형식으로 전문적인 기획서를 작성해주세요:

## 1. 프로젝트 개요
- 비즈니스 목표와 핵심 가치 제안
- 웹사이트의 주요 목적과 기대 효과

## 2. 타겟 사용자 분석
- 주요 타겟 그룹별 특성
- 사용자 니즈와 행동 패턴
- 사용자 여정(User Journey) 요약

## 3. 디자인 시스템
- 브랜드 컬러 팔레트 (Primary, Secondary, Accent 색상 코드)
- 타이포그래피 (헤딩, 본문 폰트 추천)
- UI 컴포넌트 스타일 가이드
- 반응형 디자인 브레이크포인트

## 4. 사이트 구조 및 섹션별 계획
각 섹션별로:
- 섹션명과 목적
- 핵심 메시지와 콘텐츠 방향
- 필요한 UI 요소들
- CTA(Call-to-Action) 전략

## 5. 기능 명세서
- 필수 기능 (High Priority)
- 권장 기능 (Medium Priority)  
- 향후 확장 기능 (Low Priority)
- 각 기능별 구현 방법 제안

## 6. SEO 및 성능 최적화
- 메타 태그 전략
- 키워드 추천
- 성능 최적화 방안

## 7. 다음 단계 로드맵
- 개발 우선순위
- 예상 개발 기간
- 런칭 후 개선 계획

실무진이 바로 사용할 수 있도록 구체적이고 실행 가능한 내용으로 작성해주세요.
`,{text:c}=await (0,p._4)({model:(0,u.fr)("gpt-4o-mini",{apiKey:s}),prompt:l,temperature:.7,maxTokens:2e3});return i.NextResponse.json({plan:c})}catch(e){return console.error("Plan generation error:",e),i.NextResponse.json({error:"Failed to generate plan"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/generate-plan/route",pathname:"/api/generate-plan",filename:"route",bundlePath:"app/api/generate-plan/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mypage/app/api/generate-plan/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:d,staticGenerationAsyncStorage:g,serverHooks:m}=c,P="/api/generate-plan/route";function x(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:g})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[379,698],()=>t(7650));module.exports=n})();