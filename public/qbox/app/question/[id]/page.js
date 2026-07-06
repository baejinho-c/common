(()=>{var e={};e.id=1867,e.ids=[1867],e.modules={318:(e,t,a)=>{"use strict";a.d(t,{Et:()=>i,yS:()=>l,ow:()=>o,fx:()=>c});let s=[{id:"user_1",name:"김개발",email:"kim@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:1250,createdAt:"2024-01-01T00:00:00Z"},{id:"user_2",name:"박전문가",email:"park@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:2100,createdAt:"2024-01-02T00:00:00Z"},{id:"user_3",name:"이코더",email:"lee@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:890,createdAt:"2024-01-03T00:00:00Z"},{id:"ai_assistant",name:"AI Assistant",email:"ai@qbox.com",avatar:"/placeholder.svg?height=40&width=40",reputation:9999,createdAt:"2024-01-01T00:00:00Z"}],r=[{id:"q_1",title:"React에서 useEffect 의존성 배열을 올바르게 사용하는 방법",content:`React의 useEffect Hook을 사용할 때 의존성 배열을 어떻게 올바르게 설정해야 하나요?

특히 다음과 같은 상황에서 어떻게 해야 할지 궁금합니다:

1. 객체나 배열을 의존성으로 사용할 때
2. 함수를 의존성으로 사용할 때
3. 무한 루프를 방지하는 방법

실제 코드 예시와 함께 설명해주시면 감사하겠습니다.`,summary:"React useEffect의 의존성 배열 사용법에 대한 질문",tags:["React","JavaScript","Hook","useEffect"],author:s[0],createdAt:"2024-01-15T10:30:00Z",views:1250,likes:23,dislikes:1,aiGenerated:!1,answers:[{id:"a_1",content:`# React useEffect 의존성 배열 완벽 가이드

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

이러한 패턴들을 따르면 useEffect를 안전하고 효율적으로 사용할 수 있습니다! 🚀`,author:s[3],createdAt:"2024-01-15T10:45:00Z",likes:45,dislikes:0,isAccepted:!0,aiGenerated:!0}]},{id:"q_2",title:"Next.js App Router에서 데이터 페칭 최적화 방법",content:`Next.js 13+ App Router를 사용하면서 데이터 페칭을 최적화하고 싶습니다.

현재 상황:
- 여러 컴포넌트에서 같은 API를 호출하고 있음
- 페이지 로딩 속도가 느림
- 캐싱이 제대로 되지 않는 것 같음

App Router에서 권장하는 데이터 페칭 패턴과 캐싱 전략을 알고 싶습니다.`,summary:"Next.js App Router 데이터 페칭 최적화에 대한 질문",tags:["Next.js","React","데이터페칭","성능최적화"],author:s[1],createdAt:"2024-01-14T15:20:00Z",views:890,likes:15,dislikes:0,aiGenerated:!1,answers:[]},{id:"q_3",title:"TypeScript에서 제네릭을 활용한 타입 안전한 API 클라이언트 만들기",content:`TypeScript로 타입 안전한 API 클라이언트를 만들고 싶습니다.

요구사항:
- REST API 엔드포인트별로 타입 정의
- 요청/응답 타입 자동 추론
- 에러 처리 타입 안전성
- 제네릭을 활용한 재사용 가능한 구조

어떤 패턴을 사용하는 것이 좋을까요?`,summary:"TypeScript 제네릭을 활용한 API 클라이언트 구현 방법",tags:["TypeScript","API","제네릭","타입안전성"],author:s[2],createdAt:"2024-01-13T09:15:00Z",views:567,likes:12,dislikes:0,aiGenerated:!1,answers:[]}],n=s.find(e=>"ai_assistant"===e.id),i=[...r,...[{title:"JavaScript var, let, const 차이점은?",tags:["JavaScript"],summary:"var let const 스코프와 호이스팅 차이",answer:"var는 함수 스코프, let/const는 블록 스코프입니다. const는 재할당이 불가능합니다."},{title:"Python 리스트와 튜플의 차이는?",tags:["Python"],summary:"Python list vs tuple",answer:"리스트는 가변(mutable), 튜플은 불변(immutable) 시퀀스입니다."},{title:"Docker와 가상머신의 차이는?",tags:["Docker","DevOps"],summary:"컨테이너 vs VM",answer:"Docker는 OS 커널을 공유하는 경량 격리, VM은 하이퍼바이저 위 전체 OS를 실행합니다."},{title:"REST API와 GraphQL 차이점",tags:["API","GraphQL"],summary:"REST vs GraphQL 비교",answer:"REST는 리소스 중심 엔드포인트, GraphQL은 단일 엔드포인트에서 필요한 필드만 조회합니다."},{title:"Git merge와 rebase 차이",tags:["Git"],summary:"merge vs rebase",answer:"merge는 병합 커밋을 남기고, rebase는 커밋 히스토리를 재배치해 선형으로 만듭니다."},{title:"SQL INNER JOIN과 LEFT JOIN 차이",tags:["SQL","데이터베이스"],summary:"JOIN 종류 설명",answer:"INNER JOIN은 양쪽 모두 매칭되는 행만, LEFT JOIN은 왼쪽 테이블 전체와 오른쪽 매칭 행을 반환합니다."},{title:"React Server Components란?",tags:["React","Next.js"],summary:"RSC 개념",answer:"서버에서만 렌더링되는 컴포넌트로, 번들 크기를 줄이고 데이터 페칭을 서버에서 처리합니다."},{title:"Next.js SSR과 SSG 차이",tags:["Next.js"],summary:"SSR SSG ISR 비교",answer:"SSG는 빌드 시 HTML 생성, SSR은 요청마다 생성, ISR은 주기적 재생성입니다."},{title:"JWT 토큰 구조와 보안 주의점",tags:["보안","인증"],summary:"JWT 설명",answer:"Header.Payload.Signature 구조이며, 민감 정보 저장과 만료\xb7서명 검증이 중요합니다."},{title:"OAuth 2.0 인가 코드 플로우란?",tags:["OAuth","보안"],summary:"OAuth authorization code",answer:"클라이언트가 인가 코드를 받아 서버에서 토큰으로 교환하는 가장 안전한 플로우입니다."},{title:"Redis는 언제 사용하나요?",tags:["Redis","데이터베이스"],summary:"Redis 활용 사례",answer:"캐시, 세션, 랭킹, Pub/Sub 등 고속 인메모리 저장이 필요할 때 사용합니다."},{title:"MongoDB와 MySQL 선택 기준",tags:["MongoDB","MySQL"],summary:"NoSQL vs RDB",answer:"스키마 유연성\xb7문서 구조는 MongoDB, 트랜잭션\xb7관계형 쿼리는 MySQL이 유리합니다."},{title:"Kubernetes Pod와 Deployment 차이",tags:["Kubernetes","DevOps"],summary:"K8s 기본 리소스",answer:"Pod는 최소 실행 단위, Deployment는 Pod 복제\xb7롤링 업데이트를 관리합니다."},{title:"AWS EC2와 Lambda 차이",tags:["AWS","클라우드"],summary:"EC2 vs Lambda",answer:"EC2는 상시 서버, Lambda는 이벤트 기반 서버리스 실행입니다."},{title:"TypeScript interface와 type alias 차이",tags:["TypeScript"],summary:"interface vs type",answer:"interface는 확장(extends)에 유리하고, type은 유니온\xb7교차 타입 표현에 유연합니다."},{title:"CSS Flexbox와 Grid 언제 쓰나?",tags:["CSS","프론트엔드"],summary:"Flex vs Grid",answer:"1차원 레이아웃은 Flexbox, 2차원 격자 레이아웃은 Grid가 적합합니다."},{title:"웹 접근성 aria-label이란?",tags:["접근성","HTML"],summary:"ARIA 기초",answer:"스크린 리더용 보조 레이블로, 시각적 텍스트 없이 요소 목적을 설명합니다."},{title:"CORS 에러 원인과 해결",tags:["웹","보안"],summary:"CORS 해결",answer:"브라우저가 다른 출처 요청을 차단할 때 발생하며, 서버 Access-Control-Allow-Origin 설정이 필요합니다."},{title:"HTTPS와 SSL/TLS 차이",tags:["보안","네트워크"],summary:"HTTPS TLS",answer:"HTTPS는 HTTP over TLS로, TLS가 전송 구간 암호화를 담당합니다."},{title:"마이크로서비스 vs 모놀리식",tags:["아키텍처"],summary:"MSA 비교",answer:"모놀리식은 단일 배포 단위, MSA는 서비스별 독립 배포\xb7확장이 가능합니다."},{title:"CI/CD 파이프라인이란?",tags:["DevOps","CI/CD"],summary:"CI CD 개념",answer:"코드 통합(CI)과 자동 배포(CD)를 자동화해 품질과 배포 속도를 높입니다."},{title:"Elasticsearch는 무엇에 쓰나?",tags:["Elasticsearch","검색"],summary:"Elasticsearch 용도",answer:"전문 검색, 로그 분석, 대용량 텍스트 인덱싱에 사용됩니다."},{title:"React Query vs SWR 비교",tags:["React","데이터페칭"],summary:"데이터 페칭 라이브러리",answer:"둘 다 서버 상태 캐싱이지만 React Query는 기능이 풍부, SWR은 가볍고 단순합니다."},{title:"Tailwind CSS 장단점",tags:["CSS","Tailwind"],summary:"Tailwind 소개",answer:"유틸리티 클래스로 빠른 UI 개발이 가능하나 HTML이 길어질 수 있습니다."},{title:"Prisma ORM 기본 사용법",tags:["Prisma","데이터베이스"],summary:"Prisma 시작",answer:"schema.prisma로 모델 정의 후 migrate와 Client로 타입 안전 쿼리를 실행합니다."},{title:"Node.js 이벤트 루프란?",tags:["Node.js","JavaScript"],summary:"이벤트 루프",answer:"비동기 I/O를 처리하는 메커니즘으로 call stack, task queue, microtask queue로 동작합니다."},{title:"웹 성능 LCP, FID, CLS란?",tags:["성능최적화","웹"],summary:"Core Web Vitals",answer:"LCP는 최대 콘텐츠 페인트, FID는 첫 입력 지연, CLS는 레이아웃 이동 지표입니다."}].map((e,t)=>(function(e,t,a){let s=`q_seo_${e+1}`,r=new Date(Date.UTC(2025,0,1+e)).toISOString(),i={id:`a_seo_${e+1}`,content:t.answer,author:n,createdAt:r,likes:10+e%20,dislikes:0,isAccepted:!0,aiGenerated:!0};return{id:s,title:t.title,content:`${t.title}

개발자들이 자주 검색하는 질문입니다. ${t.summary}`,summary:t.summary,tags:t.tags,author:a,createdAt:r,views:200+37*e,likes:5+e%15,dislikes:0,aiGenerated:!0,answers:[i]}})(t,e,s[t%3]))];function l(e){return i.find(t=>t.id===e)??null}function o(){return i.map(e=>({id:e.id}))}function c(){let e=new Map;for(let t of i)for(let a of t.tags)e.set(a,(e.get(a)??0)+1);return[...e.entries()].map(([e,t])=>({id:`tag_${e}`,name:e,questionCount:t,createdAt:"2025-01-01T00:00:00Z"}))}},2117:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(62688).A)("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}]])},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5336:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(62688).A)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},5768:(e,t,a)=>{"use strict";function s(e){return`/question/${e}/`}function r(e){let t=(e??"").replace(/\/$/,"").match(/\/question\/([^/]+)$/);return t?.[1]??""}a.d(t,{G:()=>s,g:()=>r})},7965:(e,t,a)=>{"use strict";a.d(t,{w:()=>d});var s=a(60687),r=a(43210),n=a(14163),i="horizontal",l=["horizontal","vertical"],o=r.forwardRef((e,t)=>{var a;let{decorative:r,orientation:o=i,...c}=e,d=(a=o,l.includes(a))?o:i;return(0,s.jsx)(n.sG.div,{"data-orientation":d,...r?{role:"none"}:{"aria-orientation":"vertical"===d?d:void 0,role:"separator"},...c,ref:t})});o.displayName="Separator";var c=a(96241);let d=r.forwardRef(({className:e,orientation:t="horizontal",decorative:a=!0,...r},n)=>(0,s.jsx)(o,{ref:n,decorative:a,orientation:t,className:(0,c.cn)("shrink-0 bg-border","horizontal"===t?"h-[1px] w-full":"h-full w-[1px]",e),...r}));d.displayName=o.displayName},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},13861:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(62688).A)("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},15616:(e,t,a)=>{"use strict";a.d(t,{T:()=>i});var s=a(60687),r=a(43210),n=a(96241);let i=r.forwardRef(({className:e,...t},a)=>(0,s.jsx)("textarea",{className:(0,n.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:a,...t}));i.displayName="Textarea"},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},22151:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>d,generateMetadata:()=>c,generateStaticParams:()=>o});var s=a(37413),r=a(73679),n=a(318),i=a(70233),l=a(46358);async function o(){let e=(0,n.ow)(),t=await (0,l.F)(),a=new Set(e.map(e=>e.id)),s=[...e];for(let{id:e}of t)a.has(e)||(s.push({id:e}),a.add(e));return s}async function c({params:e}){let t=(0,n.yS)(e.id)??await (0,i.X6)(e.id);if(!t)return{title:"질문을 찾을 수 없습니다 | QBox"};let a=`${t.title} | QBox`,s=t.summary||t.content.slice(0,150);return{title:a,description:s,keywords:t.tags.join(", "),openGraph:{title:a,description:s,type:"article",locale:"ko_KR"},alternates:{canonical:`https://qbox.restyart.com/question/${t.id}`}}}async function d({params:e}){let t=(0,n.yS)(e.id)??await (0,i.X6)(e.id),a=t?{"@context":"https://schema.org","@type":"QAPage",mainEntity:{"@type":"Question",name:t.title,text:t.content,dateCreated:t.createdAt,author:{"@type":"Person",name:t.author.name},url:`https://qbox.restyart.com/question/${t.id}`,...t.answers&&t.answers.length>0&&{acceptedAnswer:t.answers.filter(e=>e.isAccepted).map(e=>({"@type":"Answer",text:e.content,dateCreated:e.createdAt,author:{"@type":"Person",name:e.author.name}}))[0],suggestedAnswer:t.answers.filter(e=>!e.isAccepted).map(e=>({"@type":"Answer",text:e.content,dateCreated:e.createdAt,author:{"@type":"Person",name:e.author.name}}))}}}:null;return(0,s.jsxs)(s.Fragment,{children:[a&&(0,s.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(a)}}),(0,s.jsx)(r.default,{initialQuestion:t})]})}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},46358:(e,t,a)=>{"use strict";a.d(t,{F:()=>r});let s="qbox";async function r(){let e=[],t=1;try{for(;t<=30;){let a=new URLSearchParams({subdomain:s,status:"published",page:String(t),pageSize:"100"}),r=await fetch(`https://app.restyart.com/api/posts?${a}`,{headers:{"x-subdomain":s,Accept:"application/json"},cache:"no-store"});if(!r.ok)break;let n=await r.json();for(let t of n.items||[])null!=t.id&&e.push({id:String(t.id)});if(!n.hasMore)break;t+=1}}catch(e){console.warn("[qbox/static-question-params]",e)}return e}},47620:(e,t,a)=>{Promise.resolve().then(a.bind(a,73679))},48730:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(62688).A)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]])},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},70233:(e,t,a)=>{"use strict";a.d(t,{K4:()=>c,X6:()=>d,fetchAllTags:()=>m});let s="qbox",r="https://app.restyart.com/api";function n(e=!1){return{"Content-Type":"application/json","x-subdomain":s}}function i(e){let t=e.tags;return Array.isArray(t)?t.map(e=>"string"==typeof e?e:String(e.name||"")).filter(Boolean):[]}async function l(e){return await Promise.all(e.map(async e=>{if(e.tags.length)return e;try{let t=await fetch(`${r}/posts/${e.id}?subdomain=${s}`,{headers:n()});if(!t.ok)return e;let a=await t.json(),l=i(a);return l.length?{...e,tags:l}:e}catch{return e}}))}function o(e,t=[]){let a=function(e){let t=e.meta_json;if(!t)return{};if("object"==typeof t)return t;try{return JSON.parse(String(t))}catch{return{}}}(e),s=Number(e.comments_count)||t.length,r=t.length?t:function(e,t=!1){let a=Math.max(0,e);return 0===a?[]:Array.from({length:a},(e,a)=>({id:`stub-${a}`,content:"",author:{id:"stub",name:"",email:"",reputation:0,createdAt:""},createdAt:"",likes:0,dislikes:0,isAccepted:!1,aiGenerated:t&&0===a}))}(s);return{id:String(e.id),title:String(e.title||""),content:String(e.content||""),summary:a.summary?String(a.summary):void 0,tags:i(e),author:function(e){let t=!!e.is_anonymous;return{id:t?"anonymous":String(e.author_user_id||"unknown"),name:t?String(e.anonymous_name||"익명"):String(e.display_author||e.author_name||"회원"),email:"",reputation:0,createdAt:String(e.created_at||new Date().toISOString())}}(e),createdAt:String(e.published_at||e.created_at||""),updatedAt:String(e.updated_at||""),views:Number(a.views)||0,likes:Number(e.likes_count)||0,dislikes:0,aiGenerated:!1,answers:r}}async function c(e={}){let{limit:t=20,offset:a=0,search:i,tag:d,sortBy:u="newest"}=e,m=new URLSearchParams({subdomain:s,status:"published",page:String(Math.floor(a/t)+1),pageSize:String(t),isSns:"true"});i&&m.set("q",i),d&&m.set("tag",d);let p=await fetch(`${r}/posts?${m}`,{headers:n()});if(!p.ok)throw Error("질문 목록을 불러오지 못했습니다");let h=await p.json(),x=(h.items??[]).map(e=>o(e));return x.some(e=>!e.tags.length)&&x.length<=20&&(x=await l(x)),"oldest"===u?x.sort((e,t)=>new Date(e.createdAt).getTime()-new Date(t.createdAt).getTime()):"most-viewed"===u?x.sort((e,t)=>t.views-e.views):"most-liked"===u&&x.sort((e,t)=>t.likes-e.likes),{questions:x,totalCount:Number(h.total)||x.length}}async function d(e){let t=new URLSearchParams({subdomain:s}),a=await fetch(`${r}/posts/${e}?${t}`,{headers:n(),cache:"no-store"});if(404===a.status)return null;if(!a.ok)throw Error("질문을 불러오지 못했습니다");let i=await a.json(),l=await fetch(`${r}/posts/${e}/comments?${t}&pageSize=100`,{headers:n(),cache:"no-store"}),c=[];return l.ok&&(c=((await l.json()).items??[]).map(e=>(function(e,t){let a=e.is_anonymous?String(e.anonymous_name||"익명"):String(e.display_author||e.author_name||"회원"),s=/ai assistant|ai/i.test(a);return{id:String(e.id),content:String(e.content||""),author:{id:String(e.author_user_id||e.user_id||"anonymous"),name:a,email:"",reputation:0,createdAt:String(e.created_at||"")},createdAt:String(e.created_at||""),likes:0,dislikes:0,isAccepted:!1,aiGenerated:s}})(e,0))),o(i,c)}async function u(e=10){try{let t=await fetch(`${r}/tags?subdomain=${s}&limit=200`,{headers:n()});if(t.ok)return((await t.json()).items??[]).slice(0,e).map((e,t)=>({id:String(e.id??`tag-${t}`),name:String(e.name??""),questionCount:Number(e.question_count)||0,createdAt:new Date().toISOString()}))}catch{}let{questions:t}=await c({limit:100,offset:0}),a=new Map;for(let e of t)for(let t of e.tags)a.set(t,(a.get(t)||0)+1);return[...a.entries()].sort((e,t)=>t[1]-e[1]).slice(0,e).map(([e,t],a)=>({id:`tag-${a}`,name:e,questionCount:t,createdAt:new Date().toISOString()}))}async function m(){return u(100)}},73679:(e,t,a)=>{"use strict";a.d(t,{default:()=>s});let s=(0,a(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/baejinho/Documents/resty/qbox/app/question/[id]/QuestionDetailClient.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/baejinho/Documents/resty/qbox/app/question/[id]/QuestionDetailClient.tsx","default")},77495:(e,t,a)=>{"use strict";a.d(t,{default:()=>R});var s=a(60687),r=a(43210),n=a(85814),i=a.n(n),l=a(16189),o=a(24934),c=a(55192),d=a(59821),u=a(15616),m=a(7965),p=a(93613),h=a(13861),x=a(58887),f=a(48730),g=a(58869),y=a(56085),w=a(5336),v=a(61775),b=a(2117),j=a(71702),S=a(51108),A=a(96241);function N({targetId:e,likeType:t="post",initialLikeCount:a=0,size:n="sm",variant:i="ghost",className:l,showLabel:c=!1}){let[d,u]=(0,r.useState)(!1),[m,p]=(0,r.useState)(a),[h,x]=(0,r.useState)(!1),{toast:f}=(0,j.dj)(),{isAuthenticated:g}=(0,S.A)(),y=async()=>{if(!g){f({title:"로그인이 필요합니다",description:"좋아요를 누르려면 로그인해 주세요.",variant:"destructive"});return}f({title:"로그인이 필요합니다",description:"세션이 만료되었습니다. 다시 로그인해 주세요.",variant:"destructive"})};return(0,s.jsxs)(o.$,{type:"button",variant:d?"default":i,size:n,onClick:()=>void y(),disabled:h,className:(0,A.cn)(d&&"bg-[#0891b2] hover:bg-[#0e7490] text-white",l),children:[(0,s.jsx)(b.A,{className:(0,A.cn)("h-4 w-4","mr-1",d&&"fill-current")}),m,c&&(0,s.jsx)("span",{className:"ml-1 hidden sm:inline",children:"좋아요"})]})}var k=a(79496),C=a(5768);function R({initialQuestion:e=null}){let t=function(e){let t=(0,C.g)();return t||("string"==typeof e?e:Array.isArray(e)&&e[0]?e[0]:"")}((0,l.useParams)().id),[a]=(0,r.useState)(()=>{var a;return(a=e??null)&&String(a.id)===t?a:null}),[n,b]=(0,r.useState)(a),[j,S]=(0,r.useState)(!a),[A,R]=(0,r.useState)(""),[T,_]=(0,r.useState)(!1),[P,q]=(0,r.useState)(!1),E=async e=>{if(e.preventDefault(),A.trim()&&n){_(!0);try{await (0,k.x9)(n.id,A.trim()),R("");let e=await (0,k.ph)(n.id);b(e)}catch(e){console.error("답변 등록 실패:",e)}finally{_(!1)}}},D=e=>{let t=new Date(e),a=Math.floor((new Date().getTime()-t.getTime())/36e5);if(a<1)return"방금 전";if(a<24)return`${a}시간 전`;let s=Math.floor(a/24);return s<7?`${s}일 전`:t.toLocaleDateString("ko-KR")};return!P||j?(0,s.jsx)(v.default,{children:(0,s.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,s.jsxs)("div",{className:"animate-pulse",children:[(0,s.jsx)("div",{className:"h-8 bg-gray-200 rounded w-3/4 mb-4"}),(0,s.jsx)("div",{className:"h-4 bg-gray-200 rounded w-1/2 mb-8"}),(0,s.jsx)("div",{className:"h-64 bg-gray-200 rounded mb-8"}),(0,s.jsx)("div",{className:"h-32 bg-gray-200 rounded"})]})})}):n?(0,s.jsx)(v.default,{children:(0,s.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,s.jsxs)("div",{className:"max-w-4xl mx-auto",children:[(0,s.jsxs)(c.Zp,{className:"mb-8",children:[(0,s.jsxs)(c.aR,{children:[(0,s.jsx)("div",{className:"flex items-start justify-between",children:(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)(c.ZB,{className:"text-2xl mb-4",children:n.title}),(0,s.jsx)("div",{className:"flex flex-wrap gap-2 mb-4",children:n.tags.map(e=>(0,s.jsx)(i(),{href:`/tag/${e}`,children:(0,s.jsx)(d.E,{variant:"outline",className:"hover:bg-blue-50",children:e})},e))})]})}),(0,s.jsxs)("div",{className:"flex items-center justify-between text-sm text-gray-500 border-t pt-4",children:[(0,s.jsxs)("div",{className:"flex items-center space-x-6",children:[(0,s.jsxs)("div",{className:"flex items-center",children:[(0,s.jsx)(h.A,{className:"h-4 w-4 mr-1"}),(0,s.jsxs)("span",{children:[n.views," 조회"]})]}),(0,s.jsx)(N,{targetId:n.id,likeType:"post",initialLikeCount:n.likes,showLabel:!0,className:"h-8 px-2 text-gray-600 hover:text-[#0891b2]"}),(0,s.jsxs)("div",{className:"flex items-center",children:[(0,s.jsx)(x.A,{className:"h-4 w-4 mr-1"}),(0,s.jsxs)("span",{children:[n.answers.length," 답변"]})]})]}),(0,s.jsxs)("div",{className:"flex items-center",children:[(0,s.jsx)(f.A,{className:"h-4 w-4 mr-1"}),(0,s.jsx)("span",{children:D(n.createdAt)}),(0,s.jsx)("span",{className:"mx-2",children:"•"}),(0,s.jsx)(g.A,{className:"h-4 w-4 mr-1"}),(0,s.jsx)("span",{children:n.author.name})]})]})]}),(0,s.jsx)(c.Wu,{children:(0,s.jsx)("div",{className:"prose max-w-none",children:(0,s.jsx)("div",{className:"whitespace-pre-wrap text-gray-700 leading-relaxed",children:n.content})})})]}),(0,s.jsxs)("div",{className:"mb-8",children:[(0,s.jsxs)("h2",{className:"text-2xl font-bold text-gray-900 mb-6",children:["답변 ",n.answers.length>0&&`(${n.answers.length})`]}),0===n.answers.length?(0,s.jsx)(c.Zp,{children:(0,s.jsxs)(c.Wu,{className:"p-8 text-center",children:[(0,s.jsx)(x.A,{className:"h-12 w-12 text-gray-400 mx-auto mb-4"}),(0,s.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-2",children:"아직 답변이 없습니다"}),(0,s.jsx)("p",{className:"text-gray-600",children:"첫 번째 답변을 작성해보세요!"})]})}):(0,s.jsx)("div",{className:"space-y-6",children:n.answers.map((e,t)=>(0,s.jsxs)(c.Zp,{className:e.isAccepted?"border-green-200 bg-green-50":"",children:[(0,s.jsx)(c.aR,{children:(0,s.jsx)("div",{className:"flex items-center justify-between",children:(0,s.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,s.jsx)("div",{className:"w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:e.aiGenerated?(0,s.jsx)(y.A,{className:"h-4 w-4 text-blue-600"}):(0,s.jsx)(g.A,{className:"h-4 w-4 text-gray-600"})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("div",{className:"font-medium text-gray-900",children:e.author.name}),(0,s.jsx)("div",{className:"text-sm text-gray-500",children:D(e.createdAt)})]}),e.aiGenerated&&(0,s.jsxs)(d.E,{variant:"secondary",children:[(0,s.jsx)(y.A,{className:"h-3 w-3 mr-1"}),"AI 답변"]}),e.isAccepted&&(0,s.jsxs)(d.E,{variant:"default",className:"bg-green-600",children:[(0,s.jsx)(w.A,{className:"h-3 w-3 mr-1"}),"채택됨"]})]})})}),(0,s.jsxs)(c.Wu,{children:[(0,s.jsx)("div",{className:"prose max-w-none mb-4",children:(0,s.jsx)("div",{className:"whitespace-pre-wrap text-gray-700 leading-relaxed",children:e.content})}),(0,s.jsx)(m.w,{className:"mb-4"}),(0,s.jsx)("div",{className:"flex items-center justify-between",children:(0,s.jsx)("div",{className:"flex items-center space-x-2",children:(0,s.jsx)(N,{targetId:e.id,likeType:"comment",initialLikeCount:e.likes})})})]})]},e.id))})]}),(0,s.jsxs)(c.Zp,{children:[(0,s.jsxs)(c.aR,{children:[(0,s.jsxs)(c.ZB,{className:"flex items-center",children:[(0,s.jsx)(x.A,{className:"h-5 w-5 mr-2"}),"답변 작성하기"]}),(0,s.jsx)(c.BT,{children:"도움이 되는 답변을 작성해주세요. 마크다운 문법을 사용할 수 있습니다."})]}),(0,s.jsx)(c.Wu,{children:(0,s.jsxs)("form",{onSubmit:E,className:"space-y-4",children:[(0,s.jsx)(u.T,{placeholder:"답변을 작성해주세요...  다음 내용을 포함하면 더 좋은 답변이 됩니다: - 구체적인 해결 방법 - 코드 예시 (있다면) - 참고 자료나 링크 - 주의사항이나 팁",value:A,onChange:e=>R(e.target.value),className:"min-h-[200px]",required:!0}),(0,s.jsxs)("div",{className:"flex items-center justify-between",children:[(0,s.jsx)("p",{className:"text-sm text-gray-500",children:"마크다운 문법을 사용할 수 있습니다."}),(0,s.jsx)(o.$,{type:"submit",disabled:T||!A.trim(),className:"bg-blue-600 hover:bg-blue-700",children:T?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(y.A,{className:"h-4 w-4 mr-2 animate-spin"}),"등록 중..."]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(x.A,{className:"h-4 w-4 mr-2"}),"답변 등록"]})})]})]})})]})]})})}):(0,s.jsx)(v.default,{children:(0,s.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,s.jsx)(c.Zp,{children:(0,s.jsxs)(c.Wu,{className:"p-12 text-center",children:[(0,s.jsx)(p.A,{className:"h-12 w-12 text-gray-400 mx-auto mb-4"}),(0,s.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-2",children:"질문을 찾을 수 없습니다"}),(0,s.jsx)("p",{className:"text-gray-600 mb-4",children:"요청하신 질문이 존재하지 않거나 삭제되었습니다."}),(0,s.jsx)(i(),{href:"/questions",children:(0,s.jsx)(o.$,{children:"질문 목록으로 돌아가기"})})]})})})})}},79551:e=>{"use strict";e.exports=require("url")},84420:(e,t,a)=>{Promise.resolve().then(a.bind(a,77495))},93613:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(62688).A)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},98220:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>d,routeModule:()=>m,tree:()=>c});var s=a(65239),r=a(48088),n=a(88170),i=a.n(n),l=a(30893),o={};for(let e in l)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);a.d(t,o);let c={children:["",{children:["question",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,22151)),"/Users/baejinho/Documents/resty/qbox/app/question/[id]/page.tsx"]}]},{}]},{metadata:{icon:[],apple:[],openGraph:[],twitter:[async e=>(await Promise.resolve().then(a.bind(a,75870))).default(e)],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(a.bind(a,6544)),"/Users/baejinho/Documents/resty/qbox/app/layout.tsx"],loading:[()=>Promise.resolve().then(a.bind(a,99766)),"/Users/baejinho/Documents/resty/qbox/app/loading.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(a.t.bind(a,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(a.t.bind(a,65284,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[],apple:[],openGraph:[],twitter:[async e=>(await Promise.resolve().then(a.bind(a,75870))).default(e)],manifest:void 0}}]}.children,d=["/Users/baejinho/Documents/resty/qbox/app/question/[id]/page.tsx"],u={require:a,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/question/[id]/page",pathname:"/question/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[4447,7019,1658,5814,1209,4789,1117,2105,1775],()=>a(98220));module.exports=s})();