(()=>{var e={};e.id=784,e.ids=[784],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9878:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>c,routeModule:()=>u,serverHooks:()=>x,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>d});var s={};r.r(s),r.d(s,{GET:()=>p});var o=r(6559),a=r(8088),n=r(7719),i=r(2190);async function p(){let e=`User-agent: *
Allow: /

# Sitemap
Sitemap: https://healing.restyart.com/sitemap.xml

# 크롤링 최적화
Crawl-delay: 1

# 특정 경로 제외
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# 허용할 주요 경로
Allow: /
Allow: /share/
Allow: /theme/`;return new i.NextResponse(e,{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400"}})}let u=new o.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:"app/robots.txt/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/healing/app/robots.txt/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:d,serverHooks:x}=u;function c(){return(0,n.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:d})}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,199],()=>r(9878));module.exports=s})();