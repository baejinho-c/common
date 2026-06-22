(()=>{var e={};e.id=545,e.ids=[545],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3319:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>m,routeModule:()=>u,serverHooks:()=>c,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var s={};r.r(s),r.d(s,{GET:()=>p});var n=r(6559),i=r(8088),a=r(7719),o=r(2190);async function p(){let e="https://corplinker.com",t=new Date().toISOString(),r=`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CorpLinker - 최신 기업 정보</title>
    <description>기업 정보를 연결하다, 산업을 꿰뚫다</description>
    <link>${e}</link>
    <language>ko-KR</language>
    <lastBuildDate>${t}</lastBuildDate>
    <atom:link href="${e}/feed/rss.xml" rel="self" type="application/rss+xml"/>
    
${[{id:"1",name:"메디컬AI",description:"AI 기반 의료 진단 솔루션을 개발하는 스타트업",industry:"AI 의료",pubDate:"2024-01-20T10:00:00+00:00"},{id:"2",name:"바이오테크코리아",description:"재생의학 기반 치료제 개발 전문 기업",industry:"바이오 벤처",pubDate:"2024-01-18T14:30:00+00:00"},{id:"3",name:"펫케어솔루션",description:"반려동물 헬스케어 플랫폼 운영",industry:"반려동물",pubDate:"2024-01-15T09:15:00+00:00"}].map(t=>`    <item>
      <title>${t.name} - ${t.industry}</title>
      <description><![CDATA[${t.description}]]></description>
      <link>${e}/company/${t.id}</link>
      <guid>${e}/company/${t.id}</guid>
      <pubDate>${t.pubDate}</pubDate>
      <category>${t.industry}</category>
    </item>`).join("\n")}
  </channel>
</rss>`;return new o.NextResponse(r,{headers:{"Content-Type":"application/rss+xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}let u=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/feed/rss.xml/route",pathname:"/feed/rss.xml",filename:"route",bundlePath:"app/feed/rss.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/linker/app/feed/rss.xml/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:c}=u;function m(){return(0,a.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580],()=>r(3319));module.exports=s})();