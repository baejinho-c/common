(()=>{var e={};e.id=196,e.ids=[196],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11666:e=>{"use strict";e.exports=import("zod/v4")},21820:e=>{"use strict";e.exports=require("os")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},39103:e=>{"use strict";e.exports=import("zod/v3")},42971:e=>{"use strict";e.exports=import("zod")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},82337:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{POST:()=>c});var i=r(32190),a=r(47884),n=r(81248),u=e([a,n]);async function c(e){try{let{title:t}=await e.json();if(!t||!t.trim())return i.NextResponse.json({error:"제목이 필요합니다."},{status:400});let{text:r}=await (0,a.Df)({model:(0,n.NJ)("gpt-4o-mini"),prompt:`당신은 "바이브 코딩 전문가"입니다.

전문 분야: Next.js, React, TypeScript, 웹 개발, AI 통합, 개발 도구
글쓰기 스타일: 실무 중심적이고 구체적이며, 단계별 가이드 제공
성격: 친근하면서도 전문적, 실용적 조언을 선호

주제: "${t.trim()}"

위 주제로 tech 서브도메인의 바이브 코딩 블로그에 게시할 전문적인 기술 블로그 글을 작성해주세요.

요구사항:
1. 마크다운 형식으로 작성
2. 실무에 바로 적용할 수 있는 구체적인 내용 포함
3. 코드 예제와 설명 포함 (관련 있는 경우)
4. 1500-2500자 분량
5. 한국어로 작성
6. SEO를 고려한 구조화된 헤딩 사용
7. 실제 개발자가 궁금해할 만한 내용으로 구성
8. 바이브 코딩 커뮤니티의 톤앤매너에 맞게 친근하면서도 전문적으로

글 구조:
- 도입부: 왜 이 주제가 중요한지
- 본문: 핵심 내용과 실습 예제
- 실전 팁: 실무에서 주의할 점들
- 마무리: 핵심 요약과 다음 단계 제안

바이브 코딩 전문가의 개성과 전문성이 드러나도록 작성해주세요.`}),s=[],u=t.toLowerCase();return(u.includes("react")||u.includes("리액트"))&&s.push("React"),(u.includes("next")||u.includes("넥스트"))&&s.push("Next.js"),(u.includes("typescript")||u.includes("타입스크립트"))&&s.push("TypeScript"),(u.includes("javascript")||u.includes("자바스크립트"))&&s.push("JavaScript"),(u.includes("css")||u.includes("스타일"))&&s.push("CSS"),(u.includes("api")||u.includes("백엔드"))&&s.push("API"),(u.includes("database")||u.includes("데이터베이스"))&&s.push("Database"),(u.includes("ai")||u.includes("인공지능"))&&s.push("AI"),(u.includes("performance")||u.includes("성능"))&&s.push("Performance"),(u.includes("security")||u.includes("보안"))&&s.push("Security"),0===s.length&&s.push("개발","웹개발"),i.NextResponse.json({content:r,tags:s.slice(0,3)})}catch(e){return console.error("AI 초안 생성 오류:",e),i.NextResponse.json({error:"AI 초안 생성 중 오류가 발생했습니다."},{status:500})}}[a,n]=u.then?(await u)():u,s()}catch(e){s(e)}})},85714:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{patchFetch:()=>o,routeModule:()=>p,serverHooks:()=>x,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var i=r(96559),a=r(48088),n=r(37719),u=r(82337),c=e([u]);u=(c.then?(await c)():c)[0];let p=new i.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/ai/generate-draft/route",pathname:"/api/ai/generate-draft",filename:"route",bundlePath:"app/api/ai/generate-draft/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/tech/app/api/ai/generate-draft/route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:x}=p;function o(){return(0,n.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}s()}catch(e){s(e)}})},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[4447,580,2115],()=>r(85714));module.exports=s})();