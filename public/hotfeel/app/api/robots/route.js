"use strict";(()=>{var e={};e.id=8045,e.ids=[8045],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35767:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>g,patchFetch:()=>c,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>w,staticGenerationAsyncStorage:()=>d});var o={};a.r(o),a.d(o,{GET:()=>n});var r=a(73278),s=a(45002),l=a(54877),i=a(71309);async function n(){let e="https://hotfeel.restyart.com",t=`User-agent: *
Allow: /

# 주요 사이트맵
Sitemap: ${e}/api/sitemap

# RSS 피드
Sitemap: ${e}/api/rss

# 크롤링 최적화
Crawl-delay: 1

# 제외할 경로
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Disallow: /private/

# 검색봇별 설정
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Naverbot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

# 소셜 미디어 봇
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# 악성 봇 차단
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;return new i.NextResponse(t,{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400, s-maxage=86400"}})}let p=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/robots/route",pathname:"/api/robots",filename:"route",bundlePath:"app/api/robots/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/hotfeel/app/api/robots/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:w}=p,g="/api/robots/route";function c(){return(0,l.patchFetch)({serverHooks:w,staticGenerationAsyncStorage:d})}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),o=t.X(0,[9379,4833],()=>a(35767));module.exports=o})();