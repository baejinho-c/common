(()=>{var e={};e.id=276,e.ids=[276],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},6559:(e,t,r)=>{"use strict";e.exports=r(4870)},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9527:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>u,serverHooks:()=>l,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>d});var n={};r.r(n),r.d(n,{POST:()=>p});var s=r(6559),o=r(8088),a=r(7719),i=r(7449);async function p(e){try{let{messages:t}=await e.json(),r=process.env.GEMINI_API_KEY;if(!r)return new Response(JSON.stringify({error:"GEMINI_API_KEY가 설정되지 않았습니다."}),{status:500,headers:{"Content-Type":"application/json"}});let n=new i.ij(r).getGenerativeModel({model:"gemini-pro"}),s=`당신은 ResumeCraft 플랫폼의 AI 어시스턴트입니다. 
      
주요 역할:
- 이력서 작성 및 최적화에 대한 전문적인 조언 제공
- 취업 준비와 커리어 개발에 대한 가이드 제공
- 플랫폼 사용법 안내 및 기술 지원
- 친근하고 전문적인 톤으로 한국어로 응답

중요 사항:
- 이 서비스는 데모 버전입니다
- 실제 이력서 분석을 위해서는 파일 업로드 기능을 이용해주세요
- 개인정보는 안전하게 보호됩니다
- 궁금한 점이 있으면 언제든 문의해주세요

응답 스타일:
- 간결하고 명확한 설명
- 실용적인 조언 제공
- 이모지 적절히 사용 (😊, 📝, 💡 등)
- 존댓말 사용`,o=t[t.length-1],a=o?.content||"",p=t.slice(-5).map(e=>`${e.role}: ${e.content}`).join("\n"),u=`${s}

이전 대화:
${p}

사용자 질문: ${a}

위 내용을 바탕으로 도움이 되는 답변을 제공해주세요.`,c=await n.generateContent(u),d=(await c.response).text();return new Response(d,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}catch(e){return console.error("Chat API Error:",e),new Response(JSON.stringify({error:"AI 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}),{status:500,headers:{"Content-Type":"application/json"}})}}let u=new s.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/resume/app/api/chat/route.ts",nextConfigOutput:"",userland:n}),{workAsyncStorage:c,workUnitAsyncStorage:d,serverHooks:l}=u;function h(){return(0,a.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:d})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[100,449],()=>r(9527));module.exports=n})();