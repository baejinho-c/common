(()=>{var e={};e.id=978,e.ids=[978],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3919:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>g});var r=s(60687),a=s(43210),n=s(24934),i=s(55192),l=s(15616),d=s(59821),o=s(85910),c=s(10022),x=s(70334),u=s(15807),p=s(82080),m=s(13964),h=s(70615);function g(){let[e,t]=(0,a.useState)(""),[s,g]=(0,a.useState)(""),[j,v]=(0,a.useState)(!1),[f,b]=(0,a.useState)(!1),w=async e=>{try{await navigator.clipboard.writeText(e),b(!0),setTimeout(()=>b(!1),2e3)}catch(e){console.error("Failed to copy text: ",e)}},N=e=>{let t=e.split("\n"),s=t.find(e=>e.includes("POST")||e.includes("GET")||e.includes("PUT")||e.includes("DELETE")),r=t.find(e=>e.toLowerCase().includes("description")||e.toLowerCase().includes("설명"));return`# API 문서

## 개요
${r||"이 API는 다양한 기능을 제공합니다."}

## 엔드포인트 정보
- **URL**: ${s||"API 엔드포인트"}
- **메서드**: HTTP 메서드
- **인증**: 필요한 인증 방식

## 요청 형식

### 헤더
\`\`\`
Content-Type: application/json
Authorization: Bearer {token}
\`\`\`

### 요청 본문
\`\`\`json
{
  "parameter1": "값1",
  "parameter2": "값2"
}
\`\`\`

## 응답 형식

### 성공 응답 (200 OK)
\`\`\`json
{
  "success": true,
  "data": {
    "result": "성공적으로 처리되었습니다"
  }
}
\`\`\`

### 오류 응답 (400 Bad Request)
\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "잘못된 요청입니다"
  }
}
\`\`\`

## 사용 예시

### cURL
\`\`\`bash
curl -X POST \\
  '${s||"https://api.example.com/endpoint"}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -d '{
    "parameter1": "example_value"
  }'
\`\`\`

### JavaScript
\`\`\`javascript
const response = await fetch('${s||"https://api.example.com/endpoint"}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    parameter1: 'example_value'
  })
});

const data = await response.json();
console.log(data);
\`\`\`

## 주의사항
- 모든 요청에는 유효한 인증 토큰이 필요합니다
- 요청 본문은 JSON 형식이어야 합니다
- 응답은 항상 JSON 형식으로 반환됩니다

## 문제 해결
- **401 Unauthorized**: 인증 토큰을 확인하세요
- **400 Bad Request**: 요청 형식을 확인하세요
- **500 Internal Server Error**: 서버 관리자에게 문의하세요`},y=`POST /api/posts
Description: 새로운 게시물을 생성합니다.

Request Body:
{
  "title": "게시물 제목",
  "content": "게시물 내용",
  "author": "작성자 ID"
}

Response:
{
  "success": true,
  "data": {
    "id": 123,
    "title": "게시물 제목",
    "content": "게시물 내용",
    "author": "작성자 ID",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}`;return(0,r.jsx)("div",{className:"min-h-screen bg-background",children:(0,r.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,r.jsxs)("div",{className:"text-center mb-12",children:[(0,r.jsx)(d.E,{variant:"secondary",className:"mb-4",children:"GPT 문서 작성 도구"}),(0,r.jsxs)("h1",{className:"text-4xl md:text-5xl font-bold text-foreground mb-4",children:["API 문서를 ",(0,r.jsx)("span",{className:"text-accent",children:"자동으로"})," 작성하세요"]}),(0,r.jsx)("p",{className:"text-xl text-muted-foreground max-w-3xl mx-auto",children:"API 스펙을 입력하면 구조화된 문서 템플릿과 작성 가이드라인을 제공합니다. 개발자를 위한 완벽한 문서 작성 도구입니다."})]}),(0,r.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsxs)(i.Zp,{children:[(0,r.jsxs)(i.aR,{children:[(0,r.jsxs)(i.ZB,{className:"flex items-center gap-2",children:[(0,r.jsx)(c.A,{className:"w-5 h-5"}),"API 문서 입력"]}),(0,r.jsx)(i.BT,{children:"API 엔드포인트, 요청/응답 형식 등을 입력하세요"})]}),(0,r.jsxs)(i.Wu,{className:"space-y-4",children:[(0,r.jsx)(l.T,{placeholder:y,value:e,onChange:e=>t(e.target.value),className:"min-h-[300px] font-mono text-sm"}),(0,r.jsxs)("div",{className:"flex gap-2",children:[(0,r.jsx)(n.$,{onClick:()=>{e.trim()&&(v(!0),setTimeout(()=>{g(N(e)),v(!1)},2e3))},disabled:!e.trim()||j,className:"flex-1",children:j?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"}),"문서 생성 중..."]}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(x.A,{className:"w-4 h-4 mr-2"}),"문서 생성하기"]})}),(0,r.jsx)(n.$,{variant:"outline",onClick:()=>t(y),children:"예시 사용"})]})]})]}),(0,r.jsxs)(i.Zp,{children:[(0,r.jsx)(i.aR,{children:(0,r.jsxs)(i.ZB,{className:"flex items-center gap-2",children:[(0,r.jsx)(u.A,{className:"w-5 h-5"}),"문서 작성 팁"]})}),(0,r.jsx)(i.Wu,{children:(0,r.jsx)("div",{className:"space-y-3",children:[{title:"명확한 구조",description:"개요, 엔드포인트, 요청/응답 형식, 예시 순으로 구성하세요"},{title:"실제 예시",description:"cURL, JavaScript 등 다양한 언어의 실제 사용 예시를 포함하세요"},{title:"오류 처리",description:"가능한 모든 오류 상황과 해결 방법을 명시하세요"},{title:"인증 정보",description:"API 키, 토큰 등 인증 방식을 자세히 설명하세요"}].map((e,t)=>(0,r.jsxs)("div",{className:"flex gap-3",children:[(0,r.jsx)("div",{className:"w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",children:(0,r.jsx)("span",{className:"text-xs font-medium text-accent",children:t+1})}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h4",{className:"font-medium text-foreground",children:e.title}),(0,r.jsx)("p",{className:"text-sm text-muted-foreground",children:e.description})]})]},t))})})]})]}),(0,r.jsx)("div",{className:"space-y-6",children:(0,r.jsxs)(i.Zp,{children:[(0,r.jsx)(i.aR,{children:(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{children:[(0,r.jsxs)(i.ZB,{className:"flex items-center gap-2",children:[(0,r.jsx)(p.A,{className:"w-5 h-5"}),"생성된 문서"]}),(0,r.jsx)(i.BT,{children:"구조화된 API 문서 템플릿"})]}),s&&(0,r.jsx)(n.$,{variant:"outline",size:"sm",onClick:()=>w(s),children:f?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(m.A,{className:"w-4 h-4 mr-2 text-green-600"}),"복사됨!"]}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(h.A,{className:"w-4 h-4 mr-2"}),"복사"]})})]})}),(0,r.jsx)(i.Wu,{children:s?(0,r.jsxs)(o.tU,{defaultValue:"preview",className:"w-full",children:[(0,r.jsxs)(o.j7,{className:"grid w-full grid-cols-2",children:[(0,r.jsx)(o.Xi,{value:"preview",children:"미리보기"}),(0,r.jsx)(o.Xi,{value:"markdown",children:"마크다운"})]}),(0,r.jsx)(o.av,{value:"preview",className:"mt-4",children:(0,r.jsx)("div",{className:"prose prose-sm max-w-none bg-muted/20 rounded-lg p-4 max-h-[500px] overflow-y-auto",children:(0,r.jsx)("div",{dangerouslySetInnerHTML:{__html:s.replace(/^# (.+)$/gm,'<h1 class="text-xl font-bold mb-4">$1</h1>').replace(/^## (.+)$/gm,'<h2 class="text-lg font-semibold mb-3 mt-6">$1</h2>').replace(/^### (.+)$/gm,'<h3 class="text-md font-medium mb-2 mt-4">$1</h3>').replace(/```(\w+)?\n([\s\S]*?)```/g,'<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$2</code></pre>').replace(/`([^`]+)`/g,'<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}})})}),(0,r.jsx)(o.av,{value:"markdown",className:"mt-4",children:(0,r.jsx)("pre",{className:"bg-muted/20 rounded-lg p-4 text-sm max-h-[500px] overflow-y-auto whitespace-pre-wrap",children:s})})]}):(0,r.jsxs)("div",{className:"text-center py-12 text-muted-foreground",children:[(0,r.jsx)(c.A,{className:"w-12 h-12 mx-auto mb-4 opacity-50"}),(0,r.jsx)("p",{children:'API 문서를 입력하고 "문서 생성하기" 버튼을 클릭하세요'})]})})]})})]}),(0,r.jsxs)("div",{className:"mt-16",children:[(0,r.jsx)("h2",{className:"text-2xl font-bold text-foreground mb-8 text-center",children:"더 많은 문서 작성 도구"}),(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,r.jsxs)(i.Zp,{className:"hover:shadow-lg transition-shadow",children:[(0,r.jsxs)(i.aR,{children:[(0,r.jsx)(i.ZB,{className:"text-lg",children:"README 생성기"}),(0,r.jsx)(i.BT,{children:"프로젝트 README 파일을 자동으로 생성합니다"})]}),(0,r.jsx)(i.Wu,{children:(0,r.jsx)(n.$,{variant:"outline",className:"w-full bg-transparent",disabled:!0,children:"곧 출시 예정"})})]}),(0,r.jsxs)(i.Zp,{className:"hover:shadow-lg transition-shadow",children:[(0,r.jsxs)(i.aR,{children:[(0,r.jsx)(i.ZB,{className:"text-lg",children:"코드 주석 생성"}),(0,r.jsx)(i.BT,{children:"코드에 자동으로 주석을 추가합니다"})]}),(0,r.jsx)(i.Wu,{children:(0,r.jsx)(n.$,{variant:"outline",className:"w-full bg-transparent",disabled:!0,children:"곧 출시 예정"})})]}),(0,r.jsxs)(i.Zp,{className:"hover:shadow-lg transition-shadow",children:[(0,r.jsxs)(i.aR,{children:[(0,r.jsx)(i.ZB,{className:"text-lg",children:"테스트 케이스 생성"}),(0,r.jsx)(i.BT,{children:"API 테스트 케이스를 자동으로 생성합니다"})]}),(0,r.jsx)(i.Wu,{children:(0,r.jsx)(n.$,{variant:"outline",className:"w-full bg-transparent",disabled:!0,children:"곧 출시 예정"})})]})]})]})]})})}},4378:(e,t,s)=>{Promise.resolve().then(s.bind(s,3919))},10022:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(62688).A)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},13964:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(62688).A)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},15616:(e,t,s)=>{"use strict";s.d(t,{T:()=>n});var r=s(60687);s(43210);var a=s(96241);function n({className:e,...t}){return(0,r.jsx)("textarea",{"data-slot":"textarea",className:(0,a.cn)("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),...t})}},15807:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(62688).A)("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]])},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},25825:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});let r=(0,s(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/baejinho/Documents/resty/gpt/app/document-writer/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/baejinho/Documents/resty/gpt/app/document-writer/page.tsx","default")},27581:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>i.a,__next_app__:()=>x,pages:()=>c,routeModule:()=>u,tree:()=>o});var r=s(65239),a=s(48088),n=s(88170),i=s.n(n),l=s(30893),d={};for(let e in l)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>l[e]);s.d(t,d);let o={children:["",{children:["document-writer",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,25825)),"/Users/baejinho/Documents/resty/gpt/app/document-writer/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,58014)),"/Users/baejinho/Documents/resty/gpt/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(s.t.bind(s,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(s.t.bind(s,65284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,c=["/Users/baejinho/Documents/resty/gpt/app/document-writer/page.tsx"],x={require:s,loadChunk:()=>Promise.resolve()},u=new r.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/document-writer/page",pathname:"/document-writer",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},57522:(e,t,s)=>{Promise.resolve().then(s.bind(s,25825))},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},70334:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(62688).A)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]])},70615:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(62688).A)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},85910:(e,t,s)=>{"use strict";s.d(t,{Xi:()=>d,av:()=>o,j7:()=>l,tU:()=>i});var r=s(60687);s(43210);var a=s(81813),n=s(96241);function i({className:e,...t}){return(0,r.jsx)(a.bL,{"data-slot":"tabs",className:(0,n.cn)("flex flex-col gap-2",e),...t})}function l({className:e,...t}){return(0,r.jsx)(a.B8,{"data-slot":"tabs-list",className:(0,n.cn)("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",e),...t})}function d({className:e,...t}){return(0,r.jsx)(a.l9,{"data-slot":"tabs-trigger",className:(0,n.cn)("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",e),...t})}function o({className:e,...t}){return(0,r.jsx)(a.UC,{"data-slot":"tabs-content",className:(0,n.cn)("flex-1 outline-none",e),...t})}}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[447,656,36,768],()=>s(27581));module.exports=r})();