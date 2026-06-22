"use strict";(()=>{var e={};e.id=7754,e.ids=[7754],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9257:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>d,patchFetch:()=>h,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>c});var i={};t.r(i),t.d(i,{GET:()=>s});var o=t(3278),a=t(5002),l=t(4877),n=t(1309);async function s(){let e=Array.from({length:40},(e,r)=>({id:`qt-${r+1}`,priority:.6})),r=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   QT 메인 페이지들 
  ${[{url:"",priority:.9},{url:"popular",priority:.8},{url:"favorites",priority:.7},{url:"profile",priority:.6},{url:"credits",priority:.5},{url:"security",priority:.4},{url:"churches",priority:.7},{url:"bible/search",priority:.8}].map(e=>`
  <url>
    <loc>https://light.restyart.com/${e.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("")}
  
   최근 QT 게시물들 
  ${e.map(e=>`
  <url>
    <loc>https://light.restyart.com/qt/${e.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("")}
  
   교회별 페이지들 
  ${["온누리교회","사랑의교회","여의도순복음교회","명성교회","충현교회","소망교회","금란교회","강남교회","분당우리교회","지구촌교회"].map(e=>`
  <url>
    <loc>https://light.restyart.com/church/${encodeURIComponent(e)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join("")}
</urlset>`;return new n.NextResponse(r,{headers:{"Content-Type":"application/xml","Cache-Control":"public, s-maxage=3600, stale-while-revalidate=1800"}})}let p=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/sitemap-qt-recent.xml/route",pathname:"/sitemap-qt-recent.xml",filename:"route",bundlePath:"app/sitemap-qt-recent.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/light/app/sitemap-qt-recent.xml/route.tsx",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:c,serverHooks:m}=p,d="/sitemap-qt-recent.xml/route";function h(){return(0,l.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:c})}}};var r=require("../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[9379,4833],()=>t(9257));module.exports=i})();