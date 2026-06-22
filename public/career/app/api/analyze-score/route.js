"use strict";(()=>{var e={};e.id=297,e.ids=[297],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7568:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>C,patchFetch:()=>R,requestAsyncStorage:()=>S,routeModule:()=>p,serverHooks:()=>h,staticGenerationAsyncStorage:()=>m});var o={};t.r(o),t.d(o,{POST:()=>l});var a=t(3278),s=t(5002),n=t(4877),i=t(1309),c=t(4742),u=t(6123),d=t(3858);async function l(e){try{let{scores:r,grade:t,interests:o,goals:a}=await e.json();if(!r||!t)return i.NextResponse.json({error:"성적과 학년 정보가 필요합니다."},{status:400});if(!await (0,u.deductCredits)(u.CREDIT_COSTS.SCORE_ANALYSIS))return i.NextResponse.json({error:`크레딧이 부족합니다. 성적 분석에는 ${u.CREDIT_COSTS.SCORE_ANALYSIS} 크레딧이 필요합니다.`},{status:402});await (0,u.addCreditTransaction)("deduct",u.CREDIT_COSTS.SCORE_ANALYSIS,"성적 분석 및 진학 상담");let s=(await (0,d.recommendSchoolsByScore)({korean:r.korean,english:r.english,math:r.math,science:r.science,social:r.social,grade:t})).slice(0,5),n=s.map(e=>`- ${e.school.school_name_ko} (${e.school.sido_name}, ${e.school.hs_category_name||"일반고"})
  매칭도: ${e.matchScore.toFixed(1)}점, 요구점수: ${e.requiredScore}점
  평가: ${e.recommendation}`).join("\n\n"),l=`다음 성적 정보를 바탕으로 한국 교육 시스템에 맞는 상세한 성적 분석 및 진학 전략을 제공해주세요:

성적 정보:
- 국어: ${r.korean}점
- 영어: ${r.english}점  
- 수학: ${r.math}점
- 과학: ${r.science||"미응시"}점
- 사회: ${r.social||"미응시"}점
- 현재 학년: ${t}

관심 분야: ${o||"정보 없음"}
진로 목표: ${a||"정보 없음"}

추천 학교 목록:
${n}

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

구체적이고 실용적인 조언을 친근한 톤으로 제공해주세요. 특히 한국의 입시 현실을 반영한 실현 가능한 전략을 제시해주세요.`,p=await c.o4.generateContent(l),S=(await p.response).text();return i.NextResponse.json({success:!0,analysis:S,schoolRecommendations:s,creditsUsed:u.CREDIT_COSTS.SCORE_ANALYSIS})}catch(e){return console.error("Score analysis API error:",e),i.NextResponse.json({error:"성적 분석 중 오류가 발생했습니다."},{status:500})}}let p=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/analyze-score/route",pathname:"/api/analyze-score",filename:"route",bundlePath:"app/api/analyze-score/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/career/app/api/analyze-score/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:S,staticGenerationAsyncStorage:m,serverHooks:h}=p,C="/api/analyze-score/route";function R(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:m})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[379,833,540,228],()=>t(7568));module.exports=o})();