"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8048:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>A,requestAsyncStorage:()=>h,routeModule:()=>l,serverHooks:()=>_,staticGenerationAsyncStorage:()=>m});var a={};r.r(a),r.d(a,{POST:()=>d});var s=r(3278),n=r(5002),o=r(4877),i=r(1309),u=r(4742),p=r(6123),c=r(3858);async function d(e){try{let{messages:t,schoolId:r}=await e.json();if(!t||!Array.isArray(t))return i.NextResponse.json({error:"메시지가 필요합니다."},{status:400});let a=0;if(t.length>1){let e=r?p.CREDIT_COSTS.SCHOOL_CONSULTATION:p.CREDIT_COSTS.CHAT;if(!await (0,p.deductCredits)(e))return i.NextResponse.json({error:`크레딧이 부족합니다. ${r?"학교 상담":"일반 채팅"}에는 ${e} 크레딧이 필요합니다.`},{status:402});a=e;let t=r?`AI 진로 상담 (학교 연계)`:"AI 진로 상담";await (0,p.addCreditTransaction)("deduct",e,t)}let s="";if(r){let e=await (0,c.SV)(r);e&&(s=`

현재 상담 중인 학교 정보:
- 학교명: ${e.school_name_ko}
- 지역: ${e.sido_name} ${e.sigungu_name}
- 유형: ${e.school_type_name}
- 특성: ${e.hs_category_name||"일반고"}
- 설립구분: ${e.establish_type_name||"정보 없음"}
- 주소: ${e.road_address||"정보 없음"}

이 학교와 관련된 구체적인 진로 상담을 제공해주세요. 학교의 특성과 지역적 특징을 고려한 조언을 해주세요.

진학 관련 상담 시 다음 사항을 포함해주세요:
- 해당 학교 진학을 위한 구체적인 성적 기준 (내신 등급, 수능 점수)
- 학교 특성에 맞는 준비 방법
- 졸업 후 진로 및 대학 진학 현황
- 지역 내 교육 환경 및 학원가 정보`)}let n=t.map(e=>`${"user"===e.role?"사용자":"AI 상담사"}: ${e.content}`).join("\n"),o=`당신은 한국의 교육 시스템을 잘 아는 전문적인 진로 상담사입니다. 사용자의 진로 고민에 대해 친근하고 도움이 되는 조언을 제공해주세요. 

상담 원칙:
- 구체적이고 실용적인 조언을 하되, 따뜻하고 격려하는 톤으로 답변
- 한국의 교육 시스템과 지역 특성을 잘 이해하고 현실적인 조언 제공
- 학생의 개별 상황과 관심사를 고려한 맞춤형 상담
- 단순한 정보 제공보다는 실행 가능한 구체적인 방법 제시
- 한국어로 자연스럽게 답변

진로 상담 시 포함할 내용:
- 구체적인 성적 목표 (내신 등급, 수능 점수대)
- 단계별 학습 계획 및 실행 방법
- 관련 자격증 및 활동 추천
- 대학 진학 전략 (수시/정시, 학과 선택)
- 취업 시장 현황 및 전망
- 예상 연봉 및 경력 개발 경로

${s}

이전 대화 내용:
${n}

AI 상담사:`,d=await u.o4.generateContent(o),l=(await d.response).text();return i.NextResponse.json({success:!0,content:l,creditsUsed:a})}catch(e){return console.error("Chat API error:",e),i.NextResponse.json({error:"채팅 중 오류가 발생했습니다."},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/career/app/api/chat/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:h,staticGenerationAsyncStorage:m,serverHooks:_}=l,x="/api/chat/route";function A(){return(0,o.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:m})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[379,833,540,228],()=>r(8048));module.exports=a})();