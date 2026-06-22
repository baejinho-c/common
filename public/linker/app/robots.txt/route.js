(()=>{var e={};e.id=784,e.ids=[784],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3916:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>d,routeModule:()=>p,serverHooks:()=>m,workAsyncStorage:()=>u,workUnitAsyncStorage:()=>c});var s={};r.r(s),r.d(s,{GET:()=>l});var a=r(6559),o=r(8088),i=r(7719),n=r(2190);async function l(){let e=`User-agent: *
Allow: /

# Sitemaps
Sitemap: https://linker.restyart.com/sitemap.xml
Sitemap: https://linker.restyart.com/sitemap-main.xml
Sitemap: https://linker.restyart.com/sitemap-companies.xml
Sitemap: https://linker.restyart.com/sitemap-industries.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /search
Allow: /company/
Allow: /industry/
Allow: /explore
Allow: /network
Allow: /analytics
Allow: /crm
Allow: /contact`;return new n.NextResponse(e,{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400, s-maxage=86400"}})}let p=new a.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:"app/robots.txt/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/linker/app/robots.txt/route.tsx",nextConfigOutput:"",userland:s}),{workAsyncStorage:u,workUnitAsyncStorage:c,serverHooks:m}=p;function d(){return(0,i.patchFetch)({workAsyncStorage:u,workUnitAsyncStorage:c})}},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580],()=>r(3916));module.exports=s})();