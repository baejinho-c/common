"use strict";(()=>{var e={};e.id=436,e.ids=[436],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7649:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>y,patchFetch:()=>f,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>h,staticGenerationAsyncStorage:()=>u});var o={};r.r(o),r.d(o,{GET:()=>p});var i=r(3278),a=r(5002),l=r(4877),n=r(1309);let s="https://hotfeel.restyart.com",c=[{id:"1",title:"더 글로리",type:"drama"},{id:"2",title:"기생충",type:"movie"},{id:"3",title:"오징어 게임",type:"drama"}];async function p(){let e=new Date().toISOString(),t=`
  <url>
    <loc>${s}</loc>
    <lastmod>${e}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${s}/trending</loc>
    <lastmod>${e}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${s}/recent</loc>
    <lastmod>${e}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${s}/popular</loc>
    <lastmod>${e}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;["drama","movie","webtoon","variety","anime","book","youtube"].forEach(r=>{t+=`
  <url>
    <loc>${s}/${r}</loc>
    <lastmod>${e}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`});try{let r=await Promise.resolve(c),o=await Promise.resolve(c.slice(0,50)),i=await Promise.resolve(c.slice(0,30));o.forEach(r=>{let o=encodeURIComponent(r.title);t+=`
  <url>
    <loc>${s}/content/${o}</loc>
    <lastmod>${e}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`}),i.forEach(r=>{let i=encodeURIComponent(r.title);o.find(e=>e.id===r.id)||(t+=`
  <url>
    <loc>${s}/content/${i}</loc>
    <lastmod>${e}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)}),r.forEach(r=>{let a=encodeURIComponent(r.title);o.find(e=>e.id===r.id)||i.find(e=>e.id===r.id)||(t+=`
  <url>
    <loc>${s}/content/${a}</loc>
    <lastmod>${e}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`)})}catch(e){console.error("Sitemap generation error:",e)}let r=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${t}
</urlset>`;return new n.NextResponse(r,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}let d=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/sitemap/route",pathname:"/api/sitemap",filename:"route",bundlePath:"app/api/sitemap/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/hotfeel/app/api/sitemap/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:u,serverHooks:h}=d,y="/api/sitemap/route";function f(){return(0,l.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:u})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[379,833],()=>r(7649));module.exports=o})();