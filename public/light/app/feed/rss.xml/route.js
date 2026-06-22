"use strict";(()=>{var e={};e.id=7261,e.ids=[7261],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1408:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>g,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>p});var n={};r.r(n),r.d(n,{GET:()=>l});var a=r(3278),i=r(5002),o=r(4877),s=r(1309);async function l(){let e="https://light.restyart.com",t=[{id:1,title:"하나님의 사랑 안에서",content:"하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라 (요한복음 3:16)",type:"qt",author:"김목사",church:"은혜교회",createdAt:new Date(Date.now()-864e5).toISOString()},{id:2,title:"오늘의 은혜",content:"오늘 예배 중에 받은 은혜를 나누고 싶어요. 주님의 사랑이 얼마나 크신지 다시 한번 깨달았습니다.",type:"sharing",author:"박성도",church:"평강교회",createdAt:new Date(Date.now()-432e5).toISOString()},{id:3,title:"기도제목",content:"가족의 건강을 위해 기도해주세요. 하나님의 치유하심을 믿습니다.",type:"prayer",author:"이집사",church:"소망교회",createdAt:new Date(Date.now()-216e5).toISOString()},{id:4,title:"시편 23편 묵상",content:"여호와는 나의 목자시니 내게 부족함이 없으리로다. 이 말씀이 오늘 하루 큰 위로가 되었습니다.",type:"qt",author:"최권사",church:"믿음교회",createdAt:new Date(Date.now()-108e5).toISOString()},{id:5,title:"감사의 나눔",content:"취업이 되었습니다! 기도해주신 모든 분들께 감사드립니다. 하나님께 영광 돌립니다.",type:"sharing",author:"정청년",church:"새생명교회",createdAt:new Date(Date.now()-18e5).toISOString()}],r=`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>빛 큐티 나눔</title>
    <description>매일의 묵상과 은혜를 나누는 기독교 커뮤니티</description>
    <link>${e}</link>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${e}/feed/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${e}/placeholder-logo.png</url>
      <title>빛 큐티 나눔</title>
      <link>${e}</link>
    </image>
    
    ${t.map(t=>`
    <item>
      <title><![CDATA[${t.title||t.content.substring(0,50)+"..."}]]></title>
      <description><![CDATA[${t.content}]]></description>
      <link>${e}/qt/${t.id}</link>
      <guid>${e}/qt/${t.id}</guid>
      <pubDate>${new Date(t.createdAt).toUTCString()}</pubDate>
      <category>${"qt"===t.type?"큐티":"prayer"===t.type?"기도제목":"은혜나눔"}</category>
      <author><![CDATA[${t.author} (${t.church})]]></author>
    </item>`).join("")}
  </channel>
</rss>`;return new s.NextResponse(r,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=1800, s-maxage=1800"}})}let u=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/feed/rss.xml/route",pathname:"/feed/rss.xml",filename:"route",bundlePath:"app/feed/rss.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/light/app/feed/rss.xml/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:c,staticGenerationAsyncStorage:p,serverHooks:d}=u,h="/feed/rss.xml/route";function g(){return(0,o.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:p})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[9379,4833],()=>r(1408));module.exports=n})();