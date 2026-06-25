"use strict";(()=>{var r={};r.id=7760,r.ids=[7760],r.modules={399:r=>{r.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:r=>{r.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3586:(r,e,t)=>{t.r(e),t.d(e,{originalPathname:()=>y,patchFetch:()=>u,requestAsyncStorage:()=>c,routeModule:()=>h,serverHooks:()=>b,staticGenerationAsyncStorage:()=>m});var o={};t.r(o),t.d(o,{GET:()=>n});var i=t(3278),a=t(5002),p=t(4877),s=t(1309),l=t(3817);async function n(){let r=(0,l.nF)(),e=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   성경 메인 페이지 
  <url>
    <loc>https://light.restyart.com/bible</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
   66권 성경책 페이지 
  ${r.map(r=>`
  <url>
    <loc>https://light.restyart.com/bible/${r.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")}
  
   인기 장 페이지 
  ${[{book:"john",chapter:3,priority:1},{book:"psalms",chapter:23,priority:1},{book:"romans",chapter:8,priority:.9},{book:"matthew",chapter:5,priority:.9},{book:"john",chapter:14,priority:.9},{book:"psalms",chapter:1,priority:.8},{book:"proverbs",chapter:3,priority:.8},{book:"isaiah",chapter:40,priority:.8},{book:"philippians",chapter:4,priority:.8},{book:"ephesians",chapter:2,priority:.8},{book:"1corinthians",chapter:13,priority:.8},{book:"hebrews",chapter:11,priority:.8},{book:"james",chapter:1,priority:.8},{book:"1peter",chapter:2,priority:.7},{book:"revelation",chapter:21,priority:.7}].map(r=>`
  <url>
    <loc>https://light.restyart.com/bible/${r.book}/${r.chapter}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join("")}
  
   최고 인기 구절 페이지 
  ${[{book:"john",chapter:3,verse:16,priority:1},{book:"psalms",chapter:23,verse:1,priority:1},{book:"romans",chapter:8,verse:28,priority:1},{book:"philippians",chapter:4,verse:13,priority:1},{book:"matthew",chapter:11,verse:28,priority:.9},{book:"john",chapter:14,verse:6,priority:.9},{book:"isaiah",chapter:40,verse:31,priority:.9},{book:"jeremiah",chapter:29,verse:11,priority:.9},{book:"proverbs",chapter:3,verse:5,priority:.8},{book:"2corinthians",chapter:5,verse:17,priority:.8}].map(r=>`
  <url>
    <loc>https://light.restyart.com/bible/${r.book}/${r.chapter}/${r.verse}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join("")}
</urlset>`;return new s.NextResponse(e,{headers:{"Content-Type":"application/xml","Cache-Control":"public, s-maxage=86400, stale-while-revalidate=43200"}})}let h=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/sitemap-bible.xml/route",pathname:"/sitemap-bible.xml",filename:"route",bundlePath:"app/sitemap-bible.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/light/app/sitemap-bible.xml/route.tsx",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:m,serverHooks:b}=h,y="/sitemap-bible.xml/route";function u(){return(0,p.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:m})}}};var e=require("../../webpack-runtime.js");e.C(r);var t=r=>e(e.s=r),o=e.X(0,[9379,4833,3817],()=>t(3586));module.exports=o})();