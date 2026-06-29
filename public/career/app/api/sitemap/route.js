"use strict";(()=>{var e={};e.id=436,e.ids=[436],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},832:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>h,requestAsyncStorage:()=>c,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>u});var a={};r.r(a),r.d(a,{GET:()=>p});var o=r(3278),i=r(5002),n=r(4877),s=r(1309);async function p(){let e="https://career.restyart.com",t=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${["","/chat","/score-path","/goal-path","/community","/community/new","/schools","/universities","/credits","/privacy"].map(t=>`
  <url>
    <loc>${e}${t}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${""===t?"1.0":"0.8"}</priority>
  </url>`).join("")}
  ${["7010057","7240001","7130165"].map(t=>`
  <url>
    <loc>${e}/schools/${t}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
  ${["1","2","3"].map(t=>`
  <url>
    <loc>${e}/community/${t}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`).join("")}
</urlset>`;return new s.NextResponse(t,{headers:{"Content-Type":"application/xml"}})}let l=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/sitemap/route",pathname:"/api/sitemap",filename:"route",bundlePath:"app/api/sitemap/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/career/app/api/sitemap/route.tsx",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:m}=l,d="/api/sitemap/route";function h(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:u})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[379,833],()=>r(832));module.exports=a})();