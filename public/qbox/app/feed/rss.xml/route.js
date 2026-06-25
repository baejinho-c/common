(()=>{var e={};e.id=9545,e.ids=[9545],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},58368:(e,t,r)=>{Promise.resolve().then(r.bind(r,26669))},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66115:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>p,serverHooks:()=>x,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>g});var n={};r.r(n),r.d(n,{GET:()=>c,dynamic:()=>l,runtime:()=>u});var s=r(96559),o=r(48088),a=r(37719),i=r(32190),d=r(26669);let l="force-dynamic",u="nodejs";async function c(e){try{let e=(0,d.getAllQuestions)(),t="https://qbox.restyart.com",r=e.sort((e,t)=>new Date(t.updatedAt||t.createdAt).getTime()-new Date(e.updatedAt||e.createdAt).getTime()).slice(0,50),n=r.length>0?new Date(r[0].updatedAt||r[0].createdAt):new Date,s=`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>QBox Platform - Latest Questions</title>
    <description>실시간 질의응답 지식플랫폼 - 최신 질문과 답변</description>
    <link>${t}</link>
    <atom:link href="${t}/feed/rss.xml" rel="self" type="application/rss+xml"/>
    <language>ko-kr</language>
    <lastBuildDate>${n.toUTCString()}</lastBuildDate>
    <generator>QBox Platform</generator>
    <webMaster>admin@qbox.restyart.com</webMaster>
    <managingEditor>admin@qbox.restyart.com</managingEditor>
    <ttl>60</ttl>
    ${r.map(e=>{let r=(0,d.getAnswersByQuestionId)(e.id),n=r.length>0,s=e.content.length>300?e.content.substring(0,300)+"...":e.content;return`
    <item>
      <title><![CDATA[${e.title}]]></title>
      <description><![CDATA[${s}]]></description>
      <content:encoded><![CDATA[${e.content}${n?`<br/><br/><strong>답변 ${r.length}개</strong>`:""}]]></content:encoded>
      <link>${t}/question/${e.id}</link>
      <guid isPermaLink="true">${t}/question/${e.id}</guid>
      <pubDate>${new Date(e.createdAt).toUTCString()}</pubDate>
      <author>${e.author}</author>
      <comments>${t}/question/${e.id}#answers</comments>
      ${e.tags.map(e=>`<category domain="${t}/tag/${encodeURIComponent(e)}">${e}</category>`).join("")}
      ${e.views?`<enclosure url="${t}/question/${e.id}" length="0" type="text/html"/>`:""}
    </item>`}).join("")}
  </channel>
</rss>`;return new i.NextResponse(s,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}catch(e){return console.error("Error generating RSS feed:",e),i.NextResponse.json({error:"Failed to generate RSS feed"},{status:500})}}let p=new s.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/feed/rss.xml/route",pathname:"/feed/rss.xml",filename:"route",bundlePath:"app/feed/rss.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/qbox/app/feed/rss.xml/route.tsx",nextConfigOutput:"",userland:n}),{workAsyncStorage:m,workUnitAsyncStorage:g,serverHooks:x}=p;function h(){return(0,a.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:g})}},87744:(e,t,r)=>{Promise.resolve().then(r.bind(r,9471))}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[4447,580,8663],()=>r(66115));module.exports=n})();