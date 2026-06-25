(()=>{var e={};e.id=849,e.ids=[849],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5830:(e,t,s)=>{"use strict";s.d(t,{Mq:()=>l,VQ:()=>p,Vt:()=>d,id:()=>g});let r=new(s(37449)).ij(process.env.GOOGLE_GENERATIVE_AI_API_KEY||""),n=new Map,o=["자살","죽고싶","죽고 싶","자해","목숨","생을 마감","세상을 떠나","더 이상 살기","살 이유","죽는 게","자살하고","목을 매","뛰어내리","약을 먹고","칼로","자살 생각","죽음","끝내고 싶"],i={sad:["슬프","우울","눈물","힘들","괴로","절망","외로","공허"],angry:["화나","짜증","분노","열받","억울","빡쳐","미치겠"],anxious:["불안","걱정","두려","무서","떨려","긴장","초조"],stressed:["스트레스","압박","부담","피곤","지쳐","벅차"],happy:["기쁘","행복","좋아","즐거","신나","만족","감사"],confused:["혼란","모르겠","헷갈","복잡","애매","확실하지"]};function a(){return`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}let u=`당신은 전문적인 AI 심리상담사입니다. 다음 지침을 따라 상담을 진행해주세요:

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
- 마음챙김과 자기돌봄 강조`,c={async generateResponse(e,t,s=[]){try{var c;let l=t;l||(l=a(),n.set(l,{id:l,messages:[],startTime:new Date,lastActivity:new Date}));let p=n.get(l);p&&(p.lastActivity=new Date);let g=function(e){for(let[t,s]of Object.entries(i))if(s.some(t=>e.includes(t)))return t;return"neutral"}(e);let d=o.some(t=>e.includes(t)),m=r.getGenerativeModel({model:"gemini-2.5-flash-lite",systemInstruction:u}),y=s.slice(-10).map(e=>`${"user"===e.role?"사용자":"상담사"}: ${e.content}`).join("\n"),h=`
대화 맥락:
${y}

현재 사용자 메시지: ${e}

감지된 감정: ${g}
위기 상황: ${d?"예":"아니오"}

위 정보를 바탕으로 전문적이고 공감적인 상담 응답을 제공해주세요.
${d?"\n⚠️ 위기 상황이 감지되었습니다. 즉시 전문기관 연계를 안내해주세요.":""}
`,f=(await m.generateContent(h)).response.text(),v={confidence:d?.9:.3*Math.random()+.7,category:d?"crisis":g,suggestions:(c=g,d?["전문가와 상담하기","생명의전화 연결하기","가족이나 친구에게 도움 요청하기"]:({sad:["감정 일기 써보기","좋아하는 음악 듣기","산책하며 자연 느끼기","신뢰하는 사람과 대화하기"],angry:["심호흡으로 마음 진정하기","운동으로 에너지 발산하기","분노의 원인 파악하기","건설적인 해결방안 찾기"],anxious:["마음챙김 명상하기","불안한 생각 적어보기","규칙적인 생활 패턴 만들기","전문가 상담 받기"],stressed:["우선순위 정리하기","휴식 시간 확보하기","스트레스 해소 활동하기","업무량 조절하기"],happy:["긍정적인 순간 기록하기","감사한 일 나누기","새로운 목표 설정하기","행복한 에너지 전파하기"],confused:["상황 정리해보기","신뢰하는 사람과 상의하기","시간을 두고 생각하기","전문가 조언 구하기"]})[c]||["자신의 감정 인정하기","충분한 휴식 취하기","건강한 생활습관 유지하기","필요시 전문가 도움 받기"])};return p&&p.messages.push({role:"user",content:e,timestamp:new Date},{role:"assistant",content:f,timestamp:new Date}),{response:f,emotion:g,crisis:d,sessionId:l,metadata:v}}catch(e){return console.error("AI Provider Error:",e),{response:"죄송합니다. 일시적인 기술적 문제가 발생했습니다. 잠시 후 다시 시도해주시거나, 긴급한 상황이시라면 생명의전화(1588-9191)로 연락해주세요.",emotion:"neutral",crisis:!1,sessionId:t||a(),metadata:{confidence:.5,category:"error",suggestions:["다시 시도해보세요","전문기관에 연락하세요"]}}}},getSession:e=>n.get(e),endSession(e){n.delete(e)},getAllSessions:()=>Array.from(n.values())};function l(e){return"string"==typeof e&&e.trim().length>0&&e.length<=1e3}function p(e){return e.trim().replace(/[<>]/g,"")}let g={createSession(e){let t=a(),s={id:t,messages:[],startTime:new Date,lastActivity:new Date};return n.set(t,s),s},getSession:e=>n.get(e),addMessage(e,t){let s=n.get(e);s&&(s.messages.push(t),s.lastActivity=new Date)},endSession(e){n.delete(e)},getSessionStats(e){let t=n.get(e);if(!t)return null;let s=Date.now()-t.startTime.getTime(),r=t.messages.length;return{duration:Math.floor(s/1e3/60),messageCount:r,userMessages:t.messages.filter(e=>"user"===e.role).length,assistantMessages:t.messages.filter(e=>"assistant"===e.role).length,startTime:t.startTime,lastActivity:t.lastActivity}}},d={generateResponse:async(e,t,s)=>c.generateResponse(e,s.id,t),generateCrisisResponse:async e=>`🚨 **긴급 상황 안내**

현재 매우 힘든 상황에 계신 것 같습니다. 혼자 견디지 마시고 즉시 전문가의 도움을 받으시기 바랍니다.

**즉시 연락 가능한 곳:**
• 생명의전화: 1588-9191 (24시간)
• 청소년전화: 1388 (24시간)
• 정신건강위기상담전화: 1577-0199 (24시간)
• 응급상황: 119

당신의 생명은 소중합니다. 지금 이 순간의 고통이 영원하지 않다는 것을 기억해주세요. 전문가들이 당신을 도울 준비가 되어 있습니다.`}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},23400:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>h,routeModule:()=>g,serverHooks:()=>y,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>m});var r={};s.r(r),s.d(r,{GET:()=>p,POST:()=>l});var n=s(96559),o=s(48088),i=s(37719),a=s(32190),u=s(5830),c=s(95614);async function l(e){try{let{emotions:t,diaryEntry:s,userId:r}=await e.json();if(!t&&!s)return a.NextResponse.json({error:"감정 데이터 또는 일기 내용이 필요합니다."},{status:400});let n="다음 감정 데이터를 분석하고 인사이트를 제공해주세요:\n\n";t&&(n+=`감정 점수: ${JSON.stringify(t)}
`),s&&(n+=`일기 내용: ${s}
`),n+=`
분석 결과를 다음 형식으로 제공해주세요:
1. 현재 감정 상태 요약
2. 감정 패턴 분석
3. 스트레스 요인 파악
4. 감정 관리 조언
5. 추천 활동
6. 긍정적 변화를 위한 제안
    `;let o=await (0,u.generateAIResponse)(n,u.PSYCHOLOGY_PROMPTS.emotionCoach,{maxTokens:1200,temperature:.6}),i=t?Object.values(t).reduce((e,t)=>e+("number"==typeof t?t:0),0)/Object.keys(t).length:5;return c.sK.emotionDiaryWrite(i.toString()),c.sK.featureUsage("emotion_analysis"),console.log(`💭 감정 분석 완료:`,{emotionScore:i,provider:o.provider,tokens:o.tokens,cost:o.cost}),a.NextResponse.json({insights:o.content,emotionScore:i,provider:o.provider,tokens:o.tokens,cost:o.cost,timestamp:new Date().toISOString()})}catch(e){return console.error("감정 분석 API 오류:",e),c.sK.errorTracking("emotion_analysis_error","api"),a.NextResponse.json({error:"감정 분석 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function p(){return a.NextResponse.json({status:"감정 분석 서비스가 정상 작동 중입니다.",timestamp:new Date().toISOString()})}let g=new n.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/emotion-insights/route",pathname:"/api/emotion-insights",filename:"route",bundlePath:"app/api/emotion-insights/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mind/app/api/emotion-insights/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:m,serverHooks:y}=g;function h(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:m})}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},95614:(e,t,s)=>{"use strict";s.d(t,{sK:()=>r});let r={trackPageView:(e,t)=>{},startChat:e=>{},viewRegionalPage:e=>{},sendMessage:(e,t)=>{},endChat:e=>{},detectCrisis:(e,t)=>{},error:(e,t,s)=>{},performance:(e,t,s)=>{},trackUserAction:(e,t,s,r)=>{},buttonClick:e=>{},trackConversion:(e,t)=>{},trackContentInteraction:(e,t,s)=>{}}},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[447,580,449],()=>s(23400));module.exports=r})();