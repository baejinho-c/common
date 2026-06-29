"use strict";(()=>{var e={};e.id=205,e.ids=[205],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},1165:(e,s,r)=>{r.r(s),r.d(s,{originalPathname:()=>h,patchFetch:()=>R,requestAsyncStorage:()=>m,routeModule:()=>l,serverHooks:()=>x,staticGenerationAsyncStorage:()=>b});var t={};r.r(t),r.d(t,{POST:()=>g});var i=r(3278),o=r(5002),n=r(4877),a=r(1173),u=r(6914),p=r(3389);let c=p.Ry({url:p.Z_().describe("추천 웹사이트 URL"),title:p.Z_().describe("웹사이트 제목"),description:p.Z_().describe("웹사이트 설명"),relevance:p.Rx().min(1).max(100).describe("관련도 점수")}),d=p.Ry({suggestions:p.IX(c).describe("추천 웹사이트들"),reasoning:p.Z_().describe("추천 이유")});async function g(e){try{if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let{title:s,content:r,tags:t}=await e.json();console.log("\uD83D\uDD0D 웹사이트 추천 생성 시작:",s);let{object:i}=await (0,a.jA)({model:(0,u.fr)("gpt-4o-mini"),schema:d,prompt:`
다음 노드와 관련된 유용한 웹사이트들을 추천해주세요:

노드 정보:
- 제목: ${s}
- 내용: ${r}
- 태그: ${t.join(", ")}

추천 요구사항:
1. 이 주제와 관련된 신뢰할 수 있는 웹사이트 4-5개를 추천해주세요
2. 다음과 같은 유형의 웹사이트를 포함해주세요:
   - 공식 문서나 레퍼런스 사이트
   - 교육 기관이나 연구 기관 사이트
   - 업계 표준 사이트나 커뮤니티
   - 실용적인 도구나 리소스 사이트
3. 각 웹사이트의 URL은 실제 존재하는 사이트여야 합니다
4. 웹사이트 제목과 설명을 구체적으로 작성해주세요
5. 관련도는 노드 주제와의 연관성을 1-100으로 평가해주세요

실제 존재하는 웹사이트 URL만 추천해주세요.
한국어로 응답해주세요.
      `});return console.log("✅ 웹사이트 추천 완료:",i.suggestions.length+"개 추천"),Response.json(i)}catch(e){return console.error("❌ 웹사이트 추천 오류:",e),Response.json({error:"웹사이트 추천 중 오류가 발생했습니다. 다시 시도해주세요."},{status:500})}}let l=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/ai/suggest-websites/route",pathname:"/api/ai/suggest-websites",filename:"route",bundlePath:"app/api/ai/suggest-websites/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mindmap/app/api/ai/suggest-websites/route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:m,staticGenerationAsyncStorage:b,serverHooks:x}=l,h="/api/ai/suggest-websites/route";function R(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:b})}}};var s=require("../../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[379,697],()=>r(1165));module.exports=t})();