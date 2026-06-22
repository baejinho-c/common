(()=>{var e={};e.id=957,e.ids=[957],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5830:(e,t,s)=>{"use strict";s.d(t,{Mq:()=>l,VQ:()=>g,Vt:()=>d,id:()=>p});let r=new(s(37449)).ij(process.env.GOOGLE_GENERATIVE_AI_API_KEY||""),n=new Map,a=["자살","죽고싶","죽고 싶","자해","목숨","생을 마감","세상을 떠나","더 이상 살기","살 이유","죽는 게","자살하고","목을 매","뛰어내리","약을 먹고","칼로","자살 생각","죽음","끝내고 싶"],o={sad:["슬프","우울","눈물","힘들","괴로","절망","외로","공허"],angry:["화나","짜증","분노","열받","억울","빡쳐","미치겠"],anxious:["불안","걱정","두려","무서","떨려","긴장","초조"],stressed:["스트레스","압박","부담","피곤","지쳐","벅차"],happy:["기쁘","행복","좋아","즐거","신나","만족","감사"],confused:["혼란","모르겠","헷갈","복잡","애매","확실하지"]};function i(){return`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}let c=`당신은 전문적인 AI 심리상담사입니다. 다음 지침을 따라 상담을 진행해주세요:

1. 공감적이고 따뜻한 태도로 응답하세요
2. 사용자의 감정을 인정하고 검증해주세요
3. 판단하지 말고 경청하는 자세를 보여주세요
4. 구체적이고 실용적인 조언을 제공하세요
5. 필요시 전문기관 연계를 안내하세요
6. 위기 상황에서는 즉시 도움을 요청하도록 안내하세요
7. 한국어로 자연스럽게 대화하세요
8. 응답은 200-300자 내외로 간결하게 작성하세요

위기 상황 감지 시:
- 생명의전화: 1588-9191
- 청소년전화: 1388
- 정신건강위기상담전화: 1577-0199
- 응급실: 119

상담 스타일:
- 지지적이고 비판단적
- 해결책 중심적 접근
- 인지행동치료 기법 활용
- 마음챙김과 자기돌봄 강조`,u={async generateResponse(e,t,s=[]){try{var u;let l=t;l||(l=i(),n.set(l,{id:l,messages:[],startTime:new Date,lastActivity:new Date}));let g=n.get(l);g&&(g.lastActivity=new Date);let p=function(e){for(let[t,s]of Object.entries(o))if(s.some(t=>e.includes(t)))return t;return"neutral"}(e);let d=a.some(t=>e.includes(t)),m=r.getGenerativeModel({model:"gemini-1.5-flash",systemInstruction:c}),f=s.slice(-10).map(e=>`${"user"===e.role?"사용자":"상담사"}: ${e.content}`).join("\n"),v=`
대화 맥락:
${f}

현재 사용자 메시지: ${e}

감지된 감정: ${p}
위기 상황: ${d?"예":"아니오"}

위 정보를 바탕으로 전문적이고 공감적인 상담 응답을 제공해주세요.
${d?"\n⚠️ 위기 상황이 감지되었습니다. 즉시 전문기관 연계를 안내해주세요.":""}
`,y=(await m.generateContent(v)).response.text(),w={confidence:d?.9:.3*Math.random()+.7,category:d?"crisis":p,suggestions:(u=p,d?["전문가와 상담하기","생명의전화 연결하기","가족이나 친구에게 도움 요청하기"]:({sad:["감정 일기 써보기","좋아하는 음악 듣기","산책하며 자연 느끼기","신뢰하는 사람과 대화하기"],angry:["심호흡으로 마음 진정하기","운동으로 에너지 발산하기","분노의 원인 파악하기","건설적인 해결방안 찾기"],anxious:["마음챙김 명상하기","불안한 생각 적어보기","규칙적인 생활 패턴 만들기","전문가 상담 받기"],stressed:["우선순위 정리하기","휴식 시간 확보하기","스트레스 해소 활동하기","업무량 조절하기"],happy:["긍정적인 순간 기록하기","감사한 일 나누기","새로운 목표 설정하기","행복한 에너지 전파하기"],confused:["상황 정리해보기","신뢰하는 사람과 상의하기","시간을 두고 생각하기","전문가 조언 구하기"]})[u]||["자신의 감정 인정하기","충분한 휴식 취하기","건강한 생활습관 유지하기","필요시 전문가 도움 받기"])};return g&&g.messages.push({role:"user",content:e,timestamp:new Date},{role:"assistant",content:y,timestamp:new Date}),{response:y,emotion:p,crisis:d,sessionId:l,metadata:w}}catch(e){return console.error("AI Provider Error:",e),{response:"죄송합니다. 일시적인 기술적 문제가 발생했습니다. 잠시 후 다시 시도해주시거나, 긴급한 상황이시라면 생명의전화(1588-9191)로 연락해주세요.",emotion:"neutral",crisis:!1,sessionId:t||i(),metadata:{confidence:.5,category:"error",suggestions:["다시 시도해보세요","전문기관에 연락하세요"]}}}},getSession:e=>n.get(e),endSession(e){n.delete(e)},getAllSessions:()=>Array.from(n.values())};function l(e){return"string"==typeof e&&e.trim().length>0&&e.length<=1e3}function g(e){return e.trim().replace(/[<>]/g,"")}let p={createSession(e){let t=i(),s={id:t,messages:[],startTime:new Date,lastActivity:new Date};return n.set(t,s),s},getSession:e=>n.get(e),addMessage(e,t){let s=n.get(e);s&&(s.messages.push(t),s.lastActivity=new Date)},endSession(e){n.delete(e)},getSessionStats(e){let t=n.get(e);if(!t)return null;let s=Date.now()-t.startTime.getTime(),r=t.messages.length;return{duration:Math.floor(s/1e3/60),messageCount:r,userMessages:t.messages.filter(e=>"user"===e.role).length,assistantMessages:t.messages.filter(e=>"assistant"===e.role).length,startTime:t.startTime,lastActivity:t.lastActivity}}},d={generateResponse:async(e,t,s)=>u.generateResponse(e,s.id,t),generateCrisisResponse:async e=>`🚨 **긴급 상황 안내**

현재 매우 힘든 상황에 계신 것 같습니다. 혼자 견디지 마시고 즉시 전문가의 도움을 받으시기 바랍니다.

**즉시 연락 가능한 곳:**
• 생명의전화: 1588-9191 (24시간)
• 청소년전화: 1388 (24시간)
• 정신건강위기상담전화: 1577-0199 (24시간)
• 응급상황: 119

당신의 생명은 소중합니다. 지금 이 순간의 고통이 영원하지 않다는 것을 기억해주세요. 전문가들이 당신을 도울 준비가 되어 있습니다.`}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},94016:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>v,routeModule:()=>p,serverHooks:()=>f,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>m});var r={};s.r(r),s.d(r,{GET:()=>g,POST:()=>l});var n=s(96559),a=s(48088),o=s(37719),i=s(32190),c=s(5830),u=s(95614);async function l(e){try{let{topic:t,category:s,targetAudience:r="초등학생 부모",contentType:n="article"}=await e.json();if(!t)return i.NextResponse.json({error:"콘텐츠 주제가 필요합니다."},{status:400});let a=`
다음 조건에 맞는 ${"article"===n?"블로그 글":"콘텐츠"}을 작성해주세요:

주제: ${t}
카테고리: ${s||"일반"}
대상 독자: ${r}

요구사항:
1. SEO 최적화된 제목 (H1)
2. 소제목들 (H2, H3)
3. 읽기 쉬운 문체
4. 실용적인 정보 제공
5. 독자의 관심을 끄는 도입부
6. 명확한 결론
7. 1500-2000자 분량

특히 ${r}가 관심을 가질 만한 내용으로 작성해주세요.
    `,o=await (0,c.generateAIResponse)(a,void 0,{maxTokens:2e3,temperature:.8}),l=o.content.split("\n"),g=l.find(e=>e.startsWith("#")||e.trim().length>0)?.replace(/^#+\s*/,"")||t;return u.sK.contentView(g,s||"generated"),u.sK.featureUsage("content_generation"),console.log(`📝 콘텐츠 생성 완료:`,{title:g,category:s,provider:o.provider,tokens:o.tokens,cost:o.cost}),i.NextResponse.json({title:g,content:o.content,category:s||"일반",targetAudience:r,provider:o.provider,tokens:o.tokens,cost:o.cost,timestamp:new Date().toISOString(),slug:g.toLowerCase().replace(/[^a-z0-9가-힣]/g,"-").replace(/-+/g,"-")})}catch(e){return console.error("콘텐츠 생성 API 오류:",e),u.sK.errorTracking("content_generation_error","api"),i.NextResponse.json({error:"콘텐츠 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function g(){return i.NextResponse.json({status:"콘텐츠 생성 서비스가 정상 작동 중입니다.",timestamp:new Date().toISOString()})}let p=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/content/generate/route",pathname:"/api/content/generate",filename:"route",bundlePath:"app/api/content/generate/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mind/app/api/content/generate/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:m,serverHooks:f}=p;function v(){return(0,o.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:m})}},95614:(e,t,s)=>{"use strict";s.d(t,{sK:()=>r});let r={trackPageView:(e,t)=>{},startChat:e=>{},viewRegionalPage:e=>{},sendMessage:(e,t)=>{},endChat:e=>{},detectCrisis:(e,t)=>{},error:(e,t,s)=>{},performance:(e,t,s)=>{},trackUserAction:(e,t,s,r)=>{},buttonClick:e=>{},trackConversion:(e,t)=>{},trackContentInteraction:(e,t,s)=>{}}},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[447,580,449],()=>s(94016));module.exports=r})();