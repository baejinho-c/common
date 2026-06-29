(()=>{var e={};e.id=8052,e.ids=[8052],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},20913:(e,s,r)=>{"use strict";r.d(s,{o:()=>t});let t=process.env.BLOG_OPENAI_MODEL||process.env.RESTY_OPENAI_CHAT_MODEL||"gpt-4o-mini"},28230:(e,s,r)=>{"use strict";r.r(s),r.d(s,{patchFetch:()=>y,routeModule:()=>d,serverHooks:()=>m,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>x});var t={};r.r(t),r.d(t,{POST:()=>c});var o=r(96559),n=r(48088),a=r(37719),i=r(32190),u=r(57932),p=r(20913);async function c(e){try{let s;let{topic:r,targetAudience:t,contentType:o}=await e.json();if(!r)return i.NextResponse.json({success:!1,message:"주제가 필요합니다."},{status:400});if(!process.env.OPENAI_API_KEY)return i.NextResponse.json({success:!1,message:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let n=new u.Ay({apiKey:process.env.OPENAI_API_KEY}),a=`
다음 조건에 맞는 SEO 키워드를 추천해주세요:

주제: ${r}
${t?`타겟 독자: ${t}`:""}
${o?`콘텐츠 유형: ${o}`:""}

다음 형식으로 키워드를 분류해서 제안해주세요:

1. 주요 키워드 (Primary Keywords) - 3-5개
   - 검색량이 높고 경쟁도가 적당한 키워드

2. 롱테일 키워드 (Long-tail Keywords) - 5-8개
   - 구체적이고 의도가 명확한 키워드

3. 관련 키워드 (Related Keywords) - 5-7개
   - 주제와 관련된 보조 키워드

4. 질문형 키워드 (Question Keywords) - 3-5개
   - 사용자가 검색할 만한 질문들

각 키워드에 대해 예상 검색량과 경쟁도를 상/중/하로 표시해주세요.
JSON 형식으로 응답해주세요.
`,c=await n.chat.completions.create({model:p.o,messages:[{role:"user",content:a}],max_tokens:1200}),d=c.choices[0]?.message?.content||"";try{s=JSON.parse(d)}catch{s={primary:[r],longTail:[`${r} 방법`,`${r} 가이드`],related:[`${r} 팁`,`${r} 전략`],questions:[`${r}이란?`,`${r} 어떻게?`]}}return i.NextResponse.json({success:!0,keywords:s})}catch(e){return console.error("키워드 추천 오류:",e),i.NextResponse.json({success:!1,message:"키워드 추천에 실패했습니다."},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/seo/keywords/route",pathname:"/api/seo/keywords",filename:"route",bundlePath:"app/api/seo/keywords/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/blog/app/api/seo/keywords/route.ts",nextConfigOutput:"",userland:t}),{workAsyncStorage:l,workUnitAsyncStorage:x,serverHooks:m}=d;function y(){return(0,a.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:x})}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{}};var s=require("../../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[4447,580,7932],()=>r(28230));module.exports=t})();