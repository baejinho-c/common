(()=>{var e={};e.id=318,e.ids=[318],e.modules={3435:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>l,routeModule:()=>p,serverHooks:()=>d,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>u});var n={};r.r(n),r.d(n,{POST:()=>i});var o=r(96559),s=r(48088),a=r(37719);async function i(e){try{let{chapterTitle:t,chapterSections:r,bookContext:n,targetAudience:o,tone:s,chapterNumber:a,totalChapters:i}=await e.json();if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API key not configured"},{status:500});let p=`
당신은 전문적인 전자책 작가입니다. 다음 정보를 바탕으로 고품질의 챕터 내용을 작성해주세요.

책 정보:
- 타겟 독자: ${o}
- 톤앤매너: ${s}
- 전체 맥락: ${n}

챕터 정보:
- 챕터 번호: ${a}/${i}
- 챕터 제목: ${t}
- 주요 섹션: ${r.join(", ")}

작성 요구사항:
1. 실용적이고 실행 가능한 내용
2. 구체적인 예시와 사례 포함
3. 단계별 가이드 제공
4. 독자의 수준에 맞는 설명
5. 각 섹션별로 명확한 구분
6. 실습 과제나 체크리스트 포함
7. 약 1,500-2,000자 분량

마크다운 형식으로 작성해주세요.
`,c=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"user",content:p}],temperature:.7,max_tokens:3e3})});if(!c.ok)throw Error(`OpenAI API error: ${c.status}`);let u=await c.json(),d=u.choices[0]?.message?.content||"";return Response.json({content:d,wordCount:d.length})}catch(e){return console.error("Error generating content:",e),Response.json({error:"Failed to generate content"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/create/api/generate-content/route",pathname:"/create/api/generate-content",filename:"route",bundlePath:"app/create/api/generate-content/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/arc/app/create/api/generate-content/route.ts",nextConfigOutput:"",userland:n}),{workAsyncStorage:c,workUnitAsyncStorage:u,serverHooks:d}=p;function l(){return(0,a.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:u})}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{},96559:(e,t,r)=>{"use strict";e.exports=r(44870)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[719],()=>r(3435));module.exports=n})();