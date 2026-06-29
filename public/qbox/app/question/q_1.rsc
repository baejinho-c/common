1:"$Sreact.fragment"
2:I[99304,["5389","static/chunks/5389-18fb095698cfd280.js","6772","static/chunks/6772-ed8286c8e2720968.js","7328","static/chunks/7328-8f5cba95548e3d6b.js","6967","static/chunks/6967-5f4ae430081921e7.js","2924","static/chunks/2924-627c2c55ddad781f.js","7177","static/chunks/app/layout-f8c7ecfe50e972f8.js"],"ThemeProvider"]
3:I[23274,["5389","static/chunks/5389-18fb095698cfd280.js","6772","static/chunks/6772-ed8286c8e2720968.js","7328","static/chunks/7328-8f5cba95548e3d6b.js","6967","static/chunks/6967-5f4ae430081921e7.js","2924","static/chunks/2924-627c2c55ddad781f.js","7177","static/chunks/app/layout-f8c7ecfe50e972f8.js"],"AuthProvider"]
4:I[87555,[],""]
5:I[31295,[],""]
6:I[16471,["5389","static/chunks/5389-18fb095698cfd280.js","6772","static/chunks/6772-ed8286c8e2720968.js","7328","static/chunks/7328-8f5cba95548e3d6b.js","6967","static/chunks/6967-5f4ae430081921e7.js","2924","static/chunks/2924-627c2c55ddad781f.js","7177","static/chunks/app/layout-f8c7ecfe50e972f8.js"],"Toaster"]
7:I[75993,["5389","static/chunks/5389-18fb095698cfd280.js","6874","static/chunks/6874-931c28b4bfccdeb6.js","6772","static/chunks/6772-ed8286c8e2720968.js","6483","static/chunks/6483-b89a6d61a233909b.js","5251","static/chunks/5251-197b6f4f416c428e.js","2924","static/chunks/2924-627c2c55ddad781f.js","6224","static/chunks/6224-9cde5daa1feca187.js","4729","static/chunks/4729-45426c7b5945e38d.js","1867","static/chunks/app/question/%5Bid%5D/page-26cbed10eac9c5db.js"],"default"]
9:I[59665,[],"OutletBoundary"]
c:I[59665,[],"ViewportBoundary"]
e:I[59665,[],"MetadataBoundary"]
10:I[26614,[],""]
:HL["/_next/static/media/e4af272ccee01ff0-s.p.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/css/fca8359474e3a6e0.css","style"]
8:Tc90,# React useEffect 의존성 배열 완벽 가이드

React의 `useEffect` Hook에서 의존성 배열을 올바르게 사용하는 방법을 단계별로 설명드리겠습니다.

## 🔍 기본 원칙

의존성 배열에는 **effect 내부에서 사용하는 모든 값**을 포함해야 합니다.

```jsx
function MyComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // userId를 의존성에 포함
  
  return <div>{user?.name}</div>;
}
```

## 🎯 객체/배열 의존성 처리

### 문제가 되는 코드:
```jsx
function BadExample({ config }) {
  useEffect(() => {
    // config 객체가 매번 새로 생성되면 무한 루프 발생
    doSomething(config);
  }, [config]);
}
```

### 해결 방법:
```jsx
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
```

## 🛠️ 함수 의존성 처리

### useCallback 사용:
```jsx
function ComponentWithFunction({ id }) {
  const fetchData = useCallback(async () => {
    const response = await fetch(`/api/data/${id}`);
    return response.json();
  }, [id]);
  
  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]);
}
```

