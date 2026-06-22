(()=>{var e={};e.id=475,e.ids=[475],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},7160:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>d,routeModule:()=>m,serverHooks:()=>u,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>c});var o={};r.r(o),r.d(o,{GET:()=>n});var a=r(6559),s=r(8088),i=r(7719),l=r(2190);async function n(){let e="https://healing.restyart.com",t=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
   메인 페이지 
  <url>
    <loc>${e}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
   테마별 페이지 
  <url>
    <loc>${e}/theme/healing</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${e}/theme/success</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${e}/theme/love</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${e}/theme/humor</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${e}/theme/work</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${e}/theme/daily</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
   공유 페이지 (동적 생성되는 페이지들) 
  <url>
    <loc>${e}/share</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>`;return new l.NextResponse(t,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}let m=new a.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"route",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/healing/app/sitemap.xml/route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:p,workUnitAsyncStorage:c,serverHooks:u}=m;function d(){return(0,i.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:c})}},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[447,199],()=>r(7160));module.exports=o})();