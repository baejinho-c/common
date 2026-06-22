(()=>{var e={};e.id=784,e.ids=[784],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2268:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>x,routeModule:()=>l,serverHooks:()=>d,workAsyncStorage:()=>u,workUnitAsyncStorage:()=>c});var s={};r.r(s),r.d(s,{GET:()=>p});var o=r(6559),a=r(8088),n=r(7719),i=r(2190);async function p(){let e=`User-agent: *
Allow: /

Sitemap: https://klocal.restyart.com/sitemap.xml

# Block access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow access to important files
Allow: /favicon.ico
Allow: /apple-touch-icon.png
Allow: /manifest.json`;return new i.NextResponse(e,{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400, s-maxage=86400"}})}let l=new o.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:"app/robots.txt/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/klocal/app/robots.txt/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:u,workUnitAsyncStorage:c,serverHooks:d}=l;function x(){return(0,n.patchFetch)({workAsyncStorage:u,workUnitAsyncStorage:c})}},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580],()=>r(2268));module.exports=s})();