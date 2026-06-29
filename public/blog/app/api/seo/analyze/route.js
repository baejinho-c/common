(()=>{var e={};e.id=3816,e.ids=[3816],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},20913:(e,s,t)=>{"use strict";t.d(s,{o:()=>r});let r=process.env.BLOG_OPENAI_MODEL||process.env.RESTY_OPENAI_CHAT_MODEL||"gpt-4o-mini"},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},36713:(e,s,t)=>{"use strict";t.r(s),t.d(s,{patchFetch:()=>O,routeModule:()=>d,serverHooks:()=>x,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>m});var r={};t.r(r),t.d(r,{POST:()=>c});var o=t(96559),n=t(48088),a=t(37719),i=t(32190),u=t(57932),p=t(20913);async function c(e){try{let s;let{content:t,targetKeywords:r}=await e.json();if(!t)return i.NextResponse.json({success:!1,message:"분석할 콘텐츠가 필요합니다."},{status:400});if(!process.env.OPENAI_API_KEY)return i.NextResponse.json({success:!1,message:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let o=new u.Ay({apiKey:process.env.OPENAI_API_KEY}),n=`
다음 블로그 콘텐츠의 SEO를 분석하고 개선 방안을 제시해주세요:

콘텐츠:
${t}

${r?`타겟 키워드: ${r.join(", ")}`:""}

다음 항목들을 분석해주세요:
1. 키워드 밀도 및 분포
2. 제목 및 소제목 최적화
3. 메타 설명 제안
4. 내부/외부 링크 기회
5. 콘텐츠 구조 개선점
6. 검색 의도 부합성
7. 전체 SEO 점수 (100점 만점)

JSON 형식으로 응답해주세요.
`,a=await o.chat.completions.create({model:p.o,messages:[{role:"user",content:n}],max_tokens:1500}),c=a.choices[0]?.message?.content||"";try{s=JSON.parse(c)}catch{s={score:75,summary:c,recommendations:["AI 분석 결과를 확인하세요."]}}return i.NextResponse.json({success:!0,analysis:s})}catch(e){return console.error("SEO 분석 오류:",e),i.NextResponse.json({success:!1,message:"SEO 분석에 실패했습니다."},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/seo/analyze/route",pathname:"/api/seo/analyze",filename:"route",bundlePath:"app/api/seo/analyze/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/blog/app/api/seo/analyze/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:l,workUnitAsyncStorage:m,serverHooks:x}=d;function O(){return(0,a.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:m})}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{}};var s=require("../../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[4447,580,7932],()=>t(36713));module.exports=r})();