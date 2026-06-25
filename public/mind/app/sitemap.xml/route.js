(()=>{var e={};e.id=475,e.ids=[475],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},12127:(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var i in t)Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}(t,{resolveManifest:function(){return s},resolveRobots:function(){return n},resolveRouteData:function(){return a},resolveSitemap:function(){return o}});let r=i(77341);function n(e){let t="";for(let i of Array.isArray(e.rules)?e.rules:[e.rules]){for(let e of(0,r.resolveArray)(i.userAgent||["*"]))t+=`User-Agent: ${e}
`;if(i.allow)for(let e of(0,r.resolveArray)(i.allow))t+=`Allow: ${e}
`;if(i.disallow)for(let e of(0,r.resolveArray)(i.disallow))t+=`Disallow: ${e}
`;i.crawlDelay&&(t+=`Crawl-delay: ${i.crawlDelay}
`),t+="\n"}return e.host&&(t+=`Host: ${e.host}
`),e.sitemap&&(0,r.resolveArray)(e.sitemap).forEach(e=>{t+=`Sitemap: ${e}
`}),t}function o(e){let t=e.some(e=>Object.keys(e.alternates??{}).length>0),i=e.some(e=>{var t;return!!(null==(t=e.images)?void 0:t.length)}),r=e.some(e=>{var t;return!!(null==(t=e.videos)?void 0:t.length)}),n="";for(let l of(n+='<?xml version="1.0" encoding="UTF-8"?>\n',n+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',i&&(n+=' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'),r&&(n+=' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'),t?n+=' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n':n+=">\n",e)){var o,s,a;n+="<url>\n",n+=`<loc>${l.url}</loc>
`;let e=null==(o=l.alternates)?void 0:o.languages;if(e&&Object.keys(e).length)for(let t in e)n+=`<xhtml:link rel="alternate" hreflang="${t}" href="${e[t]}" />
`;if(null==(s=l.images)?void 0:s.length)for(let e of l.images)n+=`<image:image>
<image:loc>${e}</image:loc>
</image:image>
`;if(null==(a=l.videos)?void 0:a.length)for(let e of l.videos)n+=["<video:video>",`<video:title>${e.title}</video:title>`,`<video:thumbnail_loc>${e.thumbnail_loc}</video:thumbnail_loc>`,`<video:description>${e.description}</video:description>`,e.content_loc&&`<video:content_loc>${e.content_loc}</video:content_loc>`,e.player_loc&&`<video:player_loc>${e.player_loc}</video:player_loc>`,e.duration&&`<video:duration>${e.duration}</video:duration>`,e.view_count&&`<video:view_count>${e.view_count}</video:view_count>`,e.tag&&`<video:tag>${e.tag}</video:tag>`,e.rating&&`<video:rating>${e.rating}</video:rating>`,e.expiration_date&&`<video:expiration_date>${e.expiration_date}</video:expiration_date>`,e.publication_date&&`<video:publication_date>${e.publication_date}</video:publication_date>`,e.family_friendly&&`<video:family_friendly>${e.family_friendly}</video:family_friendly>`,e.requires_subscription&&`<video:requires_subscription>${e.requires_subscription}</video:requires_subscription>`,e.live&&`<video:live>${e.live}</video:live>`,e.restriction&&`<video:restriction relationship="${e.restriction.relationship}">${e.restriction.content}</video:restriction>`,e.platform&&`<video:platform relationship="${e.platform.relationship}">${e.platform.content}</video:platform>`,e.uploader&&`<video:uploader${e.uploader.info&&` info="${e.uploader.info}"`}>${e.uploader.content}</video:uploader>`,`</video:video>
`].filter(Boolean).join("\n");if(l.lastModified){let e=l.lastModified instanceof Date?l.lastModified.toISOString():l.lastModified;n+=`<lastmod>${e}</lastmod>
`}l.changeFrequency&&(n+=`<changefreq>${l.changeFrequency}</changefreq>
`),"number"==typeof l.priority&&(n+=`<priority>${l.priority}</priority>
`),n+="</url>\n"}return n+"</urlset>\n"}function s(e){return JSON.stringify(e)}function a(e,t){return"robots"===t?n(e):"sitemap"===t?o(e):"manifest"===t?s(e):""}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},48428:(e,t,i)=>{"use strict";i.d(t,{sk:()=>r}),new Date().toISOString(),new Date().toISOString();let r=[{id:1,title:"아이의 분리불안, 어떻게 도와줄까요?",slug:"child-separation-anxiety-guide",content:`# 아이의 분리불안, 어떻게 도와줄까요?

분리불안은 아이가 부모나 주 양육자와 떨어지는 것을 극도로 두려워하는 상태입니다. 이는 정상적인 발달 과정의 일부이지만, 때로는 일상생활에 큰 징장을 줄 수 있습니다.

## 분리불안의 증상

- 부모와 떨어지는 것을 극도로 거부
- 혼자 잠들기를 거부
- 악몽이나 밤에 깨는 일이 잦음
- 신체적 증상 (복통, 두통 등)

## 도움이 되는 방법들

### 1. 점진적 분리 연습
짧은 시간부터 시작해서 점차 시간을 늘려가세요.

### 2. 일관된 작별 인사
매번 같은 방식으로 작별 인사를 하여 예측 가능성을 높이세요.

### 3. 안정감 주는 물건
아이가 좋아하는 인형이나 담요를 함께 가져가게 하세요.

### 4. 감정 인정하기
아이의 불안한 감정을 인정하고 공감해주세요.

분리불안은 시간이 지나면서 자연스럽게 완화되는 경우가 많습니다. 하지만 증상이 심하거나 오래 지속된다면 전문가의 도움을 받는 것이 좋습니다.`,status:"published",read_time_min:5,published_at:"2024-01-15 10:00:00",likes_count:124,comments_count:18,cover_image:"/child-separation-anxiety-guide.jpg",created_at:"2024-01-15 09:00:00",updated_at:"2024-01-15 10:00:00",tags:[{id:1,name:"분리불안",slug:"separation-anxiety"},{id:2,name:"육아팁",slug:"parenting-tips"}]},{id:2,title:"ADHD 아이의 일상 관리법",slug:"adhd-child-daily-management",content:`# ADHD 아이의 일상 관리법

ADHD(주의력결핍 과잉행동장애)를 가진 아이들은 특별한 관심과 이해가 필요합니다. 올바른 접근법으로 아이의 잠재력을 최대한 발휘할 수 있도록 도와줄 수 있습니다.

## ADHD의 주요 특징

- 주의력 부족
- 과잉행동
- 충동성
- 집중력 저하

## 일상 관리 전략

### 1. 구조화된 환경 만들기
- 일정한 루틴 유지
- 명확한 규칙 설정
- 시각적 스케줄 활용

### 2. 긍정적 강화
- 작은 성취도 인정하고 칭찬
- 보상 시스템 활용
- 부정적 행동보다 긍정적 행동에 집중

### 3. 에너지 발산 기회 제공
- 규칙적인 운동
- 야외 활동 늘리기
- 창의적 활동 참여

### 4. 학습 환경 최적화
- 산만한 요소 제거
- 짧은 시간 집중 후 휴식
- 다양한 학습 방법 시도

ADHD는 치료 가능한 상태입니다. 전문가와 상담하여 아이에게 맞는 치료 계획을 세우는 것이 중요합니다.`,status:"published",read_time_min:7,published_at:"2024-01-14 14:30:00",likes_count:89,comments_count:12,cover_image:"/adhd-child-daily-management.jpg",created_at:"2024-01-14 13:30:00",updated_at:"2024-01-14 14:30:00",tags:[{id:3,name:"ADHD",slug:"adhd"},{id:4,name:"일상관리",slug:"daily-management"}]},{id:3,title:"형제자매 갈등 해결하기",slug:"sibling-conflict-resolution",content:`# 형제자매 갈등 해결하기

형제자매 간의 갈등은 자연스러운 현상이지만, 적절한 중재와 지도가 필요합니다. 건전한 경쟁과 협력을 통해 아이들이 성장할 수 있도록 도와주세요.

## 갈등의 주요 원인

- 부모의 관심 경쟁
- 개인적 공간 침해
- 장난감이나 물건 소유권 다툼
- 성격이나 관심사의 차이

## 갈등 해결 전략

### 1. 공정한 중재자 되기
- 편견 없이 양쪽 이야기 듣기
- 감정을 인정하고 공감하기
- 해결책을 함께 찾기

### 2. 개별적 관심 주기
- 각 아이와 일대일 시간 갖기
- 개인의 특성과 장점 인정하기
- 비교하지 않기

### 3. 협력 기회 만들기
- 함께 할 수 있는 프로젝트 제안
- 팀워크가 필요한 게임하기
- 서로 도울 수 있는 상황 만들기

### 4. 갈등 해결 기술 가르치기
- 감정 표현 방법 알려주기
- 타협과 양보의 중요성 설명
- 문제 해결 과정 단계별로 안내

형제자매 관계는 평생에 걸친 소중한 유대관계입니다. 어릴 때부터 건강한 관계를 형성할 수 있도록 도와주세요.`,status:"published",read_time_min:6,published_at:"2024-01-13 16:00:00",likes_count:67,comments_count:9,cover_image:"/sibling-conflict-resolution.jpg",created_at:"2024-01-13 15:00:00",updated_at:"2024-01-13 16:00:00",tags:[{id:5,name:"형제갈등",slug:"sibling-conflict"},{id:6,name:"갈등해결",slug:"conflict-resolution"}]}];class n{static{this.TOKEN_KEY="auth_token"}static{this.USER_KEY="user_data"}static get(){return null}static set(e){}static remove(){}static setUser(e){}static getUser(){return null}}class o{async sendMessage(e,t){await new Promise(e=>setTimeout(e,1e3+2e3*Math.random()));let i=t||`conv_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;this.conversations.has(i)||this.conversations.set(i,[]);let r=this.conversations.get(i),n={id:`msg_${Date.now()}_user`,content:e,sender:"user",timestamp:new Date().toISOString(),conversationId:i};r.push(n);let o=this.generateAIResponse(e,r),s={id:`msg_${Date.now()}_assistant`,content:o,sender:"assistant",timestamp:new Date().toISOString(),conversationId:i};return r.push(s),{id:s.id,response:o,message:o,timestamp:s.timestamp,conversationId:i}}generateAIResponse(e,t){let i=e.toLowerCase();if(i.includes("우울")||i.includes("슬프")||i.includes("힘들"))return"힘든 시간을 보내고 계시는군요. 그런 감정을 느끼는 것은 자연스러운 일입니다. 어떤 일이 있었는지 더 자세히 말씀해 주시겠어요? 함께 이야기하면서 해결책을 찾아보도록 하겠습니다.";if(i.includes("불안")||i.includes("걱정")||i.includes("두려"))return"불안한 마음이 드시는군요. 불안감은 누구나 경험하는 자연스러운 감정입니다. 지금 가장 걱정되는 것이 무엇인지 구체적으로 말씀해 주시면, 함께 그 불안을 관리하는 방법을 찾아보겠습니다.";if(i.includes("화")||i.includes("짜증")||i.includes("분노"))return"화가 나는 상황이군요. 분노는 우리에게 무언가 잘못되었다는 신호를 보내는 중요한 감정입니다. 어떤 상황에서 그런 감정을 느끼게 되었는지 말씀해 주시겠어요?";if(i.includes("스트레스")||i.includes("압박")||i.includes("부담"))return"스트레스를 많이 받고 계시는 것 같네요. 현대 사회에서 스트레스는 피할 수 없는 부분이지만, 건강하게 관리하는 것이 중요합니다. 어떤 것들이 주요 스트레스 요인인지 함께 살펴보실까요?";if(i.includes("가족")||i.includes("부모")||i.includes("형제"))return"가족 관계에 대해 고민이 있으시군요. 가족은 우리에게 가장 가까우면서도 때로는 가장 어려운 관계이기도 합니다. 어떤 부분에서 어려움을 겪고 계신지 더 자세히 이야기해 주세요.";if(i.includes("친구")||i.includes("동료")||i.includes("인간관계"))return"인간관계에서 어려움을 겪고 계시는군요. 다른 사람과의 관계는 때로 복잡하고 어려울 수 있습니다. 구체적으로 어떤 상황에서 어려움을 느끼시는지 말씀해 주시겠어요?";if(i.includes("공부")||i.includes("시험")||i.includes("학교"))return"학업에 관한 고민이 있으시군요. 공부는 때로 큰 압박감을 주기도 합니다. 어떤 부분에서 가장 어려움을 느끼고 계신지, 그리고 현재 어떤 방식으로 공부하고 계신지 말씀해 주세요.";if(i.includes("직장")||i.includes("회사")||i.includes("업무"))return"직장 생활에서 어려움을 겪고 계시는군요. 직장에서의 스트레스는 많은 사람들이 경험하는 일입니다. 어떤 부분이 가장 힘드신지 구체적으로 말씀해 주시겠어요?";if(i.includes("안녕")||i.includes("처음")||i.includes("시작"))return"안녕하세요! AI 심리상담사입니다. 오늘 어떤 이야기를 나누고 싶으신가요? 편안하게 마음속 이야기를 들려주세요. 함께 해결책을 찾아보겠습니다.";if(i.includes("고마")||i.includes("감사")||i.includes("도움"))return"도움이 되었다니 정말 기쁩니다. 언제든지 필요할 때 찾아와 주세요. 여러분의 마음 건강을 위해 항상 여기 있겠습니다.";let r=["말씀해 주신 내용을 잘 들었습니다. 그런 상황에서 그렇게 느끼시는 것이 충분히 이해됩니다. 조금 더 자세히 설명해 주시겠어요?","그런 경험을 하셨군요. 어떤 감정이 가장 크게 느껴지시나요? 함께 그 감정을 탐색해보겠습니다.","힘든 시간을 보내고 계시는 것 같네요. 지금 가장 필요한 것이 무엇이라고 생각하시나요?","말씀해 주신 상황이 쉽지 않으셨을 것 같습니다. 이런 상황에서 평소에는 어떻게 대처하시나요?","그런 일이 있으셨군요. 지금 기분이 어떠신지, 그리고 어떤 도움이 필요한지 말씀해 주세요."];return r[Math.floor(Math.random()*r.length)]}async getConversationHistory(e){return await new Promise(e=>setTimeout(e,500)),this.conversations.get(e)||[]}async getUserCredits(){await new Promise(e=>setTimeout(e,300));let e=localStorage.getItem("user_data");return e&&JSON.parse(e).credits||0}async useCredits(e){await new Promise(e=>setTimeout(e,500));let t=localStorage.getItem("user_data");if(t){let i=JSON.parse(t);if(i.credits>=e)return i.credits-=e,localStorage.setItem("user_data",JSON.stringify(i)),!0}return!1}constructor(){this.conversations=new Map}}new o},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},72018:(e,t,i)=>{"use strict";i.r(t),i.d(t,{patchFetch:()=>h,routeModule:()=>f,serverHooks:()=>y,workAsyncStorage:()=>g,workUnitAsyncStorage:()=>v});var r={};i.r(r),i.d(r,{default:()=>d});var n={};i.r(n),i.d(n,{GET:()=>m});var o=i(96559),s=i(48088),a=i(37719),l=i(32190),u=i(48428);function d(){let e=process.env.NEXT_PUBLIC_SITE_URL||"https://mind.restyart.com",t=new Date;return[{url:e,lastModified:t,changeFrequency:"daily",priority:1},{url:`${e}/chat`,lastModified:t,changeFrequency:"weekly",priority:.9},{url:`${e}/personality-test`,lastModified:t,changeFrequency:"weekly",priority:.8},{url:`${e}/emotion-diary`,lastModified:t,changeFrequency:"weekly",priority:.8},{url:`${e}/content`,lastModified:t,changeFrequency:"weekly",priority:.7},{url:`${e}/inquiry`,lastModified:t,changeFrequency:"monthly",priority:.6},{url:`${e}/privacy`,lastModified:t,changeFrequency:"yearly",priority:.3},{url:`${e}/terms`,lastModified:t,changeFrequency:"yearly",priority:.3},...u.sk.filter(e=>"published"===e.status).map(i=>({url:`${e}/content/${i.slug}`,lastModified:t,changeFrequency:"monthly",priority:.6}))]}var c=i(12127);let p={...r}.default;if("function"!=typeof p)throw Error('Default export is missing in "/Users/baejinho/Documents/resty/mind/app/sitemap.ts"');async function m(e,t){let{__metadata_id__:i,...r}=await t.params||{},n=!!i&&i.endsWith(".xml");if(i&&!n)return new l.NextResponse("Not Found",{status:404});let o=i&&n?i.slice(0,-4):void 0,s=await p({id:o}),a=(0,c.resolveRouteData)(s,"sitemap");return new l.NextResponse(a,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=0, must-revalidate"}})}let f=new o.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"sitemap",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"next-metadata-route-loader?filePath=%2FUsers%2Fbaejinho%2FDocuments%2Fresty%2Fmind%2Fapp%2Fsitemap.ts&isDynamicRouteExtension=1!?__next_metadata_route__",nextConfigOutput:"",userland:n}),{workAsyncStorage:g,workUnitAsyncStorage:v,serverHooks:y}=f;function h(){return(0,a.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:v})}},77341:(e,t)=>{"use strict";function i(e){return Array.isArray(e)?e:[e]}function r(e){if(null!=e)return i(e)}function n(e){let t;if("string"==typeof e)try{t=(e=new URL(e)).origin}catch{}return t}Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var i in t)Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}(t,{getOrigin:function(){return n},resolveArray:function(){return i},resolveAsArrayOrUndefined:function(){return r}})},78335:()=>{},96487:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[447,580],()=>i(72018));module.exports=r})();