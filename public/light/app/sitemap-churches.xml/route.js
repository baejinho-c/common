"use strict";(()=>{var e={};e.id=1857,e.ids=[1857],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5030:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>u,patchFetch:()=>d,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>h});var s={};r.r(s),r.d(s,{GET:()=>c});var o=r(3278),a=r(5002),n=r(4877),i=r(1309);async function c(){try{console.log("교회 sitemap 생성 시작");let e=await fetch("https://play.restyart.com/api/churches",{method:"GET",headers:{"Content-Type":"application/json"}}),t=[];if(e.ok){let r=await e.json();console.log("외부 API 응답 성공:",r),Array.isArray(r.items)?t=r.items:Array.isArray(r)?t=r:(console.warn("예상치 못한 API 응답 구조:",r),t=[])}else console.error("외부 API 오류:",e.status,e.statusText),t=[{id:1,church_name:"은혜교회",region1:"서울특별시",region2:"강남구"},{id:2,church_name:"소망교회",region1:"서울특별시",region2:"서초구"},{id:3,church_name:"평강교회",region1:"경기도",region2:"성남시"}];console.log(`교회 sitemap 생성: ${t.length}개 교회`);let r=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${t.map(e=>{let t=`https://light.restyart.com/church/${encodeURIComponent(e.church_name)}`;return`  <url>
    <loc>${t}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`}).join("\n")}
</urlset>`;return new i.NextResponse(r,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}catch(t){console.error("교회 sitemap 생성 오류:",t);let e=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://light.restyart.com/churches</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;return new i.NextResponse(e,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}}let l=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/sitemap-churches.xml/route",pathname:"/sitemap-churches.xml",filename:"route",bundlePath:"app/sitemap-churches.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/light/app/sitemap-churches.xml/route.tsx",nextConfigOutput:"",userland:s}),{requestAsyncStorage:p,staticGenerationAsyncStorage:h,serverHooks:m}=l,u="/sitemap-churches.xml/route";function d(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:h})}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[9379,4833],()=>r(5030));module.exports=s})();