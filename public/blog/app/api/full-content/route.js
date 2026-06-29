(()=>{var e={};e.id=9129,e.ids=[9129],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},20913:(e,t,s)=>{"use strict";s.d(t,{o:()=>r});let r=process.env.BLOG_OPENAI_MODEL||process.env.RESTY_OPENAI_CHAT_MODEL||"gpt-4o-mini"},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},95627:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>v,routeModule:()=>l,serverHooks:()=>m,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>x});var r={};s.r(r),s.d(r,{POST:()=>c});var n=s(96559),o=s(48088),a=s(37719),u=s(32190),i=s(57932),p=s(20913);async function c(e){try{let{outline:t,tone:s,length:r}=await e.json();if(!process.env.OPENAI_API_KEY)return u.NextResponse.json({success:!1,message:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let n=new i.Ay({apiKey:process.env.OPENAI_API_KEY}),o=`
다음 개요를 바탕으로 완전한 블로그 포스트를 작성해주세요:

개요:
${t}

작성 조건:
- 톤: ${s||"친근하고 전문적인"}
- 길이: ${r||"중간"} (약 1000-1500자)
- 네이버 블로그에 적합한 형식
- SEO를 고려한 키워드 자연스러운 배치
- 읽기 쉬운 문단 구성

HTML 태그 없이 순수 텍스트로 작성해주세요.
`,a=await n.chat.completions.create({model:p.o,messages:[{role:"user",content:o}],max_tokens:2e3}),c=a.choices[0]?.message?.content||"";return u.NextResponse.json({success:!0,content:c})}catch(e){return console.error("콘텐츠 생성 오류:",e),u.NextResponse.json({success:!1,message:"콘텐츠 생성에 실패했습니다."},{status:500})}}let l=new n.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/full-content/route",pathname:"/api/full-content",filename:"route",bundlePath:"app/api/full-content/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/blog/app/api/full-content/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:x,serverHooks:m}=l;function v(){return(0,a.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:x})}},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[4447,580,7932],()=>s(95627));module.exports=r})();