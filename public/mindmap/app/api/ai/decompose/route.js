"use strict";(()=>{var e={};e.id=876,e.ids=[876],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},3288:(e,r,s)=>{s.r(r),s.d(r,{originalPathname:()=>h,patchFetch:()=>f,requestAsyncStorage:()=>A,routeModule:()=>l,serverHooks:()=>I,staticGenerationAsyncStorage:()=>g});var t={};s.r(t),s.d(t,{POST:()=>m});var o=s(3278),n=s(5002),i=s(4877),a=s(1173),p=s(6914),u=s(3389);let c=u.Ry({title:u.Z_().describe("노드의 제목 (간결하고 명확하게)"),content:u.Z_().describe("노드의 상세 내용 (2-3문장으로 요약)"),tags:u.IX(u.Z_()).describe("관련 태그들 (3-5개)"),category:u.Z_().describe("노드의 카테고리 (예: 핵심개념, 세부설명, 예시, 방법론 등)"),importance:u.Rx().min(1).max(100).describe("중요도 점수 (1-100)")}),d=u.Ry({nodes:u.IX(c).describe("분해된 노드들의 배열"),summary:u.Z_().describe("전체 텍스트의 한 줄 요약"),mainTheme:u.Z_().describe("주요 주제나 테마")});async function m(e){try{if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let{text:r}=await e.json();if(!r||r.trim().length<10)return Response.json({error:"분해할 텍스트가 너무 짧습니다. 최소 10자 이상 입력해주세요."},{status:400});console.log("\uD83E\uDD16 AI 텍스트 분해 시작:",r.substring(0,100)+"...");let{object:s}=await (0,a.jA)({model:(0,p.fr)("gpt-4o-mini"),schema:d,prompt:`
다음 텍스트를 분석하여 의미있는 노드들로 분해해주세요.

텍스트:
"""
${r}
"""

분해 규칙:
1. 텍스트의 핵심 개념들을 식별하여 각각을 독립적인 노드로 만들어주세요
2. 각 노드는 하나의 명확한 아이디어나 개념을 담아야 합니다
3. 노드의 제목은 간결하고 이해하기 쉽게 작성해주세요
4. 내용은 해당 개념을 2-3문장으로 명확히 설명해주세요
5. 태그는 검색과 분류에 도움이 되는 키워드들로 구성해주세요
6. 카테고리는 노드의 성격을 나타내는 분류입니다 (핵심개념, 세부설명, 예시, 방법론, 배경지식, 결론 등)
7. 중요도는 전체 텍스트에서 해당 노드가 차지하는 중요성을 1-100으로 평가해주세요
8. 최소 3개, 최대 8개의 노드로 분해해주세요

한국어로 응답해주세요.
      `});return console.log("✅ AI 분해 완료:",s.nodes.length+"개 노드 생성"),Response.json(s)}catch(e){if(console.error("❌ AI 분해 오류:",e),e instanceof Error){if(e.message.includes("API key"))return Response.json({error:"OpenAI API 키가 유효하지 않습니다. 설정을 확인해주세요."},{status:401});if(e.message.includes("quota"))return Response.json({error:"OpenAI API 사용량 한도를 초과했습니다."},{status:429});if(e.message.includes("rate limit"))return Response.json({error:"API 호출 속도 제한에 걸렸습니다. 잠시 후 다시 시도해주세요."},{status:429})}return Response.json({error:"AI 분해 중 오류가 발생했습니다. 다시 시도해주세요."},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/ai/decompose/route",pathname:"/api/ai/decompose",filename:"route",bundlePath:"app/api/ai/decompose/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mindmap/app/api/ai/decompose/route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:A,staticGenerationAsyncStorage:g,serverHooks:I}=l,h="/api/ai/decompose/route";function f(){return(0,i.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:g})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[379,697],()=>s(3288));module.exports=t})();