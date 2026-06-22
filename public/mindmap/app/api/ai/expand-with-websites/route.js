"use strict";(()=>{var e={};e.id=915,e.ids=[915],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},3015:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>w,patchFetch:()=>b,requestAsyncStorage:()=>h,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>x});var s={};r.r(s),r.d(s,{POST:()=>c});var i=r(3278),o=r(5002),n=r(4877),a=r(1173),p=r(6914),u=r(3389);let d=u.Ry({expandedContent:u.Z_().describe("웹사이트 정보를 반영한 확장된 노드 내용"),additionalTags:u.IX(u.Z_()).describe("웹사이트에서 추출한 추가 태그들"),insights:u.IX(u.Z_()).describe("웹사이트에서 얻은 주요 인사이트들"),relatedTopics:u.IX(u.Z_()).describe("웹사이트에서 발견한 관련 주제들")});async function c(e){try{if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let{nodeId:t,title:r,content:s,tags:i,websites:o}=await e.json();console.log("\uD83C\uDF10 웹사이트 기반 노드 확장 시작:",r);let n=o.map((e,t)=>`${t+1}. ${e.title||e.url}
   URL: ${e.url}
   설명: ${e.description||"설명 없음"}`).join("\n\n"),{object:u}=await (0,a.jA)({model:(0,p.fr)("gpt-4o"),schema:d,prompt:`
다음 노드를 연결된 웹사이트 정보를 바탕으로 확장해주세요:

노드 정보:
- 제목: ${r}
- 현재 내용: ${s}
- 기존 태그: ${i.join(", ")}

연결된 웹사이트들:
${n}

확장 요청사항:
1. 웹사이트들의 정보를 바탕으로 노드 내용을 더 풍부하고 구체적으로 확장해주세요
2. 웹사이트에서 얻을 수 있는 실제적이고 구체적인 정보를 포함해주세요
3. 웹사이트들과 관련된 새로운 태그들을 추가해주세요
4. 웹사이트에서 발견할 수 있는 주요 인사이트들을 정리해주세요
5. 관련된 새로운 주제들을 제안해주세요
6. 확장된 내용은 4-6문장으로 작성해주세요

한국어로 응답해주세요.
      `});return console.log("✅ 웹사이트 기반 확장 완료:",r),Response.json(u)}catch(e){return console.error("❌ 웹사이트 기반 확장 오류:",e),Response.json({error:"웹사이트 기반 확장 중 오류가 발생했습니다. 다시 시도해주세요."},{status:500})}}let l=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/ai/expand-with-websites/route",pathname:"/api/ai/expand-with-websites",filename:"route",bundlePath:"app/api/ai/expand-with-websites/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mindmap/app/api/ai/expand-with-websites/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:h,staticGenerationAsyncStorage:x,serverHooks:m}=l,w="/api/ai/expand-with-websites/route";function b(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:x})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[379,697],()=>r(3015));module.exports=s})();