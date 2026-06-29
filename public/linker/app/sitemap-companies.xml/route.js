(()=>{var e={};e.id=101,e.ids=[101],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2489:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>x,routeModule:()=>l,serverHooks:()=>d,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>u});var s={};r.r(s),r.d(s,{GET:()=>c});var a=r(6559),o=r(8088),n=r(7719),i=r(2190);async function p(){try{let e=[];for(let t of["삼성","LG","현대","기아","SK","POSCO","한화","롯데","두산","GS","CJ","신세계","이마트","네이버","카카오","쿠팡","배달의민족","토스","우아한형제들","크래프톤","넥슨","NHN","엔씨소프트","넷마블","바이오","제약","화학","건설","금융","보험","증권","은행","자동차","전자","반도체","디스플레이","배터리","철강","조선","항공","물류","유통","식품","의류","화장품","게임","엔터테인먼트"])try{let r=await fetch(`https://app.restyart.com/api/resty_company?q=${encodeURIComponent(t)}&pageSize=50`);if(r.ok){let t=await r.json();t.items&&e.push(...t.items)}}catch(e){console.error(`Error fetching companies for term ${t}:`,e)}return e.filter((e,t,r)=>t===r.findIndex(t=>t.id===e.id)).slice(0,1e3)}catch(e){return console.error("Error fetching companies:",e),[]}}async function c(){try{let e=await p(),t=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${e.map(e=>`  <url>
    <loc>https://linker.restyart.com/company/${e.id}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n")}
</urlset>`;return new i.NextResponse(t,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}catch(t){console.error("Error generating companies sitemap:",t);let e=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://linker.restyart.com/search</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;return new i.NextResponse(e,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=300, s-maxage=300"}})}}let l=new a.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/sitemap-companies.xml/route",pathname:"/sitemap-companies.xml",filename:"route",bundlePath:"app/sitemap-companies.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/linker/app/sitemap-companies.xml/route.tsx",nextConfigOutput:"",userland:s}),{workAsyncStorage:m,workUnitAsyncStorage:u,serverHooks:d}=l;function x(){return(0,n.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:u})}},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580],()=>r(2489));module.exports=s})();