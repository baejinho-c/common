"use strict";(()=>{var e={};e.id=297,e.ids=[297],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7568:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>A,patchFetch:()=>f,requestAsyncStorage:()=>m,routeModule:()=>l,serverHooks:()=>S,staticGenerationAsyncStorage:()=>h});var a={};n.r(a),n.d(a,{POST:()=>d});var r=n(3278),o=n(5002),s=n(4877),i=n(1309),c=n(4742),u=n(6123),p=n(3858);async function d(e){try{let{scores:t,grade:n,interests:a,goals:r}=await e.json();if(!t||!n)return i.NextResponse.json({error:"성적과 학년 정보가 필요합니다."},{status:400});if(!await (0,u.dp)(u.xf.SCORE_ANALYSIS))return i.NextResponse.json({error:`크레딧이 부족합니다. 성적 분석에는 ${u.xf.SCORE_ANALYSIS} 크레딧이 필요합니다.`},{status:402});await (0,u.Zg)("deduct",u.xf.SCORE_ANALYSIS,"성적 분석 및 진학 상담");let o=(await (0,p.sM)({korean:t.korean,english:t.english,math:t.math,science:t.science,social:t.social,grade:n})).slice(0,5),s=o.map(e=>`- ${e.school.school_name_ko} (${e.school.sido_name}, ${e.school.hs_category_name||"일반고"})
  매칭도: ${e.matchScore.toFixed(1)}점, 요구점수: ${e.requiredScore}점
  평가: ${e.recommendation}`).join("\n\n"),d=`다음 성적 정보를 바탕으로 한국 교육 시스템에 맞는 상세한 성적 분석 및 진학 전략을 제공해주세요:

성적 정보:
- 국어: ${t.korean}점
- 영어: ${t.english}점  
- 수학: ${t.math}점
- 과학: ${t.science||"미응시"}점
- 사회: ${t.social||"미응시"}점
- 현재 학년: ${n}

관심 분야: ${a||"정보 없음"}
진로 목표: ${r||"정보 없음"}

추천 학교 목록:
${s}

다음 구조로 상세한 분석을 제공해주세요:

## 📊 현재 성적 분석
- 전체적인 성적 수준 평가 (상/중상/중/중하/하)
- 과목별 강점과 약점 분석
- 전국 백분위 추정 및 내신 등급 예상

## 🎯 맞춤 학교 추천
- 안정권 학교 (3-5개)
- 적정권 학교 (3-5개)  
- 도전권 학교 (2-3개)
- 각 학교별 합격 가능성 및 필요 점수

## 📈 성적 향상 전략
- 우선 개선해야 할 과목 (구체적인 목표 점수)
- 과목별 학습 방법 및 시간 배분
- 단기(1-3개월), 중기(3-6개월) 목표 설정

## 🏫 진학 전략
- 내신 관리 방법 (목표 등급)
- 수능 준비 전략 (목표 점수대)
- 학생부종합전형 vs 정시 선택 가이드
- 지원 전략 (수시 6장, 정시 3장 활용법)

## 💼 진로 연계 분석
- 현재 성적으로 가능한 대학 및 학과
- 목표 진로를 위한 필요 성적
- 관련 자격증 및 활동 추천

## 📚 구체적 실행 계획
- 이번 달 학습 계획
- 다음 시험까지의 목표
- 성적 향상을 위한 구체적 방법

## 🔢 한국 교육 현실 반영
- 현재 성적의 전국 위치 (상위 몇 %)
- SKY, 주요 대학 진학 가능성
- 지역별 교육 환경 고려사항
- 예상 내신 등급 및 수능 등급

구체적이고 실용적인 조언을 친근한 톤으로 제공해주세요. 특히 한국의 입시 현실을 반영한 실현 가능한 전략을 제시해주세요.`,l=await c.o4.generateContent(d),m=(await l.response).text();return i.NextResponse.json({success:!0,analysis:m,schoolRecommendations:o,creditsUsed:u.xf.SCORE_ANALYSIS})}catch(e){return console.error("Score analysis API error:",e),i.NextResponse.json({error:"성적 분석 중 오류가 발생했습니다."},{status:500})}}let l=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/analyze-score/route",pathname:"/api/analyze-score",filename:"route",bundlePath:"app/api/analyze-score/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/career/app/api/analyze-score/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:S}=l,A="/api/analyze-score/route";function f(){return(0,s.patchFetch)({serverHooks:S,staticGenerationAsyncStorage:h})}},4742:(e,t,n)=>{n.d(t,{o4:()=>o});var a=n(1540);let r=process.env.GOOGLE_GENERATIVE_AI_API_KEY||"build-placeholder",o=new a.$D(r).getGenerativeModel({model:"gemini-2.5-flash-lite"})},6123:(e,t,n)=>{n.d(t,{Bg:()=>s,Jh:()=>o,Zg:()=>p,dp:()=>u,xf:()=>c});let a=100,r=[{id:"1",amount:100,type:"earn",description:"회원가입 보너스",timestamp:new Date(Date.now()-864e5)}];async function o(){return a}async function s(e,t){return!(a<e)&&(a-=e,r.unshift({id:Date.now().toString(),amount:-e,type:"spend",description:t,timestamp:new Date}),!0)}async function i(e,t){a+=e,r.unshift({id:Date.now().toString(),amount:e,type:"earn",description:t,timestamp:new Date})}let c={CHAT:10,SCHOOL_CONSULTATION:15,SCORE_ANALYSIS:20,GOAL_ANALYSIS:30};async function u(e){return s(e,"서비스 이용")}async function p(e,t,n){if("deduct"===e){await s(t,n);return}await i(t,n)}}};var t=require("../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),a=t.X(0,[379,833,540,858],()=>n(7568));module.exports=a})();