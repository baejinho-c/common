"use strict";(()=>{var e={};e.id=197,e.ids=[197],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},9739:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>g,patchFetch:()=>j,requestAsyncStorage:()=>h,routeModule:()=>l,serverHooks:()=>x,staticGenerationAsyncStorage:()=>m});var n={};t.r(n),t.d(n,{POST:()=>c});var o=t(3278),s=t(5002),a=t(4877),i=t(1173),p=t(6914),u=t(3389);let d=u.Ry({enhancedContent:u.Z_().describe("확장된 노드 내용"),additionalTags:u.IX(u.Z_()).describe("추가 태그들"),relatedConcepts:u.IX(u.Z_()).describe("관련 개념들"),questions:u.IX(u.Z_()).describe("이 노드와 관련된 탐구 질문들"),examples:u.IX(u.Z_()).describe("구체적인 예시들")});async function c(e){try{if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let{title:r,content:t,tags:n}=await e.json();console.log("\uD83D\uDE80 노드 확장 시작:",r);let{object:o}=await (0,i.jA)({model:(0,p.fr)("gpt-4o"),schema:d,prompt:`
다음 노드를 더 풍부하고 상세하게 확장해주세요:

제목: ${r}
내용: ${t}
기존 태그: ${n.join(", ")}

확장 요청사항:
1. 기존 내용을 바탕으로 더 상세하고 깊이 있는 설명을 작성해주세요 (3-4문장)
2. 관련된 추가 태그들을 3-5개 제안해주세요
3. 이 개념과 연관된 다른 개념들을 3-5개 나열해주세요
4. 이 주제에 대해 더 깊이 탐구할 수 있는 질문들을 2-3개 만들어주세요
5. 구체적이고 실용적인 예시들을 2-3개 제공해주세요

한국어로 응답해주세요.
      `});return console.log("✅ 노드 확장 완료:",r),Response.json(o)}catch(e){return console.error("❌ 노드 확장 오류:",e),Response.json({error:"노드 확장 중 오류가 발생했습니다. 다시 시도해주세요."},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/ai/enhance-node/route",pathname:"/api/ai/enhance-node",filename:"route",bundlePath:"app/api/ai/enhance-node/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mindmap/app/api/ai/enhance-node/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:h,staticGenerationAsyncStorage:m,serverHooks:x}=l,g="/api/ai/enhance-node/route";function j(){return(0,a.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:m})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[379,697],()=>t(9739));module.exports=n})();