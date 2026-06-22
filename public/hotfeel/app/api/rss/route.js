"use strict";(()=>{var e={};e.id=580,e.ids=[580],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1999:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>v,patchFetch:()=>y,requestAsyncStorage:()=>g,routeModule:()=>m,serverHooks:()=>w,staticGenerationAsyncStorage:()=>h});var n={};r.r(n),r.d(n,{GET:()=>c,dynamic:()=>d,runtime:()=>p});var i=r(3278),s=r(5002),o=r(4877),a=r(1309),l=r(4265);async function c(e){try{let e=(await (0,l.Bd)()).sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime()).slice(0,100),t=process.env.NEXT_PUBLIC_BASE_URL||"https://hotfeel.restyart.com",r=new Date().toUTCString(),n=`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>요즘 나봐 - 한국 콘텐츠 감상 SNS</title>
    <description>드라마, 영화, 웹툰, 책 등 한국 콘텐츠에 대한 생생한 감상과 리뷰를 공유하는 소셜 플랫폼</description>
    <link>${t}</link>
    <language>ko-KR</language>
    <lastBuildDate>${r}</lastBuildDate>
    <pubDate>${r}</pubDate>
    <ttl>30</ttl>
    <atom:link href="${t}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${t}/placeholder-logo.png</url>
      <title>요즘 나봐</title>
      <link>${t}</link>
      <width>144</width>
      <height>144</height>
    </image>
    
    ${e.map(e=>{let r=new Date(e.timestamp||Date.now()).toUTCString(),n=e.content?.title||"콘텐츠",i={drama:"드라마",movie:"영화",webtoon:"웹툰",book:"책",variety:"예능",anime:"애니메이션",unknown:"콘텐츠"}[e.content?.type||"unknown"]||"콘텐츠",s=e.review?.styled||e.review?.original||"",o=e.tags?.join(", ")||"",a=e.author?.name||"익명",l=u(`${n} - ${a}의 ${i} 감상`),c=u(s),p=u(a);return`
    <item>
      <title>${l}</title>
      <description>${c.substring(0,300)}${c.length>300?"...":""}</description>
      <content:encoded><![CDATA[
        <div>
          <h3>${n} (${i})</h3>
          <p><strong>작성자:</strong> ${p}</p>
          <p><strong>평가:</strong> ${e.content?.status||"감상중"}</p>
          ${o?`<p><strong>태그:</strong> ${o}</p>`:""}
          <div style="margin-top: 15px; line-height: 1.6;">
            ${c.replace(/\n/g,"<br>")}
          </div>
          <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
            <p><strong>반응:</strong> 🔥 ${e.reactions?.likes||0} \xb7 ❤️ ${e.reactions?.dislikes||0}</p>
            <p><strong>댓글:</strong> ${e.comments?.count||0}개</p>
          </div>
        </div>
      ]]></content:encoded>
      <link>${t}/post/${e.id}</link>
      <guid isPermaLink="true">${t}/post/${e.id}</guid>
      <pubDate>${r}</pubDate>
      <author>${e.author?.username||"anonymous"}@hotfeel.restyart.com (${p})</author>
      <category>${i}</category>
      ${e.tags?.map(e=>`<category>${u(e)}</category>`).join("")||""}
    </item>`}).join("")}
  </channel>
</rss>`;return new a.NextResponse(n,{headers:{"Content-Type":"application/rss+xml; charset=utf-8","Cache-Control":"public, max-age=1800, s-maxage=1800"}})}catch(e){return console.error("RSS generation error:",e),new a.NextResponse("Internal Server Error",{status:500})}}function u(e){let t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return e.replace(/[&<>"']/g,e=>t[e])}let p="nodejs",d="force-static",m=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/rss/route",pathname:"/api/rss",filename:"route",bundlePath:"app/api/rss/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/hotfeel/app/api/rss/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:g,staticGenerationAsyncStorage:h,serverHooks:w}=m,v="/api/rss/route";function y(){return(0,o.patchFetch)({serverHooks:w,staticGenerationAsyncStorage:h})}},4265:(e,t,r)=>{r.d(t,{Bd:()=>i});let n=[{id:"1",user:{id:"user1",username:"드라마덕후",avatar:"/placeholder.svg?height=40&width=40",level:15},content:{title:"눈물의 여왕",category:"드라마",rating:5,text:"정말 감동적인 드라마였어요! 김수현과 김지원의 연기가 너무 좋았고, 스토리도 탄탄했습니다.",aiStyled:!0},reactions:{likes:124,dislikes:3,userReaction:null},comments:{count:28},timestamp:"2024-01-15T10:30:00Z",trending:!0,views:1250},{id:"2",user:{id:"user2",username:"웹툰러버",avatar:"/placeholder.svg?height=40&width=40",level:8},content:{title:"외모지상주의",category:"웹툰",rating:4,text:"외모에 대한 사회적 편견을 다룬 웹툰이에요. 처음엔 가볍게 봤는데 갈수록 깊이 있는 메시지를 전달하네요.",aiStyled:!1},reactions:{likes:89,dislikes:7,userReaction:null},comments:{count:15},timestamp:"2024-01-14T15:20:00Z",views:890},{id:"3",user:{id:"user3",username:"영화광",avatar:"/placeholder.svg?height=40&width=40",level:22},content:{title:"기생충",category:"영화",rating:5,text:"봉준호 감독의 역작! 계급 사회에 대한 날카로운 시선이 돋보이는 작품입니다.",aiStyled:!0},reactions:{likes:256,dislikes:12,userReaction:null},comments:{count:45},timestamp:"2024-01-13T20:45:00Z",trending:!0,views:2100}];async function i(e){return new Promise(t=>{setTimeout(()=>{let r=[...n];if(e?.category&&"all"!==e.category&&(r=r.filter(t=>t.content.category.toLowerCase()===e.category?.toLowerCase())),e?.search&&(r=r.filter(t=>t.content.title.toLowerCase().includes(e.search.toLowerCase())||t.content.text.toLowerCase().includes(e.search.toLowerCase()))),e?.sortBy)switch(e.sortBy){case"trending":r=r.sort((e,t)=>t.reactions.likes+t.comments.count-(e.reactions.likes+e.comments.count));break;case"recent":r=r.sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime());break;case"popular":r=r.sort((e,t)=>t.reactions.likes-e.reactions.likes)}e?.limit&&(r=r.slice(e.offset||0,(e.offset||0)+e.limit)),t(r)},100)})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[379,833],()=>r(1999));module.exports=n})();