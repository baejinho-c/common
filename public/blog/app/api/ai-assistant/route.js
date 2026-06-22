(()=>{var e={};e.id=4055,e.ids=[4055],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},77508:(e,s,t)=>{"use strict";t.r(s),t.d(s,{patchFetch:()=>m,routeModule:()=>c,serverHooks:()=>x,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var r={};t.r(r),t.d(r,{POST:()=>u});var a=t(96559),n=t(48088),o=t(37719),i=t(32190),p=t(57932);async function u(e){try{let{message:s,context:t}=await e.json();if(!process.env.OPENAI_API_KEY)return i.NextResponse.json({success:!1,message:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let r=new p.Ay({apiKey:process.env.OPENAI_API_KEY}),a=`
당신은 블로그 작성을 도와주는 AI 어시스턴트입니다.
다음과 같은 도움을 제공할 수 있습니다:

1. 블로그 주제 추천
2. 제목 개선 제안
3. 콘텐츠 구조 조언
4. SEO 최적화 팁
5. 네이버 블로그 특화 조언

항상 친근하고 도움이 되는 톤으로 답변하며, 구체적이고 실용적인 조언을 제공하세요.
`,n=await r.chat.completions.create({model:"gpt-4o",messages:[{role:"system",content:a},{role:"user",content:`사용자 질문: ${s}

${t?`컨텍스트: ${t}`:""}`}],max_tokens:1e3}),o=n.choices[0]?.message?.content||"응답을 생성할 수 없습니다.";return i.NextResponse.json({success:!0,response:o})}catch(e){return console.error("AI 어시스턴트 오류:",e),i.NextResponse.json({success:!1,message:"AI 어시스턴트 응답에 실패했습니다."},{status:500})}}let c=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/ai-assistant/route",pathname:"/api/ai-assistant",filename:"route",bundlePath:"app/api/ai-assistant/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/blog/app/api/ai-assistant/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:x}=c;function m(){return(0,o.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}},78335:()=>{},96487:()=>{}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[4447,580,7932],()=>t(77508));module.exports=r})();