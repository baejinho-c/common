"use strict";(()=>{var e={};e.id=562,e.ids=[562],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},3823:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>f,requestAsyncStorage:()=>m,routeModule:()=>l,serverHooks:()=>g,staticGenerationAsyncStorage:()=>d});var s={};r.r(s),r.d(s,{POST:()=>c});var o=r(3278),a=r(5002),n=r(4877),i=r(1309),p=r(1173),u=r(1584);async function c(e){try{let{plan:t,sections:r}=await e.json(),s=process.env.OPEN_API_KEY||process.env.OPENAI_API_KEY;if(!s)return i.NextResponse.json({error:"OpenAI API key not configured"},{status:500});let o=`
당신은 전문 프론트엔드 개발자입니다. 다음 기획서를 바탕으로 실제 배포 가능한 완전한 HTML 웹사이트를 생성해주세요.

📋 기획서:
${t}

📄 섹션 정보:
${r.map(e=>`• ${e.title}: ${e.content}`).join("\n")}

🎯 개발 요구사항:
1. **완전한 HTML5 문서** (DOCTYPE, meta tags, semantic HTML)
2. **Tailwind CSS** 클래스를 사용한 모던 스타일링
3. **완전 반응형** 디자인 (mobile-first)
4. **접근성** 준수 (ARIA labels, semantic tags)
5. **SEO 최적화** (meta tags, structured data)
6. **인터랙티브 요소** (hover effects, smooth scrolling)
7. **실제 콘텐츠** (Lorem ipsum 대신 의미있는 한국어 콘텐츠)
8. **프로덕션 레디** (실제 사용 가능한 수준)

🎨 디자인 가이드라인:
- 모던하고 전문적인 디자인
- 일관된 색상 시스템과 타이포그래피
- 적절한 여백과 레이아웃
- 시각적 계층구조 명확히
- 브랜드 아이덴티티 반영

💡 포함해야 할 섹션들:
- Header (네비게이션, 로고)
- Hero Section (메인 메시지, CTA)
- About/Services (핵심 가치 제안)
- Features/Benefits (주요 특징)
- Testimonials/Social Proof (신뢰성)
- Contact/CTA (연락처, 행동 유도)
- Footer (추가 정보, 링크)

⚡ 기술적 요구사항:
- 빠른 로딩을 위한 최적화된 구조
- 크로스 브라우저 호환성
- 모바일 퍼스트 반응형
- 웹 표준 준수

**오직 완성된 HTML 코드만 반환해주세요. 설명이나 주석은 제외하고 바로 사용 가능한 코드만 제공해주세요.**
`,{text:a}=await (0,p._4)({model:(0,u.fr)("gpt-4o-mini",{apiKey:s}),prompt:o,temperature:.2,maxTokens:4e3});return i.NextResponse.json({html:a})}catch(e){return console.error("Website generation error:",e),i.NextResponse.json({error:"Failed to generate website"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/generate-website/route",pathname:"/api/generate-website",filename:"route",bundlePath:"app/api/generate-website/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mypage/app/api/generate-website/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:m,staticGenerationAsyncStorage:d,serverHooks:g}=l,x="/api/generate-website/route";function f(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:d})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[379,698],()=>r(3823));module.exports=s})();