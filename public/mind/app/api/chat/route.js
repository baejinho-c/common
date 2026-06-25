(()=>{var e={};e.id=276,e.ids=[276],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5830:(e,s,t)=>{"use strict";t.d(s,{Mq:()=>l,VQ:()=>d,Vt:()=>g,id:()=>p});let r=new(t(37449)).ij(process.env.GOOGLE_GENERATIVE_AI_API_KEY||""),n=new Map,o=["자살","죽고싶","죽고 싶","자해","목숨","생을 마감","세상을 떠나","더 이상 살기","살 이유","죽는 게","자살하고","목을 매","뛰어내리","약을 먹고","칼로","자살 생각","죽음","끝내고 싶"],a={sad:["슬프","우울","눈물","힘들","괴로","절망","외로","공허"],angry:["화나","짜증","분노","열받","억울","빡쳐","미치겠"],anxious:["불안","걱정","두려","무서","떨려","긴장","초조"],stressed:["스트레스","압박","부담","피곤","지쳐","벅차"],happy:["기쁘","행복","좋아","즐거","신나","만족","감사"],confused:["혼란","모르겠","헷갈","복잡","애매","확실하지"]};function i(){return`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}let c=`당신은 전문적인 AI 심리상담사입니다. 다음 지침을 따라 상담을 진행해주세요:

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
- 마음챙김과 자기돌봄 강조`,u={async generateResponse(e,s,t=[]){try{var u;let l=s;l||(l=i(),n.set(l,{id:l,messages:[],startTime:new Date,lastActivity:new Date}));let d=n.get(l);d&&(d.lastActivity=new Date);let p=function(e){for(let[s,t]of Object.entries(a))if(t.some(s=>e.includes(s)))return s;return"neutral"}(e),g=o.some(s=>e.includes(s)),m=r.getGenerativeModel({model:"gemini-2.5-flash-lite",systemInstruction:c}),f=t.slice(-10).map(e=>`${"user"===e.role?"사용자":"상담사"}: ${e.content}`).join("\n"),h=`
대화 맥락:
${f}

현재 사용자 메시지: ${e}

감지된 감정: ${p}
위기 상황: ${g?"예":"아니오"}

위 정보를 바탕으로 전문적이고 공감적인 상담 응답을 제공해주세요.
${g?"\n⚠️ 위기 상황이 감지되었습니다. 즉시 전문기관 연계를 안내해주세요.":""}
`,w=(await m.generateContent(h)).response.text(),y={confidence:g?.9:.3*Math.random()+.7,category:g?"crisis":p,suggestions:(u=p,g?["전문가와 상담하기","생명의전화 연결하기","가족이나 친구에게 도움 요청하기"]:({sad:["감정 일기 써보기","좋아하는 음악 듣기","산책하며 자연 느끼기","신뢰하는 사람과 대화하기"],angry:["심호흡으로 마음 진정하기","운동으로 에너지 발산하기","분노의 원인 파악하기","건설적인 해결방안 찾기"],anxious:["마음챙김 명상하기","불안한 생각 적어보기","규칙적인 생활 패턴 만들기","전문가 상담 받기"],stressed:["우선순위 정리하기","휴식 시간 확보하기","스트레스 해소 활동하기","업무량 조절하기"],happy:["긍정적인 순간 기록하기","감사한 일 나누기","새로운 목표 설정하기","행복한 에너지 전파하기"],confused:["상황 정리해보기","신뢰하는 사람과 상의하기","시간을 두고 생각하기","전문가 조언 구하기"]})[u]||["자신의 감정 인정하기","충분한 휴식 취하기","건강한 생활습관 유지하기","필요시 전문가 도움 받기"])};return d&&d.messages.push({role:"user",content:e,timestamp:new Date},{role:"assistant",content:w,timestamp:new Date}),{response:w,emotion:p,crisis:g,sessionId:l,metadata:y}}catch(e){return console.error("AI Provider Error:",e),{response:"죄송합니다. 일시적인 기술적 문제가 발생했습니다. 잠시 후 다시 시도해주시거나, 긴급한 상황이시라면 생명의전화(1588-9191)로 연락해주세요.",emotion:"neutral",crisis:!1,sessionId:s||i(),metadata:{confidence:.5,category:"error",suggestions:["다시 시도해보세요","전문기관에 연락하세요"]}}}},getSession:e=>n.get(e),endSession(e){n.delete(e)},getAllSessions:()=>Array.from(n.values())};function l(e){return"string"==typeof e&&e.trim().length>0&&e.length<=1e3}function d(e){return e.trim().replace(/[<>]/g,"")}let p={createSession(e){let s=i(),t={id:s,messages:[],startTime:new Date,lastActivity:new Date};return n.set(s,t),t},getSession:e=>n.get(e),addMessage(e,s){let t=n.get(e);t&&(t.messages.push(s),t.lastActivity=new Date)},endSession(e){n.delete(e)},getSessionStats(e){let s=n.get(e);if(!s)return null;let t=Date.now()-s.startTime.getTime(),r=s.messages.length;return{duration:Math.floor(t/1e3/60),messageCount:r,userMessages:s.messages.filter(e=>"user"===e.role).length,assistantMessages:s.messages.filter(e=>"assistant"===e.role).length,startTime:s.startTime,lastActivity:s.lastActivity}}},g={generateResponse:async(e,s,t)=>u.generateResponse(e,t.id,s),generateCrisisResponse:async e=>`🚨 **긴급 상황 안내**

현재 매우 힘든 상황에 계신 것 같습니다. 혼자 견디지 마시고 즉시 전문가의 도움을 받으시기 바랍니다.

**즉시 연락 가능한 곳:**
• 생명의전화: 1588-9191 (24시간)
• 청소년전화: 1388 (24시간)
• 정신건강위기상담전화: 1577-0199 (24시간)
• 응급상황: 119

당신의 생명은 소중합니다. 지금 이 순간의 고통이 영원하지 않다는 것을 기억해주세요. 전문가들이 당신을 도울 준비가 되어 있습니다.`}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},90474:(e,s,t)=>{"use strict";t.r(s),t.d(s,{patchFetch:()=>h,routeModule:()=>p,serverHooks:()=>f,workAsyncStorage:()=>g,workUnitAsyncStorage:()=>m});var r={};t.r(r),t.d(r,{OPTIONS:()=>d,POST:()=>l});var n=t(96559),o=t(48088),a=t(37719),i=t(32190),c=t(5830);let u=new Map;async function l(e){try{let s=e.ip||e.headers.get("x-forwarded-for")||"unknown";if(!function(e){let s=Date.now(),t=u.get(e);return!t||s>t.resetTime?(u.set(e,{count:1,resetTime:s+6e4}),!0):!(t.count>=20)&&(t.count++,!0)}(s))return i.NextResponse.json({success:!1,error:"너무 많은 요청입니다. 잠시 후 다시 시도해주세요."},{status:429});let{message:t,sessionId:r,conversationHistory:n}=await e.json();if(!(0,c.Mq)(t))return i.NextResponse.json({success:!1,error:"유효하지 않은 메시지입니다."},{status:400});let o=(0,c.VQ)(t),a=r?c.id.getSession(r):null;a||(a=c.id.createSession());let l={role:"user",content:o,timestamp:new Date};c.id.addMessage(a.id,l);let d=await c.Vt.generateResponse(o,n||a.messages.slice(-10),a);d.crisis&&(d.response=await c.Vt.generateCrisisResponse(o));let p={role:"assistant",content:d.response,timestamp:new Date,emotion:d.emotion,crisis:d.crisis};c.id.addMessage(a.id,p);let g={success:!0,data:{response:d.response,emotion:d.emotion||"neutral",crisis:d.crisis||!1,sessionId:a.id,metadata:{confidence:.85,category:d.crisis?"crisis":"general",suggestions:function(e){let s={sad:["감정을 표현하는 것이 도움이 될까요?","지금 가장 필요한 것은 무엇인가요?","이런 기분이 언제부터 시작되었나요?"],angry:["화가 나는 상황을 더 자세히 말해주세요","분노를 건강하게 표현하는 방법을 찾아볼까요?","이 감정의 근본 원인은 무엇일까요?"],anxious:["불안한 생각들을 정리해볼까요?","심호흡을 함께 해보시겠어요?","걱정되는 일들을 구체적으로 나누어볼까요?"],stressed:["스트레스의 주요 원인은 무엇인가요?","휴식이 필요한 시점인 것 같아요","스트레스 관리 방법을 함께 찾아볼까요?"],happy:["이 좋은 기분을 더 오래 유지하려면?","행복한 순간을 더 자세히 나누어주세요","감사한 일들을 함께 생각해볼까요?"],confused:["혼란스러운 상황을 정리해볼까요?","어떤 부분이 가장 어려우신가요?","단계별로 차근차근 생각해보시겠어요?"],neutral:["오늘 하루는 어떠셨나요?","요즘 관심사나 고민이 있으신가요?","편안하게 이야기 나누어보아요"]};return s[e]||s.neutral}(d.emotion||"neutral")}}};return d.crisis&&console.log(`Crisis detected for session ${a.id}`),i.NextResponse.json(g)}catch(e){return console.error("Chat API error:",e),i.NextResponse.json({success:!1,error:"서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."},{status:500})}}async function d(e){return new i.NextResponse(null,{status:200,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}})}let p=new n.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mind/app/api/chat/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:g,workUnitAsyncStorage:m,serverHooks:f}=p;function h(){return(0,a.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:m})}},96487:()=>{}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[447,580,449],()=>t(90474));module.exports=r})();