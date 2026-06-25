(()=>{var e={};e.id=276,e.ids=[276],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74873:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>l,routeModule:()=>p,serverHooks:()=>d,workAsyncStorage:()=>u,workUnitAsyncStorage:()=>c});var s={};r.r(s),r.d(s,{POST:()=>i});var o=r(96559),n=r(48088),a=r(37719);async function i(e){try{let{message:t,type:r}=await e.json(),s=`당신은 "천하제일미식록"이라는 무협지 컨셉의 음식 평론 SNS 서비스의 고객 지원 AI입니다.

서비스 특징:
- 무협지 컨셉의 음식 평론 소셜 네트워크
- 현재 베타 데모 버전으로 운영 중
- AI 기반 평론 작성 도구 제공
- 랭킹 시스템과 크레딧 보상 시스템
- 전국 맛집 지도 기능

응답 가이드라인:
1. 친근하고 도움이 되는 톤으로 답변
2. 현재 데모 서비스임을 자연스럽게 언급
3. 사용자 피드백을 적극 수렴한다는 점 강조
4. 무협지 컨셉을 살린 재미있는 표현 사용 (⚔️, 🥷 등)
5. 기술적 문제는 개발팀에 전달하겠다고 안내

현재 접속 중인 서브도메인: ${r||"foodsns"}`;try{let e=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:`${s}

사용자 질문: ${t}`}]}],generationConfig:{maxOutputTokens:500,temperature:.7}})});if(e.ok){let t=(await e.json()).candidates[0].content.parts[0].text;return Response.json({success:!0,response:t})}throw Error("Gemini API failed")}catch(r){console.error("Gemini API Error:",r);let e=["안녕하세요! 천하제일미식록에 오신 것을 환영합니다! ⚔️ 현재 베타 데모 서비스로 운영 중이며, 여러분의 소중한 피드백을 기다리고 있습니다.","무림의 고수님, 문의사항이 있으시군요! \uD83E\uDD77 저희 서비스는 아직 데모 단계라 완벽하지 않을 수 있습니다. 개선사항이 있다면 언제든 말씀해주세요!","천하제일미식록의 AI 비서입니다! ⚔️ 현재 베타 테스트 중인 서비스로, 사용자분들의 의견을 적극 수렴하고 있습니다. 어떤 도움이 필요하신가요?"],t=e[Math.floor(Math.random()*e.length)];return Response.json({success:!0,response:t})}}catch(e){return console.error("Chat API Error:",e),Response.json({success:!1,response:"죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. \uD83D\uDE4F"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/foodsns/app/api/chat/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:u,workUnitAsyncStorage:c,serverHooks:d}=p;function l(){return(0,a.patchFetch)({workAsyncStorage:u,workUnitAsyncStorage:c})}},78335:()=>{},96487:()=>{},96559:(e,t,r)=>{"use strict";e.exports=r(44870)}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[719],()=>r(74873));module.exports=s})();