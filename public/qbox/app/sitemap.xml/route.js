(()=>{var e={};e.id=5475,e.ids=[5475],e.modules={318:(e,t,a)=>{"use strict";a.d(t,{Et:()=>n,yS:()=>o,ow:()=>l,fx:()=>c});let r=[{id:"user_1",name:"김개발",email:"kim@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:1250,createdAt:"2024-01-01T00:00:00Z"},{id:"user_2",name:"박전문가",email:"park@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:2100,createdAt:"2024-01-02T00:00:00Z"},{id:"user_3",name:"이코더",email:"lee@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:890,createdAt:"2024-01-03T00:00:00Z"},{id:"ai_assistant",name:"AI Assistant",email:"ai@qbox.com",avatar:"/placeholder.svg?height=40&width=40",reputation:9999,createdAt:"2024-01-01T00:00:00Z"}],i=[{id:"q_1",title:"React에서 useEffect 의존성 배열을 올바르게 사용하는 방법",content:`React의 useEffect Hook을 사용할 때 의존성 배열을 어떻게 올바르게 설정해야 하나요?

특히 다음과 같은 상황에서 어떻게 해야 할지 궁금합니다:

1. 객체나 배열을 의존성으로 사용할 때
2. 함수를 의존성으로 사용할 때
3. 무한 루프를 방지하는 방법

실제 코드 예시와 함께 설명해주시면 감사하겠습니다.`,summary:"React useEffect의 의존성 배열 사용법에 대한 질문",tags:["React","JavaScript","Hook","useEffect"],author:r[0],createdAt:"2024-01-15T10:30:00Z",views:1250,likes:23,dislikes:1,aiGenerated:!1,answers:[{id:"a_1",content:`# React useEffect 의존성 배열 완벽 가이드

React의 \`useEffect\` Hook에서 의존성 배열을 올바르게 사용하는 방법을 단계별로 설명드리겠습니다.

## 🔍 기본 원칙

의존성 배열에는 **effect 내부에서 사용하는 모든 값**을 포함해야 합니다.

\`\`\`jsx
function MyComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // userId를 의존성에 포함
  
  return <div>{user?.name}</div>;
}
\`\`\`

## 🎯 객체/배열 의존성 처리

### 문제가 되는 코드:
\`\`\`jsx
function BadExample({ config }) {
  useEffect(() => {
    // config 객체가 매번 새로 생성되면 무한 루프 발생
    doSomething(config);
  }, [config]);
}
\`\`\`

### 해결 방법:
\`\`\`jsx
function GoodExample({ config }) {
  // 1. useMemo로 객체 메모이제이션
  const memoizedConfig = useMemo(() => config, [config.key, config.value]);
  
  useEffect(() => {
    doSomething(memoizedConfig);
  }, [memoizedConfig]);
  
  // 2. 또는 필요한 속성만 의존성에 추가
  useEffect(() => {
    doSomething(config);
  }, [config.key, config.value]);
}
\`\`\`

## 🛠️ 함수 의존성 처리

### useCallback 사용:
\`\`\`jsx
function ComponentWithFunction({ id }) {
  const fetchData = useCallback(async () => {
    const response = await fetch(\`/api/data/\${id}\`);
    return response.json();
  }, [id]);
  
  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]);
}
\`\`\`

### 함수를 effect 내부로 이동:
\`\`\`jsx
function BetterApproach({ id }) {
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(\`/api/data/\${id}\`);
      const data = await response.json();
      setData(data);
    }
    
    fetchData();
  }, [id]); // 함수가 내부에 있으므로 의존성에서 제외
}
\`\`\`

## 🚫 무한 루프 방지

### 1. 불필요한 의존성 제거
\`\`\`jsx
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // setCount는 안정적이므로 의존성에 포함하지 않아도 됨
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // 빈 배열로 한 번만 실행
}
\`\`\`

### 2. useRef로 최신 값 참조
\`\`\`jsx
function Component({ callback }) {
  const callbackRef = useRef(callback);
  
  // 최신 callback을 ref에 저장
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current(); // 항상 최신 callback 호출
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // callback이 변경되어도 effect는 재실행되지 않음
}
\`\`\`

## 📚 베스트 프랙티스

1. **ESLint 규칙 활용**: \`react-hooks/exhaustive-deps\` 규칙 사용
2. **의존성 최소화**: 꼭 필요한 값만 의존성에 포함
3. **함수형 업데이트**: \`setState(prev => prev + 1)\` 형태 사용
4. **커스텀 Hook**: 복잡한 로직은 커스텀 Hook으로 분리

이러한 패턴들을 따르면 useEffect를 안전하고 효율적으로 사용할 수 있습니다! 🚀`,author:r[3],createdAt:"2024-01-15T10:45:00Z",likes:45,dislikes:0,isAccepted:!0,aiGenerated:!0}]},{id:"q_2",title:"Next.js App Router에서 데이터 페칭 최적화 방법",content:`Next.js 13+ App Router를 사용하면서 데이터 페칭을 최적화하고 싶습니다.

현재 상황:
- 여러 컴포넌트에서 같은 API를 호출하고 있음
- 페이지 로딩 속도가 느림
- 캐싱이 제대로 되지 않는 것 같음

App Router에서 권장하는 데이터 페칭 패턴과 캐싱 전략을 알고 싶습니다.`,summary:"Next.js App Router 데이터 페칭 최적화에 대한 질문",tags:["Next.js","React","데이터페칭","성능최적화"],author:r[1],createdAt:"2024-01-14T15:20:00Z",views:890,likes:15,dislikes:0,aiGenerated:!1,answers:[]},{id:"q_3",title:"TypeScript에서 제네릭을 활용한 타입 안전한 API 클라이언트 만들기",content:`TypeScript로 타입 안전한 API 클라이언트를 만들고 싶습니다.

요구사항:
- REST API 엔드포인트별로 타입 정의
- 요청/응답 타입 자동 추론
- 에러 처리 타입 안전성
- 제네릭을 활용한 재사용 가능한 구조

어떤 패턴을 사용하는 것이 좋을까요?`,summary:"TypeScript 제네릭을 활용한 API 클라이언트 구현 방법",tags:["TypeScript","API","제네릭","타입안전성"],author:r[2],createdAt:"2024-01-13T09:15:00Z",views:567,likes:12,dislikes:0,aiGenerated:!1,answers:[]}],s=r.find(e=>"ai_assistant"===e.id),n=[...i,...[{title:"JavaScript var, let, const 차이점은?",tags:["JavaScript"],summary:"var let const 스코프와 호이스팅 차이",answer:"var는 함수 스코프, let/const는 블록 스코프입니다. const는 재할당이 불가능합니다."},{title:"Python 리스트와 튜플의 차이는?",tags:["Python"],summary:"Python list vs tuple",answer:"리스트는 가변(mutable), 튜플은 불변(immutable) 시퀀스입니다."},{title:"Docker와 가상머신의 차이는?",tags:["Docker","DevOps"],summary:"컨테이너 vs VM",answer:"Docker는 OS 커널을 공유하는 경량 격리, VM은 하이퍼바이저 위 전체 OS를 실행합니다."},{title:"REST API와 GraphQL 차이점",tags:["API","GraphQL"],summary:"REST vs GraphQL 비교",answer:"REST는 리소스 중심 엔드포인트, GraphQL은 단일 엔드포인트에서 필요한 필드만 조회합니다."},{title:"Git merge와 rebase 차이",tags:["Git"],summary:"merge vs rebase",answer:"merge는 병합 커밋을 남기고, rebase는 커밋 히스토리를 재배치해 선형으로 만듭니다."},{title:"SQL INNER JOIN과 LEFT JOIN 차이",tags:["SQL","데이터베이스"],summary:"JOIN 종류 설명",answer:"INNER JOIN은 양쪽 모두 매칭되는 행만, LEFT JOIN은 왼쪽 테이블 전체와 오른쪽 매칭 행을 반환합니다."},{title:"React Server Components란?",tags:["React","Next.js"],summary:"RSC 개념",answer:"서버에서만 렌더링되는 컴포넌트로, 번들 크기를 줄이고 데이터 페칭을 서버에서 처리합니다."},{title:"Next.js SSR과 SSG 차이",tags:["Next.js"],summary:"SSR SSG ISR 비교",answer:"SSG는 빌드 시 HTML 생성, SSR은 요청마다 생성, ISR은 주기적 재생성입니다."},{title:"JWT 토큰 구조와 보안 주의점",tags:["보안","인증"],summary:"JWT 설명",answer:"Header.Payload.Signature 구조이며, 민감 정보 저장과 만료\xb7서명 검증이 중요합니다."},{title:"OAuth 2.0 인가 코드 플로우란?",tags:["OAuth","보안"],summary:"OAuth authorization code",answer:"클라이언트가 인가 코드를 받아 서버에서 토큰으로 교환하는 가장 안전한 플로우입니다."},{title:"Redis는 언제 사용하나요?",tags:["Redis","데이터베이스"],summary:"Redis 활용 사례",answer:"캐시, 세션, 랭킹, Pub/Sub 등 고속 인메모리 저장이 필요할 때 사용합니다."},{title:"MongoDB와 MySQL 선택 기준",tags:["MongoDB","MySQL"],summary:"NoSQL vs RDB",answer:"스키마 유연성\xb7문서 구조는 MongoDB, 트랜잭션\xb7관계형 쿼리는 MySQL이 유리합니다."},{title:"Kubernetes Pod와 Deployment 차이",tags:["Kubernetes","DevOps"],summary:"K8s 기본 리소스",answer:"Pod는 최소 실행 단위, Deployment는 Pod 복제\xb7롤링 업데이트를 관리합니다."},{title:"AWS EC2와 Lambda 차이",tags:["AWS","클라우드"],summary:"EC2 vs Lambda",answer:"EC2는 상시 서버, Lambda는 이벤트 기반 서버리스 실행입니다."},{title:"TypeScript interface와 type alias 차이",tags:["TypeScript"],summary:"interface vs type",answer:"interface는 확장(extends)에 유리하고, type은 유니온\xb7교차 타입 표현에 유연합니다."},{title:"CSS Flexbox와 Grid 언제 쓰나?",tags:["CSS","프론트엔드"],summary:"Flex vs Grid",answer:"1차원 레이아웃은 Flexbox, 2차원 격자 레이아웃은 Grid가 적합합니다."},{title:"웹 접근성 aria-label이란?",tags:["접근성","HTML"],summary:"ARIA 기초",answer:"스크린 리더용 보조 레이블로, 시각적 텍스트 없이 요소 목적을 설명합니다."},{title:"CORS 에러 원인과 해결",tags:["웹","보안"],summary:"CORS 해결",answer:"브라우저가 다른 출처 요청을 차단할 때 발생하며, 서버 Access-Control-Allow-Origin 설정이 필요합니다."},{title:"HTTPS와 SSL/TLS 차이",tags:["보안","네트워크"],summary:"HTTPS TLS",answer:"HTTPS는 HTTP over TLS로, TLS가 전송 구간 암호화를 담당합니다."},{title:"마이크로서비스 vs 모놀리식",tags:["아키텍처"],summary:"MSA 비교",answer:"모놀리식은 단일 배포 단위, MSA는 서비스별 독립 배포\xb7확장이 가능합니다."},{title:"CI/CD 파이프라인이란?",tags:["DevOps","CI/CD"],summary:"CI CD 개념",answer:"코드 통합(CI)과 자동 배포(CD)를 자동화해 품질과 배포 속도를 높입니다."},{title:"Elasticsearch는 무엇에 쓰나?",tags:["Elasticsearch","검색"],summary:"Elasticsearch 용도",answer:"전문 검색, 로그 분석, 대용량 텍스트 인덱싱에 사용됩니다."},{title:"React Query vs SWR 비교",tags:["React","데이터페칭"],summary:"데이터 페칭 라이브러리",answer:"둘 다 서버 상태 캐싱이지만 React Query는 기능이 풍부, SWR은 가볍고 단순합니다."},{title:"Tailwind CSS 장단점",tags:["CSS","Tailwind"],summary:"Tailwind 소개",answer:"유틸리티 클래스로 빠른 UI 개발이 가능하나 HTML이 길어질 수 있습니다."},{title:"Prisma ORM 기본 사용법",tags:["Prisma","데이터베이스"],summary:"Prisma 시작",answer:"schema.prisma로 모델 정의 후 migrate와 Client로 타입 안전 쿼리를 실행합니다."},{title:"Node.js 이벤트 루프란?",tags:["Node.js","JavaScript"],summary:"이벤트 루프",answer:"비동기 I/O를 처리하는 메커니즘으로 call stack, task queue, microtask queue로 동작합니다."},{title:"웹 성능 LCP, FID, CLS란?",tags:["성능최적화","웹"],summary:"Core Web Vitals",answer:"LCP는 최대 콘텐츠 페인트, FID는 첫 입력 지연, CLS는 레이아웃 이동 지표입니다."}].map((e,t)=>(function(e,t,a){let r=`q_seo_${e+1}`,i=new Date(Date.UTC(2025,0,1+e)).toISOString(),n={id:`a_seo_${e+1}`,content:t.answer,author:s,createdAt:i,likes:10+e%20,dislikes:0,isAccepted:!0,aiGenerated:!0};return{id:r,title:t.title,content:`${t.title}

개발자들이 자주 검색하는 질문입니다. ${t.summary}`,summary:t.summary,tags:t.tags,author:a,createdAt:i,views:200+37*e,likes:5+e%15,dislikes:0,aiGenerated:!0,answers:[n]}})(t,e,r[t%3]))];function o(e){return n.find(t=>t.id===e)??null}function l(){return n.map(e=>({id:e.id}))}function c(){let e=new Map;for(let t of n)for(let a of t.tags)e.set(a,(e.get(a)??0)+1);return[...e.entries()].map(([e,t])=>({id:`tag_${e}`,name:e,questionCount:t,createdAt:"2025-01-01T00:00:00Z"}))}},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},12127:(e,t,a)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var a in t)Object.defineProperty(e,a,{enumerable:!0,get:t[a]})}(t,{resolveManifest:function(){return n},resolveRobots:function(){return i},resolveRouteData:function(){return o},resolveSitemap:function(){return s}});let r=a(77341);function i(e){let t="";for(let a of Array.isArray(e.rules)?e.rules:[e.rules]){for(let e of(0,r.resolveArray)(a.userAgent||["*"]))t+=`User-Agent: ${e}
`;if(a.allow)for(let e of(0,r.resolveArray)(a.allow))t+=`Allow: ${e}
`;if(a.disallow)for(let e of(0,r.resolveArray)(a.disallow))t+=`Disallow: ${e}
`;a.crawlDelay&&(t+=`Crawl-delay: ${a.crawlDelay}
`),t+="\n"}return e.host&&(t+=`Host: ${e.host}
`),e.sitemap&&(0,r.resolveArray)(e.sitemap).forEach(e=>{t+=`Sitemap: ${e}
`}),t}function s(e){let t=e.some(e=>Object.keys(e.alternates??{}).length>0),a=e.some(e=>{var t;return!!(null==(t=e.images)?void 0:t.length)}),r=e.some(e=>{var t;return!!(null==(t=e.videos)?void 0:t.length)}),i="";for(let l of(i+='<?xml version="1.0" encoding="UTF-8"?>\n',i+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',a&&(i+=' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'),r&&(i+=' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'),t?i+=' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n':i+=">\n",e)){var s,n,o;i+="<url>\n",i+=`<loc>${l.url}</loc>
`;let e=null==(s=l.alternates)?void 0:s.languages;if(e&&Object.keys(e).length)for(let t in e)i+=`<xhtml:link rel="alternate" hreflang="${t}" href="${e[t]}" />
`;if(null==(n=l.images)?void 0:n.length)for(let e of l.images)i+=`<image:image>
<image:loc>${e}</image:loc>
</image:image>
`;if(null==(o=l.videos)?void 0:o.length)for(let e of l.videos)i+=["<video:video>",`<video:title>${e.title}</video:title>`,`<video:thumbnail_loc>${e.thumbnail_loc}</video:thumbnail_loc>`,`<video:description>${e.description}</video:description>`,e.content_loc&&`<video:content_loc>${e.content_loc}</video:content_loc>`,e.player_loc&&`<video:player_loc>${e.player_loc}</video:player_loc>`,e.duration&&`<video:duration>${e.duration}</video:duration>`,e.view_count&&`<video:view_count>${e.view_count}</video:view_count>`,e.tag&&`<video:tag>${e.tag}</video:tag>`,e.rating&&`<video:rating>${e.rating}</video:rating>`,e.expiration_date&&`<video:expiration_date>${e.expiration_date}</video:expiration_date>`,e.publication_date&&`<video:publication_date>${e.publication_date}</video:publication_date>`,e.family_friendly&&`<video:family_friendly>${e.family_friendly}</video:family_friendly>`,e.requires_subscription&&`<video:requires_subscription>${e.requires_subscription}</video:requires_subscription>`,e.live&&`<video:live>${e.live}</video:live>`,e.restriction&&`<video:restriction relationship="${e.restriction.relationship}">${e.restriction.content}</video:restriction>`,e.platform&&`<video:platform relationship="${e.platform.relationship}">${e.platform.content}</video:platform>`,e.uploader&&`<video:uploader${e.uploader.info&&` info="${e.uploader.info}"`}>${e.uploader.content}</video:uploader>`,`</video:video>
`].filter(Boolean).join("\n");if(l.lastModified){let e=l.lastModified instanceof Date?l.lastModified.toISOString():l.lastModified;i+=`<lastmod>${e}</lastmod>
`}l.changeFrequency&&(i+=`<changefreq>${l.changeFrequency}</changefreq>
`),"number"==typeof l.priority&&(i+=`<priority>${l.priority}</priority>
`),i+="</url>\n"}return i+"</urlset>\n"}function n(e){return JSON.stringify(e)}function o(e,t){return"robots"===t?i(e):"sitemap"===t?s(e):"manifest"===t?n(e):""}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},46358:(e,t,a)=>{"use strict";a.d(t,{F:()=>i});let r="qbox";async function i(){let e=[],t=1;try{for(;t<=30;){let a=new URLSearchParams({subdomain:r,status:"published",page:String(t),pageSize:"100"}),i=await fetch(`https://app.restyart.com/api/posts?${a}`,{headers:{"x-subdomain":r,Accept:"application/json"},cache:"no-store"});if(!i.ok)break;let s=await i.json();for(let t of s.items||[])null!=t.id&&e.push({id:String(t.id)});if(!s.hasMore)break;t+=1}}catch(e){console.warn("[qbox/static-question-params]",e)}return e}},61595:(e,t,a)=>{"use strict";a.r(t),a.d(t,{patchFetch:()=>S,routeModule:()=>g,serverHooks:()=>w,workAsyncStorage:()=>v,workUnitAsyncStorage:()=>h});var r={};a.r(r),a.d(r,{default:()=>m,dynamic:()=>d});var i={};a.r(i),a.d(i,{GET:()=>y,dynamic:()=>d});var s=a(96559),n=a(48088),o=a(37719),l=a(32190),c=a(318),u=a(46358);let d="force-dynamic";async function m(){let e="https://qbox.restyart.com",t=new Date,a=[{url:e,lastModified:t,changeFrequency:"daily",priority:1},{url:`${e}/questions`,lastModified:t,changeFrequency:"daily",priority:.9},{url:`${e}/tags`,lastModified:t,changeFrequency:"weekly",priority:.7},{url:`${e}/ask`,lastModified:t,changeFrequency:"monthly",priority:.6},{url:`${e}/privacy`,lastModified:t,changeFrequency:"yearly",priority:.3},{url:`${e}/terms`,lastModified:t,changeFrequency:"yearly",priority:.3}],r=c.Et.map(t=>({url:`${e}/question/${t.id}`,lastModified:new Date(t.updatedAt||t.createdAt),changeFrequency:"weekly",priority:.8})),i=new Set(c.Et.map(e=>e.id));return[...a,...r,...(await (0,u.F)()).filter(({id:e})=>!i.has(e)&&!e.startsWith("q_seo_")).map(({id:a})=>({url:`${e}/question/${a}`,lastModified:t,changeFrequency:"weekly",priority:.75})),...(0,c.fx)().map(a=>({url:`${e}/tag/${encodeURIComponent(a.name)}`,lastModified:t,changeFrequency:"weekly",priority:.65}))]}var p=a(12127);let f={...r}.default;if("function"!=typeof f)throw Error('Default export is missing in "/Users/baejinho/Documents/resty/qbox/app/sitemap.ts"');async function y(e,t){let{__metadata_id__:a,...r}=await t.params||{},i=!!a&&a.endsWith(".xml");if(a&&!i)return new l.NextResponse("Not Found",{status:404});let s=a&&i?a.slice(0,-4):void 0,n=await f({id:s}),o=(0,p.resolveRouteData)(n,"sitemap");return new l.NextResponse(o,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=0, must-revalidate"}})}let g=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"sitemap",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"next-metadata-route-loader?filePath=%2FUsers%2Fbaejinho%2FDocuments%2Fresty%2Fqbox%2Fapp%2Fsitemap.ts&isDynamicRouteExtension=1!?__next_metadata_route__",nextConfigOutput:"",userland:i}),{workAsyncStorage:v,workUnitAsyncStorage:h,serverHooks:w}=g;function S(){return(0,o.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:h})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},77341:(e,t)=>{"use strict";function a(e){return Array.isArray(e)?e:[e]}function r(e){if(null!=e)return a(e)}function i(e){let t;if("string"==typeof e)try{t=(e=new URL(e)).origin}catch{}return t}Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var a in t)Object.defineProperty(e,a,{enumerable:!0,get:t[a]})}(t,{getOrigin:function(){return i},resolveArray:function(){return a},resolveAsArrayOrUndefined:function(){return r}})},78335:()=>{},96487:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[4447,580],()=>a(61595));module.exports=r})();