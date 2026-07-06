"use strict";(()=>{var e={};e.id=403,e.ids=[403],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1761:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>$,patchFetch:()=>b,requestAsyncStorage:()=>v,routeModule:()=>w,serverHooks:()=>x,staticGenerationAsyncStorage:()=>f});var i={};r.r(i),r.d(i,{GET:()=>m});var a=r(3278),o=r(5002),n=r(4877),s=r(1309),l=r(4265),p=r(1074);let g=[{id:"1",title:"눈물의 여왕",category:"드라마",poster:"/placeholder.svg?height=200&width=150&text=눈물의여왕",rating:4.8,year:2024,genre:["로맨스","멜로"],description:"재벌 3세와 슈퍼마켓 딸의 결혼 생활을 그린 로맨틱 코미디",status:"completed",episodes:16},{id:"2",title:"외모지상주의",category:"웹툰",poster:"/placeholder.svg?height=200&width=150&text=외모지상주의",rating:4.5,year:2018,genre:["드라마","학원"],description:"외모 때문에 괴롭힘을 당하던 소년의 이야기",status:"ongoing"},{id:"3",title:"기생충",category:"영화",poster:"/placeholder.svg?height=200&width=150&text=기생충",rating:4.9,year:2019,genre:["스릴러","드라마"],description:"계급 사회의 모순을 그린 봉준호 감독의 작품",duration:"132분"},{id:"4",title:"무한도전",category:"예능",poster:"/placeholder.svg?height=200&width=150&text=무한도전",rating:4.7,year:2006,genre:["버라이어티","코미디"],description:"대한민국 최고의 예능 프로그램",status:"completed"},{id:"5",title:"귀멸의 칼날",category:"애니",poster:"/placeholder.svg?height=200&width=150&text=귀멸의칼날",rating:4.6,year:2019,genre:["액션","판타지"],description:"도깨비가 된 여동생을 구하기 위한 소년의 모험",status:"ongoing",episodes:44},{id:"6",title:"미드나잇 라이브러리",category:"도서",poster:"/placeholder.svg?height=200&width=150&text=미드나잇라이브러리",rating:4.4,year:2020,genre:["판타지","철학"],description:"삶과 죽음 사이에서 만나는 무한한 가능성의 도서관"}],c=p.B.map((e,t)=>({id:`catalog_${t+1}`,title:e.title,category:"웹툰",poster:`/placeholder.svg?height=200&width=150&text=${encodeURIComponent(e.title)}`,rating:e.rating,year:e.year,genre:e.genre,description:e.aliases?.length?`${e.description} (${e.aliases.join(", ")})`:e.description,status:e.status,episodes:"completed"===e.status?void 0:100})),d=(()=>{let e=new Set;return[...c,...g].filter(t=>{let r=`${t.category}:${t.title}`;return!e.has(r)&&(e.add(r),!0)})})();async function u(e){return new Promise(t=>{setTimeout(()=>{let r=[...d];e?.query&&(r=r.filter(t=>t.title.toLowerCase().includes(e.query.toLowerCase())||t.description.toLowerCase().includes(e.query.toLowerCase())||t.genre.some(t=>t.toLowerCase().includes(e.query.toLowerCase())))),e?.category&&(r=r.filter(t=>t.category.toLowerCase()===e.category.toLowerCase())),e?.genre&&e.genre.length>0&&(r=r.filter(t=>e.genre.some(e=>t.genre.some(t=>t.toLowerCase().includes(e.toLowerCase()))))),e?.year&&(r=r.filter(t=>t.year===e.year)),e?.rating&&(r=r.filter(t=>t.rating>=e.rating)),e?.status&&(r=r.filter(t=>t.status===e.status)),e?.limit&&(r=r.slice(e.offset||0,(e.offset||0)+e.limit)),t(r)},100)})}async function m(e){let t=e.headers.get("user-agent")||"",r=new URL(e.url).searchParams.get("path")||"/";if(!/googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|naverbot|facebookexternalhit|twitterbot|linkedinbot/i.test(t))return s.NextResponse.redirect(new URL(r,e.url));try{let e=await y(r);return new s.NextResponse(e,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600","X-Prerendered":"true"}})}catch(e){return console.error("Prerender error:",e),new s.NextResponse("Prerender failed",{status:500})}}async function y(e){let t="https://hotfeel.restyart.com",r="요즘 나봐 - 한국 콘텐츠 감상 SNS",i="드라마, 영화, 웹툰, 책 등 한국 콘텐츠에 대한 생생한 감상과 리뷰를 공유하는 소셜 플랫폼",a="",o="";if(e.startsWith("/post/")){let n=e.split("/")[2],s=(await (0,l.Bd)()).find(e=>e.id===n);s&&(r=`${s.content?.title||"콘텐츠"} - ${s.author.name}의 감상 | 요즘 나봐`,i=(s.review?.styled||s.review?.original||"").substring(0,160),a=function(e){let t=h(e.content?.type||"unknown"),r=e.review?.styled||e.review?.original||"";return`
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
  `}(s),o=`
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
  `)}else if(e.startsWith("/content/")){let n=decodeURIComponent(e.split("/")[2]),s=(await u()).find(e=>e.title===n);s&&(r=`${s.title} 감상 모음 | 요즘 나봐`,i=`${s.title}에 대한 다양한 사용자들의 감상과 리뷰를 확인해보세요.`,a=`
    <article>
      <h1>${s.title}</h1>
      <div class="post-meta">
        <p><strong>유형:</strong> ${h(s.type)}</p>
        <p><strong>플랫폼:</strong> ${s.platform}</p>
        <p><strong>평점:</strong> ${s.rating||"N/A"}</p>
      </div>
      
      <div class="content-description">
        <h2>작품 소개</h2>
        <p>${s.description||"이 작품에 대한 다양한 사용자들의 감상을 확인해보세요."}</p>
      </div>
    </article>
  `,o=`
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "${s.title}",
    "description": "${s.description||""}",
    "url": "${t}/content/${encodeURIComponent(s.title)}",
    "genre": "${h(s.type)}",
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
  ${o}
  
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
      ${a}
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
</html>`}function h(e){return({drama:"드라마",movie:"영화",webtoon:"웹툰",book:"책",variety:"예능",anime:"애니메이션",unknown:"콘텐츠"})[e]||"콘텐츠"}let w=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/prerender/route",pathname:"/api/prerender",filename:"route",bundlePath:"app/api/prerender/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/hotfeel/app/api/prerender/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:v,staticGenerationAsyncStorage:f,serverHooks:x}=w,$="/api/prerender/route";function b(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:f})}},1074:(e,t,r)=>{r.d(t,{B:()=>i});let i=[{title:"나 혼자만 레벨업",status:"completed",description:"최약체 헌터 성진우가 최강자로 성장하는 한국형 먼치킨 판타지의 대표작.",genre:["액션","판타지","성장"],platform:"카카오페이지",year:2018,rating:9.7,views:21e6,popularity:99},{title:"전지적 독자 시점",status:"ongoing",description:"소설 속 세계가 현실이 되고, 결말을 아는 유일한 독자가 살아남는 메타 판타지.",genre:["판타지","액션","메타"],platform:"네이버웹툰",year:2020,rating:9.8,views:185e5,popularity:98},{title:"신의 탑",aliases:["Tower of God"],status:"ongoing",description:"탑을 오르는 생존 경쟁 속에서 정치와 배신, 성장이 겹겹이 쌓이는 장기 대서사.",genre:["판타지","액션","서사"],platform:"네이버웹툰",year:2010,rating:9.4,views:195e5,popularity:95},{title:"갓 오브 하이스쿨",aliases:["God of High School"],status:"completed",description:"무술 대회에서 시작해 신화급 스케일로 확장되는 고밀도 전투 액션 웹툰.",genre:["액션","배틀","판타지"],platform:"네이버웹툰",year:2011,rating:9.2,views:162e5,popularity:93},{title:"노블레스",aliases:["Noblesse"],status:"completed",description:"귀족 뱀파이어의 묵직한 카리스마와 학원 일상이 공존하는 클래식 액션 판타지.",genre:["액션","판타지","학원"],platform:"네이버웹툰",year:2007,rating:9.1,views:148e5,popularity:90},{title:"일렉시드",aliases:["Eleceed"],status:"ongoing",description:"각성자 배틀에 개그와 케미를 결합한 대중성 높은 현대 능력자 액션물.",genre:["액션","코미디","능력자"],platform:"네이버웹툰",year:2018,rating:9.5,views:136e5,popularity:92},{title:"하이브",aliases:["Hive"],status:"completed",description:"괴생명체 습격 속 인간 생존 본능을 끝까지 밀어붙이는 한국형 생존 호러.",genre:["호러","스릴러","생존"],platform:"네이버웹툰",year:2013,rating:8.9,views:99e5,popularity:86},{title:"기기괴괴",status:"ongoing",description:"도시 괴담과 초자연 반전을 옴니버스로 풀어내는 단편 공포 미스터리.",genre:["호러","미스터리","옴니버스"],platform:"네이버웹툰",year:2014,rating:9,views:87e5,popularity:84},{title:"유미의 세포들",status:"completed",description:"감정을 세포로 의인화해 사랑과 성장을 섬세하게 그린 로맨스 일상 웹툰.",genre:["로맨스","일상","코미디"],platform:"네이버웹툰",year:2015,rating:9.4,views:128e5,popularity:91},{title:"이태원 클라쓰",status:"completed",description:"작은 가게에서 시작해 대기업에 맞서는 청춘 복수와 성공 서사.",genre:["드라마","성장","복수"],platform:"카카오페이지",year:2016,rating:9,views:112e5,popularity:88},{title:"외모지상주의",status:"ongoing",description:"외모와 계급 문제를 액션과 사회 비판으로 풀어내는 장기 연재 대표작.",genre:["드라마","액션","학원"],platform:"네이버웹툰",year:2014,rating:9.1,views:173e5,popularity:94},{title:"마음의 소리",status:"completed",description:"조석 작가의 생활 밀착형 개그를 1000화 이상 이어간 한국 웹툰 레전드.",genre:["코미디","일상","개그"],platform:"네이버웹툰",year:2006,rating:9.3,views:15e6,popularity:90},{title:"복학왕",status:"completed",description:"복학생의 허세와 현실을 거쳐 청춘 드라마로 진화한 생활 공감 웹툰.",genre:["코미디","드라마","청춘"],platform:"네이버웹툰",year:2014,rating:8.8,views:93e5,popularity:82},{title:"여신강림",aliases:["True Beauty"],status:"completed",description:"메이크업과 자존감, 삼각관계를 중심으로 한 글로벌 인기 로맨스.",genre:["로맨스","학원","뷰티"],platform:"네이버웹툰",year:2018,rating:9.2,views:142e5,popularity:92},{title:"재혼황후",status:"completed",description:"황후의 이혼과 재혼을 축으로 궁중 정치와 로맨스를 결합한 판타지 로맨스.",genre:["로맨스","판타지","궁중"],platform:"네이버웹툰",year:2019,rating:9.4,views:131e5,popularity:91},{title:"사내 맞선",aliases:["A Business Proposal"],status:"completed",description:"회사 대표와의 맞선 해프닝을 코믹하게 전개한 로맨틱 코미디 대표작.",genre:["로맨스","코미디","오피스"],platform:"카카오페이지",year:2018,rating:8.9,views:98e5,popularity:87},{title:"내 남편과 결혼해줘",status:"completed",description:"배신 이후 회귀한 주인공의 통쾌한 복수와 재시작을 그린 회귀 로맨스.",genre:["로맨스","회귀","복수"],platform:"네이버웹툰",year:2021,rating:9.3,views:121e5,popularity:90},{title:"연애혁명",status:"completed",description:"긴 연재를 안정적으로 완결한 학원 청춘 순정 로맨스.",genre:["로맨스","학원","청춘"],platform:"네이버웹툰",year:2013,rating:8.7,views:109e5,popularity:85},{title:"살인자ㅇ난감",status:"completed",description:"우발적 살인 이후의 추격과 도덕적 균열을 집요하게 파고드는 범죄 스릴러.",genre:["스릴러","범죄","심리"],platform:"네이버웹툰",year:2010,rating:9,views:79e5,popularity:83},{title:"경이로운 소문",aliases:["The Uncanny Counter"],status:"completed",description:"악귀 사냥 액션과 가족 드라마를 균형 있게 결합한 대중형 판타지.",genre:["액션","판타지","드라마"],platform:"다음웹툰",year:2018,rating:8.8,views:86e5,popularity:82},{title:"두 번 사는 랭커",status:"ongoing",description:"과거로 돌아가 다시 강해지는 랭커의 성장과 복수를 다룬 회귀 배틀물.",genre:["판타지","액션","회귀"],platform:"카카오페이지",year:2019,rating:8.9,views:97e5,popularity:86},{title:"끝이 아닌 시작",status:"ongoing",description:"방대한 세계관과 빠른 몰입감을 강점으로 한 성장형 판타지 연재작.",genre:["판타지","액션","성장"],platform:"카카오페이지",year:2021,rating:9.1,views:74e5,popularity:80},{title:"덴마",aliases:["Denma"],status:"ongoing",description:"복잡한 우주 서사와 독보적 설정으로 컬트 팬덤을 구축한 SF 장기작.",genre:["SF","서사","우주"],platform:"네이버웹툰",year:2010,rating:8.7,views:91e5,popularity:79},{title:"장씨세가 호위무사",status:"completed",description:"강함보다 회복과 인간성을 전면에 둔 심리 중심 무협 웹툰.",genre:["무협","액션","심리"],platform:"카카오페이지",year:2019,rating:9,views:83e5,popularity:81},{title:"나이트런",aliases:["Knight Run"],status:"ongoing",description:"인류와 외계 생명체 전쟁을 깊은 설정과 비극 서사로 전개하는 SF 배틀물.",genre:["SF","액션","서사"],platform:"네이버웹툰",year:2009,rating:8.9,views:69e5,popularity:77},{title:"고수",status:"ongoing",description:"현대 무림 감성과 물리감 있는 전투 연출이 돋보이는 무협 액션.",genre:["무협","액션","격투"],platform:"네이버웹툰",year:2015,rating:9.1,views:94e5,popularity:84},{title:"외과의사 엄태웅",status:"completed",description:"현실 의료 현장을 밀도 있게 재현한 직업 성장 의학 드라마 웹툰.",genre:["드라마","의학","성장"],platform:"네이버웹툰",year:2017,rating:8.6,views:51e5,popularity:72},{title:"대학원 탈출일지",status:"completed",description:"연구실 생활과 논문 스트레스를 유머로 풀어낸 현실 공감 일상툰.",genre:["일상","코미디","공감"],platform:"네이버웹툰",year:2020,rating:8.8,views:62e5,popularity:76},{title:"와라! 편의점",status:"completed",description:"편의점 알바생들의 소소한 일상을 따뜻한 유머로 담아낸 힐링 코미디.",genre:["코미디","일상","힐링"],platform:"네이버웹툰",year:2008,rating:8.5,views:73e5,popularity:74},{title:"조선판타지야담",status:"ongoing",description:"조선 시대 괴담을 고풍스러운 작화와 단편 구조로 풀어낸 역사 판타지 호러.",genre:["호러","역사","판타지"],platform:"네이버웹툰",year:2022,rating:8.9,views:48e5,popularity:73}]},4265:(e,t,r)=>{r.d(t,{Bd:()=>a});let i=[{id:"1",user:{id:"user1",username:"드라마덕후",avatar:"/placeholder.svg?height=40&width=40",level:15},content:{title:"눈물의 여왕",category:"드라마",rating:5,text:"정말 감동적인 드라마였어요! 김수현과 김지원의 연기가 너무 좋았고, 스토리도 탄탄했습니다.",aiStyled:!0},reactions:{likes:124,dislikes:3,userReaction:null},comments:{count:28},timestamp:"2024-01-15T10:30:00Z",trending:!0,views:1250},{id:"2",user:{id:"user2",username:"웹툰러버",avatar:"/placeholder.svg?height=40&width=40",level:8},content:{title:"외모지상주의",category:"웹툰",rating:4,text:"외모에 대한 사회적 편견을 다룬 웹툰이에요. 처음엔 가볍게 봤는데 갈수록 깊이 있는 메시지를 전달하네요.",aiStyled:!1},reactions:{likes:89,dislikes:7,userReaction:null},comments:{count:15},timestamp:"2024-01-14T15:20:00Z",views:890},{id:"3",user:{id:"user3",username:"영화광",avatar:"/placeholder.svg?height=40&width=40",level:22},content:{title:"기생충",category:"영화",rating:5,text:"봉준호 감독의 역작! 계급 사회에 대한 날카로운 시선이 돋보이는 작품입니다.",aiStyled:!0},reactions:{likes:256,dislikes:12,userReaction:null},comments:{count:45},timestamp:"2024-01-13T20:45:00Z",trending:!0,views:2100}];async function a(e){return new Promise(t=>{setTimeout(()=>{let r=[...i];if(e?.category&&"all"!==e.category&&(r=r.filter(t=>t.content.category.toLowerCase()===e.category?.toLowerCase())),e?.search&&(r=r.filter(t=>t.content.title.toLowerCase().includes(e.search.toLowerCase())||t.content.text.toLowerCase().includes(e.search.toLowerCase()))),e?.sortBy)switch(e.sortBy){case"trending":r=r.sort((e,t)=>t.reactions.likes+t.comments.count-(e.reactions.likes+e.comments.count));break;case"recent":r=r.sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime());break;case"popular":r=r.sort((e,t)=>t.reactions.likes-e.reactions.likes)}e?.limit&&(r=r.slice(e.offset||0,(e.offset||0)+e.limit)),t(r)},100)})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[379,833],()=>r(1761));module.exports=i})();