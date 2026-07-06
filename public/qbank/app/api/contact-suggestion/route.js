"use strict";(()=>{var e={};e.id=967,e.ids=[967],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},11905:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>w,patchFetch:()=>y,requestAsyncStorage:()=>h,routeModule:()=>m,serverHooks:()=>x,staticGenerationAsyncStorage:()=>f});var n={};s.r(n),s.d(n,{GET:()=>d,POST:()=>g});var r=s(73278),o=s(45002),a=s(54877),i=s(71309),u=s(21173),c=s(46914);let p={technical:{name:"기술 문제",keywords:["오류","버그","작동","안됨","느림","로딩","접속","로그인","회원가입","비밀번호"],autoResponse:`기술적인 문제로 문의해주셔서 감사합니다.

다음 단계를 먼저 시도해보시기 바랍니다:
1. 브라우저 새로고침 (Ctrl+F5 또는 Cmd+R)
2. 브라우저 캐시 및 쿠키 삭제
3. 다른 브라우저에서 접속 시도
4. 인터넷 연결 상태 확인

위 방법으로 해결되지 않으면 다음 정보와 함께 다시 문의해주세요:
- 사용 중인 브라우저 및 버전
- 운영체제 정보
- 오류 메시지 스크린샷
- 문제 발생 시점

빠른 시일 내에 해결해드리겠습니다.`},account:{name:"계정 관련",keywords:["계정","아이디","비밀번호","로그인","회원가입","탈퇴","정보수정","인증"],autoResponse:`계정 관련 문의해주셔서 감사합니다.

계정 문제 해결 방법:

**로그인 문제:**
- 비밀번호 찾기 기능을 이용해보세요
- 이메일 주소가 정확한지 확인해주세요
- 대소문자를 구분하여 입력해주세요

**회원가입 문제:**
- 이미 가입된 이메일인지 확인해주세요
- 이메일 인증 메일을 확인해주세요 (스팸함 포함)

**계정 정보 수정:**
- 로그인 후 프로필 페이지에서 수정 가능합니다

추가 도움이 필요하시면 언제든 문의해주세요.`},billing:{name:"결제/크레딧",keywords:["결제","크레딧","충전","환불","요금","구독","카드","영수증","취소"],autoResponse:`결제 및 크레딧 관련 문의해주셔서 감사합니다.

**크레딧 충전:**
- 신용카드, 휴대폰 결제, 계좌이체 지원
- 충전 후 즉시 반영됩니다
- 보너스 크레딧 이벤트를 확인해보세요

**환불 정책:**
- 미사용 크레딧은 구매일로부터 30일 이내 환불 가능
- 환불 신청 시 영수증 또는 거래내역 필요

**결제 문제:**
- 카드 정보를 다시 확인해주세요
- 결제 한도를 확인해주세요
- 다른 결제 수단을 시도해보세요

구체적인 결제 문제는 거래내역과 함께 문의해주시면 빠르게 도와드리겠습니다.`},feature:{name:"기능 문의",keywords:["기능","사용법","문제생성","풀이","해설","저장","공유","인쇄"],autoResponse:`기능 관련 문의해주셔서 감사합니다.

**주요 기능 안내:**

**문제 생성:**
- AI가 맞춤형 문제를 생성합니다
- 과목, 학년, 난이도 선택 가능
- 특정 주제 지정 가능

**문제 풀이:**
- 즉시 채점 및 해설 제공
- 오답 분석 및 학습 가이드
- 진도 추적 기능

**학습 관리:**
- 학습 이력 저장
- 성취도 분석
- 맞춤 학습 추천

**공유 기능:**
- 문제 세트 공유
- 학습 결과 공유
- 그룹 학습 지원

더 자세한 사용법은 도움말 페이지를 참고하시거나 언제든 문의해주세요.`},general:{name:"일반 문의",keywords:["안녕","문의","질문","도움","서비스","이용","가입","추천"],autoResponse:`문의해주셔서 감사합니다.

**MyQBank 서비스 소개:**
AI 기반 맞춤형 문제 은행 서비스로, 학습자의 수준에 맞는 문제를 생성하고 체계적인 학습을 지원합니다.

**주요 특징:**
- 🤖 AI 맞춤형 문제 생성
- 📊 학습 진도 관리
- 💡 상세한 해설 제공
- 📱 모든 기기에서 접속 가능

**이용 방법:**
1. 회원가입 또는 데모 체험
2. 원하는 과목과 난이도 선택
3. AI가 생성한 문제로 학습
4. 결과 분석 및 복습

궁금한 점이 있으시면 언제든 문의해주세요. 최선을 다해 도와드리겠습니다.`}};async function l(e,t){try{if(!process.env.OPENAI_API_KEY)return p[t]?.autoResponse||p.general.autoResponse;let s=p[t],n=`
당신은 MyQBank AI 문제 은행 서비스의 고객 지원 담당자입니다.

고객 문의: "${e}"
문의 카테고리: ${s.name}

다음 가이드라인을 따라 친절하고 도움이 되는 응답을 작성해주세요:

1. 정중하고 친근한 톤으로 응답
2. 구체적이고 실용적인 해결책 제시
3. 필요시 단계별 안내 제공
4. 추가 도움이 필요한 경우 연락 방법 안내
5. 200자 이내로 간결하게 작성

응답:
`;return(await (0,u._4)({model:(0,c.fr)("gpt-4o-mini"),prompt:n,temperature:.7,maxTokens:300})).text.trim()}catch(e){return console.error("AI 응답 생성 오류:",e),p[t]?.autoResponse||p.general.autoResponse}}async function g(e){try{let{message:t,userInfo:s}=await e.json();if(!t||0===t.trim().length)return i.NextResponse.json({success:!1,error:"문의 내용을 입력해주세요."},{status:400});if(t.length>1e3)return i.NextResponse.json({success:!1,error:"문의 내용은 1000자 이내로 입력해주세요."},{status:400});let n=function(e){let t=e.toLowerCase(),s=0,n="general";for(let[e,r]of Object.entries(p)){let o=0;for(let e of r.keywords)t.includes(e)&&(o+=1);o>s&&(s=o,n=e)}return n}(t),r=function(e){let t=e.toLowerCase(),s=["긴급","급함","빨리","즉시","안됨","오류","문제","도움"].filter(e=>t.includes(e)).length;return s>=3?"high":s>=1?"medium":"low"}(t),o=function(e){let t=e.toLowerCase(),s=["좋다","만족","감사","훌륭","최고","추천","도움"].filter(e=>t.includes(e)).length,n=["나쁘다","불만","화나다","짜증","실망","문제","오류"].filter(e=>t.includes(e)).length;return s>n?"positive":n>s?"negative":"neutral"}(t),a=await l(t,n),u=`INQ-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,c={success:!0,inquiryId:u,category:p[n].name,urgency:r,sentiment:o,aiResponse:a,estimatedResponseTime:"high"===r?"1시간 이내":"medium"===r?"4시간 이내":"24시간 이내",suggestions:[{title:"자주 묻는 질문",description:"FAQ 페이지에서 더 많은 정보를 확인하세요",link:"/faq"},{title:"사용 가이드",description:"서비스 이용 방법을 자세히 알아보세요",link:"/guide"},{title:"실시간 채팅",description:"즉시 도움이 필요하시면 채팅으로 문의하세요",action:"open_chat"}],metadata:{processedAt:new Date().toISOString(),userAgent:e.headers.get("user-agent"),userInfo:s||null}};return"high"===r&&console.log(`긴급 문의 접수: ${u}`),i.NextResponse.json(c)}catch(e){return console.error("문의 처리 API 오류:",e),i.NextResponse.json({success:!1,error:"문의 처리 중 오류가 발생했습니다.",details:e instanceof Error?e.message:"알 수 없는 오류"},{status:500})}}async function d(){return i.NextResponse.json({success:!0,message:"문의 지원 API가 정상 작동 중입니다.",categories:Object.entries(p).map(([e,t])=>({id:e,name:t.name,keywords:t.keywords})),features:["자동 카테고리 분류","AI 기반 응답 생성","긴급도 자동 판단","감정 분석","맞춤형 해결책 제시"],supportedLanguages:["한국어"],maxMessageLength:1e3})}let m=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/contact-suggestion/route",pathname:"/api/contact-suggestion",filename:"route",bundlePath:"app/api/contact-suggestion/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/qbank/app/api/contact-suggestion/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:h,staticGenerationAsyncStorage:f,serverHooks:x}=m,w="/api/contact-suggestion/route";function y(){return(0,a.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:f})}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),n=t.X(0,[9379,4833,4476],()=>s(11905));module.exports=n})();