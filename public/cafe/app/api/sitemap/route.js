"use strict";(()=>{var e={};e.id=436,e.ids=[436],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3979:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>d,patchFetch:()=>h,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>u,staticGenerationAsyncStorage:()=>g});var r={};a.r(r),a.d(r,{GET:()=>c});var o=a(3278),s=a(5002),i=a(4877),n=a(1309),l=a(6139);async function c(){try{let e=process.env.NEXT_PUBLIC_SITE_URL||"https://cafe.restyart.com",[t,a]=await Promise.all([l.x1.searchCafes({pageSize:100}).catch(()=>({items:[]})),l.x1.getPopularCafeAreas().catch(()=>[])]),r=t.items||[],o=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${e}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${e}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${e}/map</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${e}/write-review</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  ${r.map(t=>`
  <url>
    <loc>${e}/cafe/${t.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
  ${a.map(t=>`
  <url>
    <loc>${e}/search?location=${encodeURIComponent(t)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join("")}
</urlset>`;return new n.NextResponse(o,{headers:{"Content-Type":"application/xml"}})}catch(e){return console.error("Sitemap generation error:",e),new n.NextResponse("Error generating sitemap",{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/sitemap/route",pathname:"/api/sitemap",filename:"route",bundlePath:"app/api/sitemap/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/cafe/app/api/sitemap/route.tsx",nextConfigOutput:"",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:u}=p,d="/api/sitemap/route";function h(){return(0,i.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:g})}},6139:(e,t,a)=>{a.d(t,{oe:()=>n,x1:()=>i});let r="https://app.restyart.com/api/resty_company";function o(e){let t,a;let{lat:r,lng:o}=(t=Number(e.latitude),a=Number(e.longitude),Number.isFinite(t)&&Number.isFinite(a)?t>50&&a<50?{lat:a,lng:t}:{lat:t,lng:a}:{lat:37.5665,lng:126.978}),s=String(e.name||"").trim(),i=e.branch_name?String(e.branch_name).trim():"";return{id:Number(e.id),name:i?`${s} ${i}`:s,branch_name:e.branch_name?String(e.branch_name):void 0,address:String(e.address||""),category:String(e.category_large||e.category_middle||"카페"),category_small:String(e.category_small||e.category_middle||""),rating:0,reviewCount:0,description:`${String(e.category_small||"카페")} \xb7 ${String(e.address||"")}`,priceRange:"₩₩",openHours:"",features:[],images:["/placeholder.jpg"],coordinates:{lat:r,lng:o}}}class s{constructor(){this.baseUrl=process.env.NEXT_PUBLIC_API_URL||"https://app.restyart.com/api"}async searchCafes(e={}){let t={...e,smallEq:e.smallLike?void 0:"카페",smallLike:e.smallLike};return this.fetchCompanies(t)}async fetchCompanies(e={}){let t=new URLSearchParams,a=e.query||e.q;a&&t.set("q",a),e.smallEq&&t.set("smallEq",e.smallEq),e.smallLike&&t.set("smallLike",e.smallLike),e.addressLike&&t.set("addressLike",e.addressLike),e.category&&"all"!==e.category&&t.set("smallEq",e.category),t.set("page",String(e.page||1)),t.set("pageSize",String(e.pageSize||10));let s=await fetch(`${r}?${t.toString()}`);if(!s.ok)throw Error(`업체 검색 실패 (${s.status})`);let i=await s.json();return{items:(i.items||[]).map(o),total:i.total||0,page:i.page||1,pageSize:i.pageSize||10}}async getCompanyById(e){let t=await fetch(`${r}/${e}`);return t.ok?o(await t.json()):null}async getCompanyReviews(e){return[]}async getFeaturedCompanies(){return(await this.fetchCompanies({pageSize:6})).items}async getNearbyCompanies(e,t,a=5){return(await this.fetchCompanies({pageSize:50})).items.filter(r=>Math.sqrt(Math.pow(r.coordinates.lat-e,2)+Math.pow(r.coordinates.lng-t,2))<=a/100)}async getPopularCafeAreas(){return await new Promise(e=>setTimeout(e,300)),["강남구","마포구","성북구","중구","서초구","용산구"]}async createBlogPost(e,t){try{let a={"Content-Type":"application/json"};!e.anonymous&&t&&(a.Authorization=`Bearer ${t}`);let r=await fetch(`${this.baseUrl}/posts`,{method:"POST",headers:a,body:JSON.stringify(e)});if(!r.ok){let e=await r.json().catch(()=>({}));throw Error(e.message||`HTTP ${r.status}: ${r.statusText}`)}return await r.json()}catch(e){throw console.error("Failed to create blog post:",e),e}}async createMockBlogPost(e){if(await new Promise(e=>setTimeout(e,1e3)),!e.title||!e.content)throw Error("제목과 내용은 필수입니다.");if(e.anonymous&&!e.anonymousName)throw Error("익명 글 작성 시 익명 이름이 필요합니다.");return{message:"작성 완료",postId:Math.floor(1e4*Math.random()),slug:e.slug||e.title.toLowerCase().replace(/[^a-z0-9가-힣]/g,"-").replace(/-+/g,"-")}}}let i=new s,n=e=>i.getCompanyById(e)}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[379,833],()=>a(3979));module.exports=r})();