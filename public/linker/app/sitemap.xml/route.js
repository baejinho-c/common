(()=>{var e={};e.id=475,e.ids=[475],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},7127:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>d,routeModule:()=>m,serverHooks:()=>c,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>u});var r={};s.r(r),s.d(r,{GET:()=>p});var a=s(6559),i=s(8088),n=s(7719),o=s(2190);async function p(){let e=`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://linker.restyart.com/sitemap-main.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://linker.restyart.com/sitemap-companies.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://linker.restyart.com/sitemap-industries.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
</sitemapindex>`;return new o.NextResponse(e,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}let m=new a.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"route",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/linker/app/sitemap.xml/route.tsx",nextConfigOutput:"",userland:r}),{workAsyncStorage:l,workUnitAsyncStorage:u,serverHooks:c}=m;function d(){return(0,n.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:u})}},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[447,580],()=>s(7127));module.exports=r})();