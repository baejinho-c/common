(()=>{var e={};e.id=5475,e.ids=[5475],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},12127:(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var i in t)Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}(t,{resolveManifest:function(){return n},resolveRobots:function(){return o},resolveRouteData:function(){return s},resolveSitemap:function(){return a}});let r=i(77341);function o(e){let t="";for(let i of Array.isArray(e.rules)?e.rules:[e.rules]){for(let e of(0,r.resolveArray)(i.userAgent||["*"]))t+=`User-Agent: ${e}
`;if(i.allow)for(let e of(0,r.resolveArray)(i.allow))t+=`Allow: ${e}
`;if(i.disallow)for(let e of(0,r.resolveArray)(i.disallow))t+=`Disallow: ${e}
`;i.crawlDelay&&(t+=`Crawl-delay: ${i.crawlDelay}
`),t+="\n"}return e.host&&(t+=`Host: ${e.host}
`),e.sitemap&&(0,r.resolveArray)(e.sitemap).forEach(e=>{t+=`Sitemap: ${e}
`}),t}function a(e){let t=e.some(e=>Object.keys(e.alternates??{}).length>0),i=e.some(e=>{var t;return!!(null==(t=e.images)?void 0:t.length)}),r=e.some(e=>{var t;return!!(null==(t=e.videos)?void 0:t.length)}),o="";for(let l of(o+='<?xml version="1.0" encoding="UTF-8"?>\n',o+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',i&&(o+=' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'),r&&(o+=' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'),t?o+=' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n':o+=">\n",e)){var a,n,s;o+="<url>\n",o+=`<loc>${l.url}</loc>
`;let e=null==(a=l.alternates)?void 0:a.languages;if(e&&Object.keys(e).length)for(let t in e)o+=`<xhtml:link rel="alternate" hreflang="${t}" href="${e[t]}" />
`;if(null==(n=l.images)?void 0:n.length)for(let e of l.images)o+=`<image:image>
<image:loc>${e}</image:loc>
</image:image>
`;if(null==(s=l.videos)?void 0:s.length)for(let e of l.videos)o+=["<video:video>",`<video:title>${e.title}</video:title>`,`<video:thumbnail_loc>${e.thumbnail_loc}</video:thumbnail_loc>`,`<video:description>${e.description}</video:description>`,e.content_loc&&`<video:content_loc>${e.content_loc}</video:content_loc>`,e.player_loc&&`<video:player_loc>${e.player_loc}</video:player_loc>`,e.duration&&`<video:duration>${e.duration}</video:duration>`,e.view_count&&`<video:view_count>${e.view_count}</video:view_count>`,e.tag&&`<video:tag>${e.tag}</video:tag>`,e.rating&&`<video:rating>${e.rating}</video:rating>`,e.expiration_date&&`<video:expiration_date>${e.expiration_date}</video:expiration_date>`,e.publication_date&&`<video:publication_date>${e.publication_date}</video:publication_date>`,e.family_friendly&&`<video:family_friendly>${e.family_friendly}</video:family_friendly>`,e.requires_subscription&&`<video:requires_subscription>${e.requires_subscription}</video:requires_subscription>`,e.live&&`<video:live>${e.live}</video:live>`,e.restriction&&`<video:restriction relationship="${e.restriction.relationship}">${e.restriction.content}</video:restriction>`,e.platform&&`<video:platform relationship="${e.platform.relationship}">${e.platform.content}</video:platform>`,e.uploader&&`<video:uploader${e.uploader.info&&` info="${e.uploader.info}"`}>${e.uploader.content}</video:uploader>`,`</video:video>
`].filter(Boolean).join("\n");if(l.lastModified){let e=l.lastModified instanceof Date?l.lastModified.toISOString():l.lastModified;o+=`<lastmod>${e}</lastmod>
`}l.changeFrequency&&(o+=`<changefreq>${l.changeFrequency}</changefreq>
`),"number"==typeof l.priority&&(o+=`<priority>${l.priority}</priority>
`),o+="</url>\n"}return o+"</urlset>\n"}function n(e){return JSON.stringify(e)}function s(e,t){return"robots"===t?o(e):"sitemap"===t?a(e):"manifest"===t?n(e):""}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},48628:(e,t,i)=>{"use strict";i.d(t,{HW:()=>n,T3:()=>a,bN:()=>o});let r=[{id:"user_1",name:"김개발",email:"kim@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:1250,createdAt:"2024-01-01T00:00:00Z"},{id:"user_2",name:"박전문가",email:"park@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:2100,createdAt:"2024-01-02T00:00:00Z"},{id:"user_3",name:"이코더",email:"lee@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:890,createdAt:"2024-01-03T00:00:00Z"},{id:"ai_assistant",name:"AI Assistant",email:"ai@qbox.com",avatar:"/placeholder.svg?height=40&width=40",reputation:9999,createdAt:"2024-01-01T00:00:00Z"}],o=[{id:"q_1",title:"React에서 useEffect 의존성 배열을 올바르게 사용하는 방법",content:`React의 useEffect Hook을 사용할 때 의존성 배열을 어떻게 올바르게 설정해야 하나요?

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

어떤 패턴을 사용하는 것이 좋을까요?`,summary:"TypeScript 제네릭을 활용한 API 클라이언트 구현 방법",tags:["TypeScript","API","제네릭","타입안전성"],author:r[2],createdAt:"2024-01-13T09:15:00Z",views:567,likes:12,dislikes:0,aiGenerated:!1,answers:[]}];function a(e){return o.find(t=>t.id===e)||null}function n(){return o.map(e=>({id:e.id}))}},61595:(e,t,i)=>{"use strict";i.r(t),i.d(t,{patchFetch:()=>x,routeModule:()=>v,serverHooks:()=>y,workAsyncStorage:()=>g,workUnitAsyncStorage:()=>h});var r={};i.r(r),i.d(r,{default:()=>d,dynamic:()=>u});var o={};i.r(o),i.d(o,{GET:()=>m,dynamic:()=>u});var a=i(96559),n=i(48088),s=i(37719),l=i(32190),c=i(48628);let u="force-static";function d(){let e="https://qbox.restyart.com",t=new Date;return[{url:e,lastModified:t,changeFrequency:"daily",priority:1},{url:`${e}/questions`,lastModified:t,changeFrequency:"daily",priority:.8},{url:`${e}/tags`,lastModified:t,changeFrequency:"weekly",priority:.6},{url:`${e}/ask`,lastModified:t,changeFrequency:"monthly",priority:.7},...c.bN.map(t=>({url:`${e}/question/${t.id}`,lastModified:new Date(t.updatedAt||t.createdAt),changeFrequency:"weekly",priority:.7}))]}var f=i(12127);let p={...r}.default;if("function"!=typeof p)throw Error('Default export is missing in "/Users/baejinho/Documents/resty/qbox/app/sitemap.ts"');async function m(e,t){let{__metadata_id__:i,...r}=await t.params||{},o=!!i&&i.endsWith(".xml");if(i&&!o)return new l.NextResponse("Not Found",{status:404});let a=i&&o?i.slice(0,-4):void 0,n=await p({id:a}),s=(0,f.resolveRouteData)(n,"sitemap");return new l.NextResponse(s,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=0, must-revalidate"}})}let v=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"sitemap",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"next-metadata-route-loader?filePath=%2FUsers%2Fbaejinho%2FDocuments%2Fresty%2Fqbox%2Fapp%2Fsitemap.ts&isDynamicRouteExtension=1!?__next_metadata_route__",nextConfigOutput:"",userland:o}),{workAsyncStorage:g,workUnitAsyncStorage:h,serverHooks:y}=v;function x(){return(0,s.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:h})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},77341:(e,t)=>{"use strict";function i(e){return Array.isArray(e)?e:[e]}function r(e){if(null!=e)return i(e)}function o(e){let t;if("string"==typeof e)try{t=(e=new URL(e)).origin}catch{}return t}Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var i in t)Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}(t,{getOrigin:function(){return o},resolveArray:function(){return i},resolveAsArrayOrUndefined:function(){return r}})},78335:()=>{},96487:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[4447,580],()=>i(61595));module.exports=r})();