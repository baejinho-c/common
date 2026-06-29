"use strict";(()=>{var e={};e.id=437,e.ids=[437],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},8350:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>P,requestAsyncStorage:()=>d,routeModule:()=>m,serverHooks:()=>l,staticGenerationAsyncStorage:()=>v});var o={};r.r(o),r.d(o,{POST:()=>c});var n=r(3278),s=r(5002),p=r(4877),i=r(1309),a=r(1173),u=r(1584);async function c(e){try{let{content:t,instruction:r,businessType:o}=await e.json(),n=process.env.OPEN_API_KEY||process.env.OPENAI_API_KEY;if(!n)return i.NextResponse.json({error:"OpenAI API key not configured"},{status:500});let s=`
당신은 전문 카피라이터이자 마케팅 전문가입니다. 다음 웹사이트 콘텐츠를 개선해주세요:

📝 현재 콘텐츠:
${t}

🎯 개선 요청:
${r}

🏢 비즈니스 유형:
${o}

📋 개선 가이드라인:
1. **톤앤매너**: 전문적이면서도 친근한 한국어 표현
2. **SEO 최적화**: 관련 키워드를 자연스럽게 포함
3. **타겟팅**: 해당 비즈니스의 고객층에 맞는 메시지
4. **설득력**: 감정적 어필과 논리적 근거의 균형
5. **행동 유도**: 명확하고 매력적인 CTA 포함
6. **가독성**: 스캔하기 쉬운 구조와 적절한 길이
7. **차별화**: 경쟁사와 구별되는 독특한 가치 제안
8. **신뢰성**: 전문성과 신뢰를 보여주는 표현

💡 콘텐츠 개선 포인트:
- 헤드라인: 임팩트 있고 기억에 남는 메시지
- 본문: 구체적인 혜택과 결과 중심
- CTA: 행동을 유도하는 강력한 문구
- 키워드: 검색 최적화를 위한 자연스러운 포함

**개선된 콘텐츠만 반환해주세요. 설명이나 주석은 제외하고 바로 사용 가능한 텍스트만 제공해주세요.**
`,{text:p}=await (0,a._4)({model:(0,u.fr)("gpt-4o-mini",{apiKey:n}),prompt:s,temperature:.6,maxTokens:1500});return i.NextResponse.json({improvedContent:p})}catch(e){return console.error("Content improvement error:",e),i.NextResponse.json({error:"Failed to improve content"},{status:500})}}let m=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/improve-content/route",pathname:"/api/improve-content",filename:"route",bundlePath:"app/api/improve-content/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mypage/app/api/improve-content/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:v,serverHooks:l}=m,x="/api/improve-content/route";function P(){return(0,p.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:v})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[379,698],()=>r(8350));module.exports=o})();