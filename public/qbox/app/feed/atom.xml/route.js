(()=>{var e={};e.id=5706,e.ids=[5706],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},35015:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>m,serverHooks:()=>g,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>x});var n={};r.r(n),r.d(n,{GET:()=>p,dynamic:()=>u,runtime:()=>l});var o=r(96559),s=r(48088),a=r(37719),i=r(32190),d=r(26669);let u="force-dynamic",l="nodejs";async function p(e){try{let e=(0,d.getAllQuestions)(),t="https://qbox.restyart.com",r=e.sort((e,t)=>new Date(t.updatedAt||t.createdAt).getTime()-new Date(e.updatedAt||e.createdAt).getTime()).slice(0,50),n=r.length>0?new Date(r[0].updatedAt||r[0].createdAt):new Date,o=`<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>QBox Platform - Latest Questions</title>
  <subtitle>실시간 질의응답 지식플랫폼 - 최신 질문과 답변</subtitle>
  <link href="${t}/feed/atom.xml" rel="self"/>
  <link href="${t}"/>
  <id>${t}/</id>
  <updated>${n.toISOString()}</updated>
  <generator uri="${t}" version="1.0">QBox Platform</generator>
  <rights>\xa9 2024 QBox Platform</rights>
  ${r.map(e=>{(0,d.getAnswersByQuestionId)(e.id);let r=e.content.length>300?e.content.substring(0,300)+"...":e.content;return`
  <entry>
    <title type="html"><![CDATA[${e.title}]]></title>
    <link href="${t}/question/${e.id}"/>
    <id>${t}/question/${e.id}</id>
    <updated>${new Date(e.updatedAt||e.createdAt).toISOString()}</updated>
    <published>${new Date(e.createdAt).toISOString()}</published>
    <author>
      <name>${e.author}</name>
    </author>
    <summary type="html"><![CDATA[${r}]]></summary>
    <content type="html"><![CDATA[${e.content}]]></content>
    ${e.tags.map(e=>`<category term="${e}" label="${e}"/>`).join("")}
  </entry>`}).join("")}
</feed>`;return new i.NextResponse(o,{headers:{"Content-Type":"application/atom+xml; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}catch(e){return console.error("Error generating Atom feed:",e),i.NextResponse.json({error:"Failed to generate Atom feed"},{status:500})}}let m=new o.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/feed/atom.xml/route",pathname:"/feed/atom.xml",filename:"route",bundlePath:"app/feed/atom.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/qbox/app/feed/atom.xml/route.tsx",nextConfigOutput:"",userland:n}),{workAsyncStorage:c,workUnitAsyncStorage:x,serverHooks:g}=m;function h(){return(0,a.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:x})}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},58368:(e,t,r)=>{Promise.resolve().then(r.bind(r,26669))},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},87744:(e,t,r)=>{Promise.resolve().then(r.bind(r,9471))}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[4447,580,8663],()=>r(35015));module.exports=n})();