"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},18048:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>f,patchFetch:()=>g,requestAsyncStorage:()=>m,routeModule:()=>l,serverHooks:()=>h,staticGenerationAsyncStorage:()=>A});var r={};n.r(r),n.d(r,{POST:()=>d});var a=n(73278),o=n(45002),s=n(54877),i=n(71309),u=n(44742),p=n(97758),c=n(43858);async function d(e){try{let{messages:t,schoolId:n}=await e.json();if(!t||!Array.isArray(t))return i.NextResponse.json({error:"메시지가 필요합니다."},{status:400});let r=0;if(t.length>1){let e=n?p.xf.SCHOOL_CONSULTATION:p.xf.CHAT;if(!await (0,p.dp)(e))return i.NextResponse.json({error:`크레딧이 부족합니다. ${n?"학교 상담":"일반 채팅"}에는 ${e} 크레딧이 필요합니다.`},{status:402});r=e;let t=n?`AI 진로 상담 (학교 연계)`:"AI 진로 상담";await (0,p.Zg)("deduct",e,t)}let a="";if(n){let e=await (0,c.SV)(n);e&&(a=`

현재 상담 중인 학교 정보:
- 학교명: ${e.name}
- 지역: ${e.region}
- 유형: ${e.type}

이 학교와 관련된 구체적인 진로 상담을 제공해주세요.

진학 관련 상담 시 다음 사항을 포함해주세요:
- 해당 학교 진학을 위한 구체적인 성적 기준
- 학교 특성에 맞는 준비 방법
- 졸업 후 진로 및 대학 진학 현황`)}let o=t.map(e=>`${"user"===e.role?"사용자":"AI 상담사"}: ${e.content}`).join("\n"),s=`당신은 한국의 교육 시스템을 잘 아는 전문적인 진로 상담사입니다. 사용자의 진로 고민에 대해 친근하고 도움이 되는 조언을 제공해주세요. 

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

${a}

이전 대화 내용:
${o}

AI 상담사:`,d=await u.o4.generateContent(s),l=(await d.response).text();return i.NextResponse.json({success:!0,content:l,creditsUsed:r})}catch(e){return console.error("Chat API error:",e),i.NextResponse.json({error:"채팅 중 오류가 발생했습니다."},{status:500})}}let l=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/career/app/api/chat/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:A,serverHooks:h}=l,f="/api/chat/route";function g(){return(0,s.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:A})}},44742:(e,t,n)=>{n.d(t,{o4:()=>o});var r=n(11540);let a=process.env.GOOGLE_GENERATIVE_AI_API_KEY||"build-placeholder",o=new r.$D(a).getGenerativeModel({model:"gemini-2.5-flash-lite"})},97758:(e,t,n)=>{n.d(t,{Bg:()=>s,Jh:()=>o,Zg:()=>c,dp:()=>p,xf:()=>u});let r=100,a=[{id:"1",amount:100,type:"earn",description:"회원가입 보너스",timestamp:new Date(Date.now()-864e5)}];async function o(){return r}async function s(e,t){return!(r<e)&&(r-=e,a.unshift({id:Date.now().toString(),amount:-e,type:"spend",description:t,timestamp:new Date}),!0)}async function i(e,t){r+=e,a.unshift({id:Date.now().toString(),amount:e,type:"earn",description:t,timestamp:new Date})}let u={CHAT:10,SCHOOL_CONSULTATION:15,SCORE_ANALYSIS:20,GOAL_ANALYSIS:30};async function p(e){return s(e,"서비스 이용")}async function c(e,t,n){if("deduct"===e){await s(t,n);return}await i(t,n)}}};var t=require("../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[9379,4833,1540,3858],()=>n(18048));module.exports=r})();