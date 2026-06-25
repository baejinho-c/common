(()=>{var e={};e.id=1867,e.ids=[1867],e.modules={2117:(e,s,t)=>{"use strict";t.d(s,{A:()=>a});let a=(0,t(62688).A)("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}]])},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5336:(e,s,t)=>{"use strict";t.d(s,{A:()=>a});let a=(0,t(62688).A)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},7965:(e,s,t)=>{"use strict";t.d(s,{w:()=>d});var a=t(60687),r=t(43210),i=t(14163),n="horizontal",l=["horizontal","vertical"],c=r.forwardRef((e,s)=>{var t;let{decorative:r,orientation:c=n,...o}=e,d=(t=c,l.includes(t))?c:n;return(0,a.jsx)(i.sG.div,{"data-orientation":d,...r?{role:"none"}:{"aria-orientation":"vertical"===d?d:void 0,role:"separator"},...o,ref:s})});c.displayName="Separator";var o=t(96241);let d=r.forwardRef(({className:e,orientation:s="horizontal",decorative:t=!0,...r},i)=>(0,a.jsx)(c,{ref:i,decorative:t,orientation:s,className:(0,o.cn)("shrink-0 bg-border","horizontal"===s?"h-[1px] w-full":"h-full w-[1px]",e),...r}));d.displayName=c.displayName},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},13861:(e,s,t)=>{"use strict";t.d(s,{A:()=>a});let a=(0,t(62688).A)("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},15616:(e,s,t)=>{"use strict";t.d(s,{T:()=>n});var a=t(60687),r=t(43210),i=t(96241);let n=r.forwardRef(({className:e,...s},t)=>(0,a.jsx)("textarea",{className:(0,i.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:t,...s}));n.displayName="Textarea"},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},43093:(e,s,t)=>{"use strict";t.d(s,{default:()=>A});var a=t(60687),r=t(43210),i=t(85814),n=t.n(i),l=t(16189),c=t(24934),o=t(55192),d=t(59821),m=t(15616),u=t(7965),x=t(93613),h=t(13861),p=t(2117),f=t(58887),j=t(48730),v=t(58869),g=t(56085),b=t(5336);let y=(0,t(62688).A)("ThumbsDown",[["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",key:"m61m77"}]]);var N=t(94933),w=t(79496);function A({questionId:e,initialQuestion:s=null}){var t;let i=(t=(0,l.useParams)().id,e||("string"==typeof t?t:Array.isArray(t)&&t[0]?t[0]:"")),[A,k]=(0,r.useState)(s),[q,E]=(0,r.useState)(""),[P,R]=(0,r.useState)(!1),[C,T]=(0,r.useState)(!!s),_=async()=>{try{let e=await (0,w.ph)(i);k(e)}catch(e){console.error("질문 로드 실패:",e),k(null)}},S=async e=>{if(e.preventDefault(),q.trim()&&A){R(!0);try{await (0,w.x9)(A.id,q.trim()),E(""),await _()}catch(e){console.error("답변 등록 실패:",e)}finally{R(!1)}}},D=e=>{let s=new Date(e),t=Math.floor((new Date().getTime()-s.getTime())/36e5);if(t<1)return"방금 전";if(t<24)return`${t}시간 전`;let a=Math.floor(t/24);return a<7?`${a}일 전`:s.toLocaleDateString("ko-KR")};return C?A?(0,a.jsx)(N.A,{children:(0,a.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,a.jsxs)("div",{className:"max-w-4xl mx-auto",children:[(0,a.jsxs)(o.Zp,{className:"mb-8",children:[(0,a.jsxs)(o.aR,{children:[(0,a.jsx)("div",{className:"flex items-start justify-between",children:(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)(o.ZB,{className:"text-2xl mb-4",children:A.title}),(0,a.jsx)("div",{className:"flex flex-wrap gap-2 mb-4",children:A.tags.map(e=>(0,a.jsx)(n(),{href:`/tag/${e}`,children:(0,a.jsx)(d.E,{variant:"outline",className:"hover:bg-blue-50",children:e})},e))})]})}),(0,a.jsxs)("div",{className:"flex items-center justify-between text-sm text-gray-500 border-t pt-4",children:[(0,a.jsxs)("div",{className:"flex items-center space-x-6",children:[(0,a.jsxs)("div",{className:"flex items-center",children:[(0,a.jsx)(h.A,{className:"h-4 w-4 mr-1"}),(0,a.jsxs)("span",{children:[A.views," 조회"]})]}),(0,a.jsxs)("div",{className:"flex items-center",children:[(0,a.jsx)(p.A,{className:"h-4 w-4 mr-1"}),(0,a.jsxs)("span",{children:[A.likes," 좋아요"]})]}),(0,a.jsxs)("div",{className:"flex items-center",children:[(0,a.jsx)(f.A,{className:"h-4 w-4 mr-1"}),(0,a.jsxs)("span",{children:[A.answers.length," 답변"]})]})]}),(0,a.jsxs)("div",{className:"flex items-center",children:[(0,a.jsx)(j.A,{className:"h-4 w-4 mr-1"}),(0,a.jsx)("span",{children:D(A.createdAt)}),(0,a.jsx)("span",{className:"mx-2",children:"•"}),(0,a.jsx)(v.A,{className:"h-4 w-4 mr-1"}),(0,a.jsx)("span",{children:A.author.name})]})]})]}),(0,a.jsx)(o.Wu,{children:(0,a.jsx)("div",{className:"prose max-w-none",children:(0,a.jsx)("div",{className:"whitespace-pre-wrap text-gray-700 leading-relaxed",children:A.content})})})]}),(0,a.jsxs)("div",{className:"mb-8",children:[(0,a.jsxs)("h2",{className:"text-2xl font-bold text-gray-900 mb-6",children:["답변 ",A.answers.length>0&&`(${A.answers.length})`]}),0===A.answers.length?(0,a.jsx)(o.Zp,{children:(0,a.jsxs)(o.Wu,{className:"p-8 text-center",children:[(0,a.jsx)(f.A,{className:"h-12 w-12 text-gray-400 mx-auto mb-4"}),(0,a.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-2",children:"아직 답변이 없습니다"}),(0,a.jsx)("p",{className:"text-gray-600",children:"첫 번째 답변을 작성해보세요!"})]})}):(0,a.jsx)("div",{className:"space-y-6",children:A.answers.map((e,s)=>(0,a.jsxs)(o.Zp,{className:e.isAccepted?"border-green-200 bg-green-50":"",children:[(0,a.jsx)(o.aR,{children:(0,a.jsx)("div",{className:"flex items-center justify-between",children:(0,a.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,a.jsx)("div",{className:"w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:e.aiGenerated?(0,a.jsx)(g.A,{className:"h-4 w-4 text-blue-600"}):(0,a.jsx)(v.A,{className:"h-4 w-4 text-gray-600"})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"font-medium text-gray-900",children:e.author.name}),(0,a.jsx)("div",{className:"text-sm text-gray-500",children:D(e.createdAt)})]}),e.aiGenerated&&(0,a.jsxs)(d.E,{variant:"secondary",children:[(0,a.jsx)(g.A,{className:"h-3 w-3 mr-1"}),"AI 답변"]}),e.isAccepted&&(0,a.jsxs)(d.E,{variant:"default",className:"bg-green-600",children:[(0,a.jsx)(b.A,{className:"h-3 w-3 mr-1"}),"채택됨"]})]})})}),(0,a.jsxs)(o.Wu,{children:[(0,a.jsx)("div",{className:"prose max-w-none mb-4",children:(0,a.jsx)("div",{className:"whitespace-pre-wrap text-gray-700 leading-relaxed",children:e.content})}),(0,a.jsx)(u.w,{className:"mb-4"}),(0,a.jsx)("div",{className:"flex items-center justify-between",children:(0,a.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,a.jsxs)(c.$,{variant:"ghost",size:"sm",children:[(0,a.jsx)(p.A,{className:"h-4 w-4 mr-1"}),e.likes]}),(0,a.jsxs)(c.$,{variant:"ghost",size:"sm",children:[(0,a.jsx)(y,{className:"h-4 w-4 mr-1"}),e.dislikes]})]})})]})]},e.id))})]}),(0,a.jsxs)(o.Zp,{children:[(0,a.jsxs)(o.aR,{children:[(0,a.jsxs)(o.ZB,{className:"flex items-center",children:[(0,a.jsx)(f.A,{className:"h-5 w-5 mr-2"}),"답변 작성하기"]}),(0,a.jsx)(o.BT,{children:"도움이 되는 답변을 작성해주세요. 마크다운 문법을 사용할 수 있습니다."})]}),(0,a.jsx)(o.Wu,{children:(0,a.jsxs)("form",{onSubmit:S,className:"space-y-4",children:[(0,a.jsx)(m.T,{placeholder:"답변을 작성해주세요...  다음 내용을 포함하면 더 좋은 답변이 됩니다: - 구체적인 해결 방법 - 코드 예시 (있다면) - 참고 자료나 링크 - 주의사항이나 팁",value:q,onChange:e=>E(e.target.value),className:"min-h-[200px]",required:!0}),(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"마크다운 문법을 사용할 수 있습니다."}),(0,a.jsx)(c.$,{type:"submit",disabled:P||!q.trim(),className:"bg-blue-600 hover:bg-blue-700",children:P?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(g.A,{className:"h-4 w-4 mr-2 animate-spin"}),"등록 중..."]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(f.A,{className:"h-4 w-4 mr-2"}),"답변 등록"]})})]})]})})]})]})})}):(0,a.jsx)(N.A,{children:(0,a.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,a.jsx)(o.Zp,{children:(0,a.jsxs)(o.Wu,{className:"p-12 text-center",children:[(0,a.jsx)(x.A,{className:"h-12 w-12 text-gray-400 mx-auto mb-4"}),(0,a.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-2",children:"질문을 찾을 수 없습니다"}),(0,a.jsx)("p",{className:"text-gray-600 mb-4",children:"요청하신 질문이 존재하지 않거나 삭제되었습니다."}),(0,a.jsx)(n(),{href:"/questions",children:(0,a.jsx)(c.$,{children:"질문 목록으로 돌아가기"})})]})})})}):(0,a.jsx)(N.A,{children:(0,a.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,a.jsxs)("div",{className:"animate-pulse",children:[(0,a.jsx)("div",{className:"h-8 bg-gray-200 rounded w-3/4 mb-4"}),(0,a.jsx)("div",{className:"h-4 bg-gray-200 rounded w-1/2 mb-8"}),(0,a.jsx)("div",{className:"h-64 bg-gray-200 rounded mb-8"}),(0,a.jsx)("div",{className:"h-32 bg-gray-200 rounded"})]})})})}},47620:(e,s,t)=>{Promise.resolve().then(t.bind(t,73679))},48628:(e,s,t)=>{"use strict";t.d(s,{HW:()=>n,T3:()=>i,bN:()=>r});let a=[{id:"user_1",name:"김개발",email:"kim@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:1250,createdAt:"2024-01-01T00:00:00Z"},{id:"user_2",name:"박전문가",email:"park@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:2100,createdAt:"2024-01-02T00:00:00Z"},{id:"user_3",name:"이코더",email:"lee@example.com",avatar:"/placeholder.svg?height=40&width=40",reputation:890,createdAt:"2024-01-03T00:00:00Z"},{id:"ai_assistant",name:"AI Assistant",email:"ai@qbox.com",avatar:"/placeholder.svg?height=40&width=40",reputation:9999,createdAt:"2024-01-01T00:00:00Z"}],r=[{id:"q_1",title:"React에서 useEffect 의존성 배열을 올바르게 사용하는 방법",content:`React의 useEffect Hook을 사용할 때 의존성 배열을 어떻게 올바르게 설정해야 하나요?

특히 다음과 같은 상황에서 어떻게 해야 할지 궁금합니다:

1. 객체나 배열을 의존성으로 사용할 때
2. 함수를 의존성으로 사용할 때
3. 무한 루프를 방지하는 방법

실제 코드 예시와 함께 설명해주시면 감사하겠습니다.`,summary:"React useEffect의 의존성 배열 사용법에 대한 질문",tags:["React","JavaScript","Hook","useEffect"],author:a[0],createdAt:"2024-01-15T10:30:00Z",views:1250,likes:23,dislikes:1,aiGenerated:!1,answers:[{id:"a_1",content:`# React useEffect 의존성 배열 완벽 가이드

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

이러한 패턴들을 따르면 useEffect를 안전하고 효율적으로 사용할 수 있습니다! 🚀`,author:a[3],createdAt:"2024-01-15T10:45:00Z",likes:45,dislikes:0,isAccepted:!0,aiGenerated:!0}]},{id:"q_2",title:"Next.js App Router에서 데이터 페칭 최적화 방법",content:`Next.js 13+ App Router를 사용하면서 데이터 페칭을 최적화하고 싶습니다.

현재 상황:
- 여러 컴포넌트에서 같은 API를 호출하고 있음
- 페이지 로딩 속도가 느림
- 캐싱이 제대로 되지 않는 것 같음

App Router에서 권장하는 데이터 페칭 패턴과 캐싱 전략을 알고 싶습니다.`,summary:"Next.js App Router 데이터 페칭 최적화에 대한 질문",tags:["Next.js","React","데이터페칭","성능최적화"],author:a[1],createdAt:"2024-01-14T15:20:00Z",views:890,likes:15,dislikes:0,aiGenerated:!1,answers:[]},{id:"q_3",title:"TypeScript에서 제네릭을 활용한 타입 안전한 API 클라이언트 만들기",content:`TypeScript로 타입 안전한 API 클라이언트를 만들고 싶습니다.

요구사항:
- REST API 엔드포인트별로 타입 정의
- 요청/응답 타입 자동 추론
- 에러 처리 타입 안전성
- 제네릭을 활용한 재사용 가능한 구조

어떤 패턴을 사용하는 것이 좋을까요?`,summary:"TypeScript 제네릭을 활용한 API 클라이언트 구현 방법",tags:["TypeScript","API","제네릭","타입안전성"],author:a[2],createdAt:"2024-01-13T09:15:00Z",views:567,likes:12,dislikes:0,aiGenerated:!1,answers:[]}];function i(e){return r.find(s=>s.id===e)||null}function n(){return r.map(e=>({id:e.id}))}},48730:(e,s,t)=>{"use strict";t.d(s,{A:()=>a});let a=(0,t(62688).A)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]])},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73679:(e,s,t)=>{"use strict";t.d(s,{default:()=>a});let a=(0,t(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/baejinho/Documents/resty/qbox/app/question/[id]/QuestionDetailClient.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/baejinho/Documents/resty/qbox/app/question/[id]/QuestionDetailClient.tsx","default")},79551:e=>{"use strict";e.exports=require("url")},84420:(e,s,t)=>{Promise.resolve().then(t.bind(t,43093))},93613:(e,s,t)=>{"use strict";t.d(s,{A:()=>a});let a=(0,t(62688).A)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},98220:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>n.a,__next_app__:()=>m,pages:()=>d,routeModule:()=>u,tree:()=>o});var a=t(65239),r=t(48088),i=t(88170),n=t.n(i),l=t(30893),c={};for(let e in l)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(c[e]=()=>l[e]);t.d(s,c);let o={children:["",{children:["question",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,98492)),"/Users/baejinho/Documents/resty/qbox/app/question/[id]/page.tsx"]}]},{}]},{metadata:{icon:[],apple:[],openGraph:[async e=>(await Promise.resolve().then(t.bind(t,38004))).default(e)],twitter:[async e=>(await Promise.resolve().then(t.bind(t,75870))).default(e)],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(t.bind(t,58014)),"/Users/baejinho/Documents/resty/qbox/app/layout.tsx"],loading:[()=>Promise.resolve().then(t.bind(t,99766)),"/Users/baejinho/Documents/resty/qbox/app/loading.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,65284,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[],apple:[],openGraph:[async e=>(await Promise.resolve().then(t.bind(t,38004))).default(e)],twitter:[async e=>(await Promise.resolve().then(t.bind(t,75870))).default(e)],manifest:void 0}}]}.children,d=["/Users/baejinho/Documents/resty/qbox/app/question/[id]/page.tsx"],m={require:t,loadChunk:()=>Promise.resolve()},u=new a.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/question/[id]/page",pathname:"/question/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},98492:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>l,generateStaticParams:()=>n});var a=t(37413),r=t(73679),i=t(48628);function n(){return(0,i.HW)()}function l({params:e}){let s=(0,i.T3)(e.id);return(0,a.jsx)(r.default,{questionId:e.id,initialQuestion:s})}}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[4447,9926,1658,5814,1209,8056,6549,895,5036,4933],()=>t(98220));module.exports=a})();