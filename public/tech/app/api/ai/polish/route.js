(()=>{var e={};e.id=7320,e.ids=[7320],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11666:e=>{"use strict";e.exports=import("zod/v4")},21820:e=>{"use strict";e.exports=require("os")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},36245:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{POST:()=>p});var o=r(32190),i=r(47884),a=r(81248),n=e([i,a]);async function p(e){try{let{title:t,content:r}=await e.json();if(!t||!r)return o.NextResponse.json({error:"제목과 내용이 필요합니다."},{status:400});let{text:s}=await (0,i.Df)({model:(0,a.NJ)("gpt-4o-mini"),prompt:`다음 블로그 글을 전문적이고 읽기 쉽게 다듬어주세요. 기술 블로그 스타일로 작성하되, 원본의 핵심 내용과 의도는 유지해주세요.

제목: ${t}

내용:
${r}

요구사항:
1. 마크다운 형식 유지
2. 코드 블록이 있다면 그대로 유지
3. 문법과 맞춤법 교정
4. 더 명확하고 전문적인 표현으로 개선
5. 읽기 쉬운 구조로 재구성
6. 기술적 정확성 확보
7. 한국어로 작성

다듬어진 글:`});return o.NextResponse.json({polishedContent:s})}catch(e){return console.error("AI 다듬기 오류:",e),o.NextResponse.json({error:"AI 다듬기 중 오류가 발생했습니다."},{status:500})}}[i,a]=n.then?(await n)():n,s()}catch(e){s(e)}})},39103:e=>{"use strict";e.exports=import("zod/v3")},42971:e=>{"use strict";e.exports=import("zod")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},75670:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{patchFetch:()=>u,routeModule:()=>c,serverHooks:()=>l,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>x});var o=r(96559),i=r(48088),a=r(37719),n=r(36245),p=e([n]);n=(p.then?(await p)():p)[0];let c=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/ai/polish/route",pathname:"/api/ai/polish",filename:"route",bundlePath:"app/api/ai/polish/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/tech/app/api/ai/polish/route.ts",nextConfigOutput:"",userland:n}),{workAsyncStorage:d,workUnitAsyncStorage:x,serverHooks:l}=c;function u(){return(0,a.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:x})}s()}catch(e){s(e)}})},78335:()=>{},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[4447,580,2115],()=>r(75670));module.exports=s})();