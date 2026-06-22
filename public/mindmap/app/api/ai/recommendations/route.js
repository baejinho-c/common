"use strict";(()=>{var e={};e.id=136,e.ids=[136],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},2254:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>A,patchFetch:()=>v,requestAsyncStorage:()=>x,routeModule:()=>l,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var o={};t.r(o),t.d(o,{POST:()=>m});var n=t(3278),s=t(5002),a=t(4877),i=t(1173),p=t(6914),u=t(3389);let c=u.Ry({title:u.Z_().describe("추천 노드의 제목"),content:u.Z_().describe("추천 노드의 상세 내용 (2-3문장)"),tags:u.IX(u.Z_()).describe("관련 태그들"),relevance:u.Rx().min(1).max(100).describe("관련도 점수 (1-100)")}),d=u.Ry({recommendations:u.IX(c).describe("추천 노드들의 배열"),reasoning:u.Z_().describe("추천 이유 설명")});async function m(e){try{if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let{nodeId:r,title:t,content:o,tags:n}=await e.json();console.log("\uD83E\uDD16 AI 추천 생성 시작:",t);let{object:s}=await (0,i.jA)({model:(0,p.fr)("gpt-4o"),schema:d,prompt:`
다음 노드와 관련된 새로운 학습 노드들을 추천해주세요:

기준 노드:
- 제목: ${t}
- 내용: ${o}
- 태그: ${n.join(", ")}

추천 요구사항:
1. 기준 노드와 관련성이 높은 4개의 새로운 노드를 추천해주세요
2. 각 추천 노드는 다음 관점 중 하나를 다뤄야 합니다:
   - 실제 적용 사례 및 예시
   - 관련 이론이나 원리
   - 역사적 배경이나 발전 과정
   - 최신 연구나 트렌드
   - 연관 개념이나 기술
3. 각 노드의 내용은 2-3문장으로 구체적이고 유용하게 작성해주세요
4. 태그는 검색과 분류에 도움이 되는 키워드들로 구성해주세요
5. 관련도는 기준 노드와의 연관성을 1-100으로 평가해주세요

한국어로 응답해주세요.
      `});return console.log("✅ AI 추천 생성 완료:",s.recommendations.length+"개 추천"),Response.json(s)}catch(e){return console.error("❌ AI 추천 생성 오류:",e),Response.json({error:"AI 추천 생성 중 오류가 발생했습니다. 다시 시도해주세요."},{status:500})}}let l=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/ai/recommendations/route",pathname:"/api/ai/recommendations",filename:"route",bundlePath:"app/api/ai/recommendations/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mindmap/app/api/ai/recommendations/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:x,staticGenerationAsyncStorage:g,serverHooks:h}=l,A="/api/ai/recommendations/route";function v(){return(0,a.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[379,697],()=>t(2254));module.exports=o})();