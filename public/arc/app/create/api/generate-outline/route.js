(()=>{var e={};e.id=495,e.ids=[495],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},54406:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>l,routeModule:()=>p,serverHooks:()=>d,workAsyncStorage:()=>u,workUnitAsyncStorage:()=>c});var s={};r.r(s),r.d(s,{POST:()=>i});var o=r(96559),n=r(48088),a=r(37719);async function i(e){try{let{topic:t,targetAudience:r,tone:s,chapterCount:o}=await e.json();if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API key not configured"},{status:500});let n=`
당신은 전문적인 전자책 기획자입니다. 다음 정보를 바탕으로 체계적인 전자책 목차를 작성해주세요.

주제: ${t}
타겟 독자: ${r}
톤앤매너: ${s}
챕터 수: ${o}개

요구사항:
1. 각 챕터는 논리적 순서로 배열
2. 초보자부터 고급자까지 단계적 학습 가능
3. 실용적이고 실행 가능한 내용 중심
4. 각 챕터별로 3-5개의 주요 섹션 포함
5. 독자의 관심을 끌 수 있는 제목

다음 JSON 형식으로 응답해주세요:
{
  "title": "전자책 제목",
  "description": "전자책 설명",
  "chapters": [
    {
      "number": 1,
      "title": "챕터 제목",
      "description": "챕터 설명",
      "sections": ["섹션1", "섹션2", "섹션3"]
    }
  ]
}
`,a=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o",messages:[{role:"user",content:n}],temperature:.7,max_tokens:2e3})});if(!a.ok)throw Error(`OpenAI API error: ${a.status}`);let i=await a.json(),p=i.choices[0]?.message?.content||"";try{let e=JSON.parse(p);return Response.json(e)}catch(e){return Response.json({title:"생성된 전자책",description:"AI가 생성한 전자책 개요",content:p})}}catch(e){return console.error("Error generating outline:",e),Response.json({error:"Failed to generate outline"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/create/api/generate-outline/route",pathname:"/create/api/generate-outline",filename:"route",bundlePath:"app/create/api/generate-outline/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/arc/app/create/api/generate-outline/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:u,workUnitAsyncStorage:c,serverHooks:d}=p;function l(){return(0,a.patchFetch)({workAsyncStorage:u,workUnitAsyncStorage:c})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{},96559:(e,t,r)=>{"use strict";e.exports=r(44870)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[719],()=>r(54406));module.exports=s})();