"use strict";(()=>{var e={};e.id=403,e.ids=[403],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1761:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>v,patchFetch:()=>f,requestAsyncStorage:()=>h,routeModule:()=>u,serverHooks:()=>w,staticGenerationAsyncStorage:()=>y});var i={};r.r(i),r.d(i,{GET:()=>d});var o=r(3278),a=r(5002),n=r(4877),s=r(1309),l=r(4265);let c=[{id:"1",title:"눈물의 여왕",category:"드라마",poster:"/placeholder.svg?height=200&width=150&text=눈물의여왕",rating:4.8,year:2024,genre:["로맨스","멜로"],description:"재벌 3세와 슈퍼마켓 딸의 결혼 생활을 그린 로맨틱 코미디",status:"completed",episodes:16},{id:"2",title:"외모지상주의",category:"웹툰",poster:"/placeholder.svg?height=200&width=150&text=외모지상주의",rating:4.5,year:2018,genre:["드라마","학원"],description:"외모 때문에 괴롭힘을 당하던 소년의 이야기",status:"ongoing"},{id:"3",title:"기생충",category:"영화",poster:"/placeholder.svg?height=200&width=150&text=기생충",rating:4.9,year:2019,genre:["스릴러","드라마"],description:"계급 사회의 모순을 그린 봉준호 감독의 작품",duration:"132분"},{id:"4",title:"무한도전",category:"예능",poster:"/placeholder.svg?height=200&width=150&text=무한도전",rating:4.7,year:2006,genre:["버라이어티","코미디"],description:"대한민국 최고의 예능 프로그램",status:"completed"},{id:"5",title:"귀멸의 칼날",category:"애니",poster:"/placeholder.svg?height=200&width=150&text=귀멸의칼날",rating:4.6,year:2019,genre:["액션","판타지"],description:"도깨비가 된 여동생을 구하기 위한 소년의 모험",status:"ongoing",episodes:44},{id:"6",title:"미드나잇 라이브러리",category:"도서",poster:"/placeholder.svg?height=200&width=150&text=미드나잇라이브러리",rating:4.4,year:2020,genre:["판타지","철학"],description:"삶과 죽음 사이에서 만나는 무한한 가능성의 도서관"}];async function p(e){return new Promise(t=>{setTimeout(()=>{let r=[...c];e?.query&&(r=r.filter(t=>t.title.toLowerCase().includes(e.query.toLowerCase())||t.description.toLowerCase().includes(e.query.toLowerCase())||t.genre.some(t=>t.toLowerCase().includes(e.query.toLowerCase())))),e?.category&&(r=r.filter(t=>t.category.toLowerCase()===e.category.toLowerCase())),e?.genre&&e.genre.length>0&&(r=r.filter(t=>e.genre.some(e=>t.genre.some(t=>t.toLowerCase().includes(e.toLowerCase()))))),e?.year&&(r=r.filter(t=>t.year===e.year)),e?.rating&&(r=r.filter(t=>t.rating>=e.rating)),e?.status&&(r=r.filter(t=>t.status===e.status)),e?.limit&&(r=r.slice(e.offset||0,(e.offset||0)+e.limit)),t(r)},100)})}async function d(e){let t=e.headers.get("user-agent")||"",r=new URL(e.url).searchParams.get("path")||"/";if(!/googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|naverbot|facebookexternalhit|twitterbot|linkedinbot/i.test(t))return s.NextResponse.redirect(new URL(r,e.url));try{let e=await g(r);return new s.NextResponse(e,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600","X-Prerendered":"true"}})}catch(e){return console.error("Prerender error:",e),new s.NextResponse("Prerender failed",{status:500})}}async function g(e){let t="https://hotfeel.restyart.com",r="요즘 나봐 - 한국 콘텐츠 감상 SNS",i="드라마, 영화, 웹툰, 책 등 한국 콘텐츠에 대한 생생한 감상과 리뷰를 공유하는 소셜 플랫폼",o="",a="";if(e.startsWith("/post/")){let n=e.split("/")[2],s=(await (0,l.Bd)()).find(e=>e.id===n);s&&(r=`${s.content?.title||"콘텐츠"} - ${s.author.name}의 감상 | 요즘 나봐`,i=(s.review?.styled||s.review?.original||"").substring(0,160),o=function(e){let t=m(e.content?.type||"unknown"),r=e.review?.styled||e.review?.original||"";return`
    <article>
      <h1>${e.content?.title||"콘텐츠"}</h1>
      <div class="post-meta">
        <p><strong>작성자:</strong> ${e.author.name} (${e.author.username})</p>
        <p><strong>콘텐츠 유형:</strong> ${t}</p>
        <p><strong>플랫폼:</strong> ${e.content?.platform||"미지정"}</p>
        <p><strong>상태:</strong> ${e.content?.status||"감상중"}</p>
        <p><strong>작성일:</strong> ${new Date(e.timestamp).toLocaleDateString("ko-KR")}</p>
      </div>
      
      <div class="review-content">
        <h2>감상평</h2>
        <p>${r.replace(/\n/g,"<br>")}</p>
      </div>
      
      ${e.tags&&e.tags.length>0?`
      <div class="tags">
        <strong>태그:</strong>
        ${e.tags.map(e=>`<span class="tag">${e}</span>`).join("")}
      </div>
      `:""}
      
      <div class="reactions">
        <p><strong>반응:</strong> 🔥 ${e.reactions.likes} \xb7 ❤️ ${e.reactions.dislikes}</p>
        <p><strong>댓글:</strong> ${e.comments.count}개</p>
        <p><strong>조회수:</strong> ${e.views||0}회</p>
      </div>
    </article>
  `}(s),a=`
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "CreativeWork",
      "name": "${s.content?.title||"콘텐츠"}"
    },
    "author": {
      "@type": "Person",
      "name": "${s.author.name}"
    },
    "reviewBody": "${(s.review?.styled||s.review?.original||"").replace(/"/g,'\\"')}",
    "datePublished": "${s.timestamp}",
    "url": "${t}/post/${s.id}",
    "publisher": {
      "@type": "Organization",
      "name": "요즘 나봐"
    }
  }
  </script>
  `)}else if(e.startsWith("/content/")){let n=decodeURIComponent(e.split("/")[2]),s=(await p()).find(e=>e.title===n);s&&(r=`${s.title} 감상 모음 | 요즘 나봐`,i=`${s.title}에 대한 다양한 사용자들의 감상과 리뷰를 확인해보세요.`,o=`
    <article>
      <h1>${s.title}</h1>
      <div class="post-meta">
        <p><strong>유형:</strong> ${m(s.type)}</p>
        <p><strong>플랫폼:</strong> ${s.platform}</p>
        <p><strong>평점:</strong> ${s.rating||"N/A"}</p>
      </div>
      
      <div class="content-description">
        <h2>작품 소개</h2>
        <p>${s.description||"이 작품에 대한 다양한 사용자들의 감상을 확인해보세요."}</p>
      </div>
    </article>
  `,a=`
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "${s.title}",
    "description": "${s.description||""}",
    "url": "${t}/content/${encodeURIComponent(s.title)}",
    "genre": "${m(s.type)}",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${s.rating||0}",
      "bestRating": "5"
    }
  }
  </script>
  `)}else if(e.startsWith("/user/")){let t=e.split("/")[2];r=`${t}의 프로필 | 요즘 나봐`,i=`${t}님이 공유한 콘텐츠 감상과 리뷰를 확인해보세요.`}return`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${r}</title>
  <meta name="description" content="${i}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${r}">
  <meta property="og:description" content="${i}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${t}${e}">
  <meta property="og:image" content="${t}/placeholder-logo.png">
  <meta property="og:site_name" content="요즘 나봐">
  <meta property="og:locale" content="ko_KR">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${r}">
  <meta name="twitter:description" content="${i}">
  <meta name="twitter:image" content="${t}/placeholder-logo.png">
  
  <!-- 구조화된 데이터 -->
  ${a}
  
  <!-- 기본 스타일 -->
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
    .tagline { color: #666; }
    .content { line-height: 1.6; }
    .post-meta { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .reactions { margin: 15px 0; }
    .tags { margin: 10px 0; }
    .tag { display: inline-block; background: #e9ecef; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">요즘 나봐</div>
      <div class="tagline">한국 콘텐츠 감상 SNS</div>
    </div>
    <div class="content">
      ${o}
    </div>
  </div>
  
  <!-- 검색봇을 위한 내부 링크 -->
  <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
    <h3>인기 콘텐츠</h3>
    <ul>
      <li><a href="/categories/drama">드라마</a></li>
      <li><a href="/categories/movie">영화</a></li>
      <li><a href="/categories/webtoon">웹툰</a></li>
      <li><a href="/trending">트렌딩</a></li>
      <li><a href="/recent">최신 감상</a></li>
    </ul>
  </div>
</body>
</html>`}function m(e){return({drama:"드라마",movie:"영화",webtoon:"웹툰",book:"책",variety:"예능",anime:"애니메이션",unknown:"콘텐츠"})[e]||"콘텐츠"}let u=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/prerender/route",pathname:"/api/prerender",filename:"route",bundlePath:"app/api/prerender/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/hotfeel/app/api/prerender/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:h,staticGenerationAsyncStorage:y,serverHooks:w}=u,v="/api/prerender/route";function f(){return(0,n.patchFetch)({serverHooks:w,staticGenerationAsyncStorage:y})}},4265:(e,t,r)=>{r.d(t,{Bd:()=>o});let i=[{id:"1",user:{id:"user1",username:"드라마덕후",avatar:"/placeholder.svg?height=40&width=40",level:15},content:{title:"눈물의 여왕",category:"드라마",rating:5,text:"정말 감동적인 드라마였어요! 김수현과 김지원의 연기가 너무 좋았고, 스토리도 탄탄했습니다.",aiStyled:!0},reactions:{likes:124,dislikes:3,userReaction:null},comments:{count:28},timestamp:"2024-01-15T10:30:00Z",trending:!0,views:1250},{id:"2",user:{id:"user2",username:"웹툰러버",avatar:"/placeholder.svg?height=40&width=40",level:8},content:{title:"외모지상주의",category:"웹툰",rating:4,text:"외모에 대한 사회적 편견을 다룬 웹툰이에요. 처음엔 가볍게 봤는데 갈수록 깊이 있는 메시지를 전달하네요.",aiStyled:!1},reactions:{likes:89,dislikes:7,userReaction:null},comments:{count:15},timestamp:"2024-01-14T15:20:00Z",views:890},{id:"3",user:{id:"user3",username:"영화광",avatar:"/placeholder.svg?height=40&width=40",level:22},content:{title:"기생충",category:"영화",rating:5,text:"봉준호 감독의 역작! 계급 사회에 대한 날카로운 시선이 돋보이는 작품입니다.",aiStyled:!0},reactions:{likes:256,dislikes:12,userReaction:null},comments:{count:45},timestamp:"2024-01-13T20:45:00Z",trending:!0,views:2100}];async function o(e){return new Promise(t=>{setTimeout(()=>{let r=[...i];if(e?.category&&"all"!==e.category&&(r=r.filter(t=>t.content.category.toLowerCase()===e.category?.toLowerCase())),e?.search&&(r=r.filter(t=>t.content.title.toLowerCase().includes(e.search.toLowerCase())||t.content.text.toLowerCase().includes(e.search.toLowerCase()))),e?.sortBy)switch(e.sortBy){case"trending":r=r.sort((e,t)=>t.reactions.likes+t.comments.count-(e.reactions.likes+e.comments.count));break;case"recent":r=r.sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime());break;case"popular":r=r.sort((e,t)=>t.reactions.likes-e.reactions.likes)}e?.limit&&(r=r.slice(e.offset||0,(e.offset||0)+e.limit)),t(r)},100)})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[379,833],()=>r(1761));module.exports=i})();