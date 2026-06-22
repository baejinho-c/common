"use strict";(()=>{var e={};e.id=842,e.ids=[842],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},815:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>h,patchFetch:()=>g,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>d,staticGenerationAsyncStorage:()=>m});var o={};t.r(o),t.d(o,{POST:()=>u});var s=t(3278),a=t(5002),n=t(4877),i=t(1173),p=t(6914);async function u(e){try{if(!process.env.OPENAI_API_KEY)return Response.json({error:"OpenAI API 키가 설정되지 않았습니다."},{status:500});let{nodes:r,title:t,style:o}=await e.json();if(!r||0===r.length)return Response.json({error:"작성할 노드가 없습니다."},{status:400});console.log("\uD83D\uDCDD AI 글 작성 시작:",t,`(${r.length}개 노드)`);let s=r.map((e,r)=>`${r+1}. ${e.title}
${e.content}
태그: ${e.tags.join(", ")}`).join("\n\n"),a="";switch(o){case"essay":a="학술적이고 체계적인 에세이 형식으로 작성해주세요. 서론-본론-결론 구조를 갖추고, 각 노드의 내용을 논리적으로 연결해주세요.";break;case"article":a="읽기 쉬운 기사 형식으로 작성해주세요. 제목, 소제목을 활용하고 일반 독자가 이해하기 쉽게 설명해주세요.";break;case"summary":a="핵심 내용을 간결하게 정리한 요약문으로 작성해주세요. 불필요한 설명은 제거하고 핵심만 담아주세요.";break;case"presentation":a="프레젠테이션용 슬라이드 형식으로 작성해주세요. 각 섹션을 명확히 구분하고 핵심 포인트를 강조해주세요.";break;default:a="자연스럽고 읽기 쉬운 글로 작성해주세요."}let{text:n}=await (0,i._4)({model:(0,p.fr)("gpt-4o"),prompt:`
다음 노드들을 바탕으로 "${t}"라는 제목의 글을 작성해주세요.

노드 정보:
${s}

작성 스타일: ${a}

요구사항:
1. 모든 노드의 내용을 자연스럽게 연결하여 하나의 완성된 글로 만들어주세요
2. 각 노드의 핵심 내용을 빠뜨리지 말고 포함해주세요
3. 논리적인 흐름과 구조를 갖춘 글로 작성해주세요
4. 독자가 이해하기 쉽고 흥미롭게 읽을 수 있도록 해주세요
5. 적절한 제목과 소제목을 사용해주세요
6. 글의 길이는 800-1500자 정도로 작성해주세요

한국어로 작성해주세요.
      `});return console.log("✅ AI 글 작성 완료:",n.length+"자"),Response.json({text:n})}catch(e){return console.error("❌ 글 작성 오류:",e),Response.json({error:"글 작성 중 오류가 발생했습니다. 다시 시도해주세요."},{status:500})}}let c=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/ai/compose/route",pathname:"/api/ai/compose",filename:"route",bundlePath:"app/api/ai/compose/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mindmap/app/api/ai/compose/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:l,staticGenerationAsyncStorage:m,serverHooks:d}=c,h="/api/ai/compose/route";function g(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:m})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[379,697],()=>t(815));module.exports=o})();