### 함수를 effect 내부로 이동:
```jsx
function BetterApproach({ id }) {
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/data/${id}`);
      const data = await response.json();
      setData(data);
    }
    
    fetchData();
  }, [id]); // 함수가 내부에 있으므로 의존성에서 제외
}
```

## 🚫 무한 루프 방지

### 1. 불필요한 의존성 제거
```jsx
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
```

### 2. useRef로 최신 값 참조
```jsx
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
```

## 📚 베스트 프랙티스

1. **ESLint 규칙 활용**: `react-hooks/exhaustive-deps` 규칙 사용
2. **의존성 최소화**: 꼭 필요한 값만 의존성에 포함
3. **함수형 업데이트**: `setState(prev => prev + 1)` 형태 사용
4. **커스텀 Hook**: 복잡한 로직은 커스텀 Hook으로 분리

이러한 패턴들을 따르면 useEffect를 안전하고 효율적으로 사용할 수 있습니다! 🚀0:{"P":null,"b":"yewRL9O_fnzng-NgrL-K0","p":"","c":["","question","q_1",""],"i":false,"f":[[["",{"children":["question",{"children":[["id","q_1","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/fca8359474e3a6e0.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"ko","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","script",null,{"type":"application/ld+json","dangerouslySetInnerHTML":{"__html":"{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"name\":\"QBox\",\"description\":\"AI 기반 개발자 Q&A 플랫폼\",\"url\":\"https://qbox.restyart.com\",\"potentialAction\":{\"@type\":\"SearchAction\",\"target\":{\"@type\":\"EntryPoint\",\"urlTemplate\":\"https://qbox.restyart.com/questions?search={search_term_string}\"},\"query-input\":\"required name=search_term_string\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"QBox Team\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://qbox.restyart.com/logo.jpg\"}}}"}}],[["$","script",null,{"async":true,"src":"https://www.googletagmanager.com/gtag/js?id=G-YVK657S8Q4"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"\n                window.dataLayer = window.dataLayer || [];\n                function gtag(){dataLayer.push(arguments);}\n                gtag('js', new Date());\n                gtag('config', 'G-YVK657S8Q4');\n              "}}]]]}],["$","body",null,{"className":"__className_f367f3","children":[["$","$L2",null,{"attribute":"class","defaultTheme":"light","enableSystem":true,"disableTransitionOnChange":true,"children":[["$","$L3",null,{"children":["$","$L4",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L5",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}],["$","$L6",null,{}]]}],["$","div",null,{"data-resty-legal":"1","className":"mt-auto border-t border-gray-200 bg-gray-50 text-gray-600 text-xs leading-relaxed","children":["$","div",null,{"className":"container mx-auto px-4 py-4 max-w-6xl","children":[["$","p",null,{"className":"font-semibold text-gray-700 mb-2","children":"리스티아트"}],["$","p",null,{"className":"mb-1","children":["사업자등록번호 ","3961701077"," · 통신판매업신고 ","2022-성남분당C-0670"]}],["$","p",null,{"className":"mb-1","children":"경기도 성남시 분당구 대왕판교로 645번길 12, 7·9층 145호"}],["$","p",null,{"className":"mb-3","children":["문의:"," ",["$","a",null,{"href":"mailto:support@restyart.com","className":"text-blue-600 hover:underline","children":"support@restyart.com"}]]}],["$","p",null,{"className":"p-3 bg-white border border-gray-200 rounded-md text-gray-500","children":[["$","span",null,{"className":"font-semibold text-gray-700","children":"AI 이용 안내"}]," — ","본 서비스의 일부 콘텐츠·응답·추천·이미지 등은 인공지능(AI) 기술을 활용하여 생성될 수 있으며, AI 생성 결과는 참고용이며 정확성·완전성을 보장하지 않습니다."]}],["$","p",null,{"className":"mt-2 text-[11px] text-gray-400","children":["© ",2026," ","리스티아트",". All rights reserved."]}]]}]}]]}]]}]]}],{"children":["question",["$","$1","c",{"children":[null,["$","$L4",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L5",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["id","q_1","d"],["$","$1","c",{"children":[null,["$","$L4",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L5",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":[["$","$L7",null,{"initialQuestion":{"id":"q_1","title":"React에서 useEffect 의존성 배열을 올바르게 사용하는 방법","content":"React의 useEffect Hook을 사용할 때 의존성 배열을 어떻게 올바르게 설정해야 하나요?\n\n특히 다음과 같은 상황에서 어떻게 해야 할지 궁금합니다:\n\n1. 객체나 배열을 의존성으로 사용할 때\n2. 함수를 의존성으로 사용할 때\n3. 무한 루프를 방지하는 방법\n\n실제 코드 예시와 함께 설명해주시면 감사하겠습니다.","summary":"React useEffect의 의존성 배열 사용법에 대한 질문","tags":["React","JavaScript","Hook","useEffect"],"author":{"id":"user_1","name":"김개발","email":"kim@example.com","avatar":"/placeholder.svg?height=40&width=40","reputation":1250,"createdAt":"2024-01-01T00:00:00Z"},"createdAt":"2024-01-15T10:30:00Z","views":1250,"likes":23,"dislikes":1,"aiGenerated":false,"answers":[{"id":"a_1","content":"$8","author":{"id":"ai_assistant","name":"AI Assistant","email":"ai@qbox.com","avatar":"/placeholder.svg?height=40&width=40","reputation":9999,"createdAt":"2024-01-01T00:00:00Z"},"createdAt":"2024-01-15T10:45:00Z","likes":45,"dislikes":0,"isAccepted":true,"aiGenerated":true}]}}],"$undefined",null,["$","$L9",null,{"children":["$La","$Lb",null]}]]}],{},null,false]},null,false]},null,false]},[null,[],[]],false],["$","$1","h",{"children":[null,["$","$1","Gw-IKE2tvmb6tlXc7U_QW",{"children":[["$","$Lc",null,{"children":"$Ld"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Le",null,{"children":"$Lf"}]]}],false]],"m":"$undefined","G":["$10","$undefined"],"s":false,"S":true}
d:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
a:null
b:null
f:[["$","title","0",{"children":"QBox - AI 기반 개발자 Q&A 플랫폼"}],["$","meta","1",{"name":"description","content":"개발 질문을 올리면 AI가 즉시 답변해드립니다. React, Next.js, TypeScript 등 모든 개발 관련 질문을 환영합니다."}],["$","meta","2",{"name":"application-name","content":"QBox"}],["$","meta","3",{"name":"author","content":"QBox Team"}],["$","link","4",{"rel":"manifest","href":"/site.webmanifest","crossOrigin":"$undefined"}],["$","meta","5",{"name":"generator","content":"Next.js"}],["$","meta","6",{"name":"keywords","content":"개발,프로그래밍,Q&A,AI,React,Next.js,TypeScript,JavaScript,개발자,코딩,프론트엔드,백엔드"}],["$","meta","7",{"name":"referrer","content":"origin-when-cross-origin"}],["$","meta","8",{"name":"creator","content":"QBox"}],["$","meta","9",{"name":"publisher","content":"QBox"}],["$","meta","10",{"name":"robots","content":"index, follow"}],["$","meta","11",{"name":"googlebot","content":"index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"}],["$","meta","12",{"name":"category","content":"technology"}],["$","meta","13",{"name":"classification","content":"Developer Tools"}],["$","link","14",{"rel":"canonical","href":"https://qbox.restyart.com/"}],["$","meta","15",{"name":"format-detection","content":"telephone=no, address=no, email=no"}],["$","meta","16",{"name":"naver-site-verification","content":"fa6b40f9468ae339d235b50c730e41ad8eed02a5"}],["$","meta","17",{"property":"og:title","content":"QBox - AI 기반 개발자 Q&A 플랫폼"}],["$","meta","18",{"property":"og:description","content":"개발 질문을 올리면 AI가 즉시 답변해드립니다. React, Next.js, TypeScript 등 모든 개발 관련 질문을 환영합니다."}],["$","meta","19",{"property":"og:site_name","content":"QBox"}],["$","meta","20",{"property":"og:locale","content":"ko_KR"}],["$","meta","21",{"property":"og:image:alt","content":"QBox - AI 기반 개발자 Q&A 플랫폼"}],["$","meta","22",{"property":"og:image:type","content":"image/png"}],["$","meta","23",{"property":"og:image","content":"https://qbox.restyart.com/opengraph-image?4bb9e31695eee0ce"}],["$","meta","24",{"property":"og:image:width","content":"1200"}],["$","meta","25",{"property":"og:image:height","content":"630"}],["$","meta","26",{"property":"og:type","content":"website"}],["$","meta","27",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","28",{"name":"twitter:creator","content":"@qbox_platform"}],["$","meta","29",{"name":"twitter:title","content":"QBox - AI 기반 개발자 Q&A 플랫폼"}],["$","meta","30",{"name":"twitter:description","content":"개발 질문을 올리면 AI가 즉시 답변해드립니다."}],["$","meta","31",{"name":"twitter:image:alt","content":"QBox - AI 기반 개발자 Q&A 플랫폼"}],["$","meta","32",{"name":"twitter:image:type","content":"image/png"}],["$","meta","33",{"name":"twitter:image","content":"https://qbox.restyart.com/twitter-image?aa0c9bed959a0fda"}],["$","meta","34",{"name":"twitter:image:width","content":"1200"}],["$","meta","35",{"name":"twitter:image:height","content":"600"}],["$","link","36",{"rel":"shortcut icon","href":"/favicon.svg","type":"image/svg+xml"}],["$","link","37",{"rel":"icon","href":"/favicon.svg","type":"image/svg+xml"}],["$","link","38",{"rel":"icon","href":"/logo-mark.svg","type":"image/svg+xml","sizes":"48x48"}],["$","link","39",{"rel":"icon","href":"/favicon-16x16.jpg","sizes":"16x16","type":"image/png"}],["$","link","40",{"rel":"icon","href":"/favicon-32x32.jpg","sizes":"32x32","type":"image/png"}],["$","link","41",{"rel":"apple-touch-icon","href":"/apple-touch-icon.jpg","sizes":"180x180","type":"image/png"}],["$","link","42",{"rel":"mask-icon","href":"/safari-pinned-tab.jpg","color":"#3b82f6"}]]
