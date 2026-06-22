"use strict";(()=>{var e={};e.id=436,e.ids=[436],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},498:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>d,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>u,staticGenerationAsyncStorage:()=>h});var a={};t.r(a),t.d(a,{GET:()=>s});var o=t(3278),l=t(5002),n=t(4877),i=t(1309);async function s(){let e="https://ai-encyclopedia.vercel.app",r=new Date().toISOString(),t=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${e}/</loc>
    <lastmod>${r}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${e}/" />
  </url>
  
  <url>
    <loc>${e}/search</loc>
    <lastmod>${r}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${e}/search" />
  </url>
  
  <url>
    <loc>${e}/generate</loc>
    <lastmod>${r}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${e}/generate" />
  </url>
  
  <url>
    <loc>${e}/sources</loc>
    <lastmod>${r}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${e}/sources" />
  </url>
  
  ${["photosynthesis","king-sejong","pythagorean-theorem","solar-system","three-kingdoms-unification","hangeul-creation","water-cycle","democracy","fractions","dna-structure"].map(t=>`
  <url>
    <loc>${e}/article/${t}</loc>
    <lastmod>${r}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${e}/article/${t}" />
  </url>`).join("")}
</urlset>`;return new i.NextResponse(t,{headers:{"Content-Type":"application/xml"}})}let p=new o.AppRouteRouteModule({definition:{kind:l.x.APP_ROUTE,page:"/api/sitemap/route",pathname:"/api/sitemap",filename:"route",bundlePath:"app/api/sitemap/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/library/app/api/sitemap/route.tsx",nextConfigOutput:"",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:h,serverHooks:u}=p,m="/api/sitemap/route";function d(){return(0,n.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:h})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[379,833],()=>t(498));module.exports=a})();