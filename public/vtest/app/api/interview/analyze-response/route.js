(()=>{var e={};e.id=674,e.ids=[674],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1820:e=>{"use strict";e.exports=require("os")},2919:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>f,routeModule:()=>d,serverHooks:()=>v,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>m});var s={};t.r(s),t.d(s,{POST:()=>c});var n=t(6559),o=t(8088),i=t(7719),a=t(2190),p=t(9239);let u=(0,t(1248).ry)({apiKey:process.env.OPEN_AI_KEY});async function c(e){try{let{userResponse:r,question:t,jobCategory:s,difficulty:n,questionNumber:o}=await e.json(),i=`Analyze this interview response for a ${s} position at ${n} level.

Question: "${t}"
Candidate Response: "${r}"

Provide a brief analysis in Korean focusing on:
1. Content quality (relevance, depth, specificity)
2. Structure (logical flow, STAR method if applicable)
3. Communication clarity
4. Professional competency demonstrated

Give a score from 1-5 and 2-3 sentences of constructive feedback. Keep it encouraging but honest.

Format your response as JSON:
{
  "score": number (1-5),
  "feedback": "brief constructive feedback in Korean",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}`,{text:c}=await (0,p.Df)({model:u("gpt-4o-mini"),prompt:i,temperature:.3,maxTokens:400}),d=function(e){let r=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/);return r?r[1].trim():e.trim()}(c),l=JSON.parse(d);return a.NextResponse.json(l)}catch(e){return console.error("Error analyzing response:",e),a.NextResponse.json({score:3,feedback:"답변을 분석하는 중 오류가 발생했습니다.",strengths:["성실한 답변"],improvements:["더 구체적인 사례 제시"]},{status:200})}}let d=new n.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/interview/analyze-response/route",pathname:"/api/interview/analyze-response",filename:"route",bundlePath:"app/api/interview/analyze-response/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/vtest/app/api/interview/analyze-response/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:m,serverHooks:v}=d;function f(){return(0,i.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:m})}},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9021:e=>{"use strict";e.exports=require("fs")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[447,580,866],()=>t(2919));module.exports=s})();