(()=>{var e={};e.id=505,e.ids=[505],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5830:(e,t,n)=>{"use strict";n.d(t,{Mq:()=>l,VQ:()=>m,Vt:()=>p,id:()=>g});let s=new(n(37449)).ij(process.env.GOOGLE_GENERATIVE_AI_API_KEY||""),r=new Map,o=["자살","죽고싶","죽고 싶","자해","목숨","생을 마감","세상을 떠나","더 이상 살기","살 이유","죽는 게","자살하고","목을 매","뛰어내리","약을 먹고","칼로","자살 생각","죽음","끝내고 싶"],a={sad:["슬프","우울","눈물","힘들","괴로","절망","외로","공허"],angry:["화나","짜증","분노","열받","억울","빡쳐","미치겠"],anxious:["불안","걱정","두려","무서","떨려","긴장","초조"],stressed:["스트레스","압박","부담","피곤","지쳐","벅차"],happy:["기쁘","행복","좋아","즐거","신나","만족","감사"],confused:["혼란","모르겠","헷갈","복잡","애매","확실하지"]};function i(){return`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}let c=`당신은 전문적인 AI 심리상담사입니다. 다음 지침을 따라 상담을 진행해주세요:

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
- 마음챙김과 자기돌봄 강조`,u={async generateResponse(e,t,n=[]){try{var u;let l=t;l||(l=i(),r.set(l,{id:l,messages:[],startTime:new Date,lastActivity:new Date}));let m=r.get(l);m&&(m.lastActivity=new Date);let g=function(e){for(let[t,n]of Object.entries(a))if(n.some(t=>e.includes(t)))return t;return"neutral"}(e);let p=o.some(t=>e.includes(t)),d=s.getGenerativeModel({model:"gemini-1.5-flash",systemInstruction:c}),h=n.slice(-10).map(e=>`${"user"===e.role?"사용자":"상담사"}: ${e.content}`).join("\n"),_=`
대화 맥락:
${h}

현재 사용자 메시지: ${e}

감지된 감정: ${g}
위기 상황: ${p?"예":"아니오"}

위 정보를 바탕으로 전문적이고 공감적인 상담 응답을 제공해주세요.
${p?"\n⚠️ 위기 상황이 감지되었습니다. 즉시 전문기관 연계를 안내해주세요.":""}
`,y=(await d.generateContent(_)).response.text(),f={confidence:p?.9:.3*Math.random()+.7,category:p?"crisis":g,suggestions:(u=g,p?["전문가와 상담하기","생명의전화 연결하기","가족이나 친구에게 도움 요청하기"]:({sad:["감정 일기 써보기","좋아하는 음악 듣기","산책하며 자연 느끼기","신뢰하는 사람과 대화하기"],angry:["심호흡으로 마음 진정하기","운동으로 에너지 발산하기","분노의 원인 파악하기","건설적인 해결방안 찾기"],anxious:["마음챙김 명상하기","불안한 생각 적어보기","규칙적인 생활 패턴 만들기","전문가 상담 받기"],stressed:["우선순위 정리하기","휴식 시간 확보하기","스트레스 해소 활동하기","업무량 조절하기"],happy:["긍정적인 순간 기록하기","감사한 일 나누기","새로운 목표 설정하기","행복한 에너지 전파하기"],confused:["상황 정리해보기","신뢰하는 사람과 상의하기","시간을 두고 생각하기","전문가 조언 구하기"]})[u]||["자신의 감정 인정하기","충분한 휴식 취하기","건강한 생활습관 유지하기","필요시 전문가 도움 받기"])};return m&&m.messages.push({role:"user",content:e,timestamp:new Date},{role:"assistant",content:y,timestamp:new Date}),{response:y,emotion:g,crisis:p,sessionId:l,metadata:f}}catch(e){return console.error("AI Provider Error:",e),{response:"죄송합니다. 일시적인 기술적 문제가 발생했습니다. 잠시 후 다시 시도해주시거나, 긴급한 상황이시라면 생명의전화(1588-9191)로 연락해주세요.",emotion:"neutral",crisis:!1,sessionId:t||i(),metadata:{confidence:.5,category:"error",suggestions:["다시 시도해보세요","전문기관에 연락하세요"]}}}},getSession:e=>r.get(e),endSession(e){r.delete(e)},getAllSessions:()=>Array.from(r.values())};function l(e){return"string"==typeof e&&e.trim().length>0&&e.length<=1e3}function m(e){return e.trim().replace(/[<>]/g,"")}let g={createSession(e){let t=i(),n={id:t,messages:[],startTime:new Date,lastActivity:new Date};return r.set(t,n),n},getSession:e=>r.get(e),addMessage(e,t){let n=r.get(e);n&&(n.messages.push(t),n.lastActivity=new Date)},endSession(e){r.delete(e)},getSessionStats(e){let t=r.get(e);if(!t)return null;let n=Date.now()-t.startTime.getTime(),s=t.messages.length;return{duration:Math.floor(n/1e3/60),messageCount:s,userMessages:t.messages.filter(e=>"user"===e.role).length,assistantMessages:t.messages.filter(e=>"assistant"===e.role).length,startTime:t.startTime,lastActivity:t.lastActivity}}},p={generateResponse:async(e,t,n)=>u.generateResponse(e,n.id,t),generateCrisisResponse:async e=>`🚨 **긴급 상황 안내**

현재 매우 힘든 상황에 계신 것 같습니다. 혼자 견디지 마시고 즉시 전문가의 도움을 받으시기 바랍니다.

**즉시 연락 가능한 곳:**
• 생명의전화: 1588-9191 (24시간)
• 청소년전화: 1388 (24시간)
• 정신건강위기상담전화: 1577-0199 (24시간)
• 응급상황: 119

당신의 생명은 소중합니다. 지금 이 순간의 고통이 영원하지 않다는 것을 기억해주세요. 전문가들이 당신을 도울 준비가 되어 있습니다.`}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55421:(e,t,n)=>{"use strict";n.r(t),n.d(t,{patchFetch:()=>A,routeModule:()=>j,serverHooks:()=>v,workAsyncStorage:()=>w,workUnitAsyncStorage:()=>x});var s={};n.r(s),n.d(s,{GET:()=>f,POST:()=>l});var r=n(96559),o=n(48088),a=n(37719),i=n(32190),c=n(5830),u=n(95614);async function l(e){try{let{answers:t}=await e.json();if(!t||"object"!=typeof t)return i.NextResponse.json({error:"성격 테스트 답변이 필요합니다."},{status:400});console.log("\uD83E\uDDE0 심리 성향 분석 시작:",{answersCount:Object.keys(t).length});let n={stress_coping:[],communication:[],attachment:[],parenting:[],emotion_regulation:[]},s={1:"stress_coping",2:"stress_coping",3:"stress_coping",4:"stress_coping",5:"stress_coping",6:"communication",7:"communication",8:"communication",9:"communication",10:"communication",11:"attachment",12:"attachment",13:"attachment",14:"attachment",15:"attachment",16:"parenting",17:"parenting",18:"parenting",19:"parenting",20:"parenting",21:"emotion_regulation",22:"emotion_regulation",23:"emotion_regulation",24:"emotion_regulation",25:"emotion_regulation"};Object.entries(t).forEach(([e,t])=>{let r=s[Number.parseInt(e)];r&&"number"==typeof t&&n[r].push(t)});let r={};Object.entries(n).forEach(([e,t])=>{r[e]=t.length>0?t.reduce((e,t)=>e+t,0)/t.length:0});let o=Object.entries(t).map(([e,t])=>{let n=s[Number.parseInt(e)];return`질문 ${e} (${n}): 점수 ${t}/5`}).join("\n"),a=`다음은 사용자의 심리 성향 테스트 답변입니다. 25개 질문을 5개 카테고리로 분석한 결과입니다:

${o}

카테고리별 평균 점수:
- 스트레스 대처 방식: ${r.stress_coping?.toFixed(2)}
- 의사소통 스타일: ${r.communication?.toFixed(2)}
- 애착 스타일: ${r.attachment?.toFixed(2)}
- 육아/교육 철학: ${r.parenting?.toFixed(2)}
- 감정 조절 능력: ${r.emotion_regulation?.toFixed(2)}

다음 형식으로 상세한 분석을 제공해주세요:

1. 주요 성향 (가장 높은 점수의 카테고리)
2. 성향별 특징 설명 (각 카테고리별 2-3문장)
3. 주요 강점 3가지
4. 성장이 필요한 영역 3가지
5. 추천 상담사 (nurturing_mom, practical_dad, energy_coach, education_expert, relationship_counselor, stress_manager 중 1개)
6. 추천 이유
7. 맞춤형 조언 (구체적이고 실용적인 3-4문장)

한국어로 따뜻하고 전문적으로 작성해주세요.`,l=await (0,c.generateAIResponse)(a,c.PSYCHOLOGY_PROMPTS.GENERAL_COUNSELING);if(!l.success)throw Error(l.error||"AI 분석 실패");let y=l.data||"",f=Object.entries(r).reduce((e,t)=>r[e[0]]>r[t[0]]?e:t)[0],j=y.match(/(nurturing_mom|practical_dad|energy_coach|education_expert|relationship_counselor|stress_manager)/i),w=j?j[0].toLowerCase():m(f),x=g(y,"강점")||p(f),v=g(y,"성장")||d(f),A={primaryType:f,scores:r,strengths:x,growthAreas:v,recommendedConsultant:w,detailedAnalysis:y,insights:h(r),recommendations:_(f,r)};try{u.sK.personalityTestComplete(f,w)}catch(e){console.warn("Analytics tracking failed:",e)}return console.log("\uD83E\uDDE0 심리 분석 완료:",{primaryType:f,recommendedConsultant:w,responseLength:y.length}),i.NextResponse.json(A)}catch(t){console.error("심리 분석 API 오류:",t);try{let{answers:t={}}=await e.json().catch(()=>({answers:{}})),n=function(e){let t={stress_coping:0,communication:0,attachment:0,parenting:0,emotion_regulation:0},n={1:"stress_coping",2:"stress_coping",3:"stress_coping",4:"stress_coping",5:"stress_coping",6:"communication",7:"communication",8:"communication",9:"communication",10:"communication",11:"attachment",12:"attachment",13:"attachment",14:"attachment",15:"attachment",16:"parenting",17:"parenting",18:"parenting",19:"parenting",20:"parenting",21:"emotion_regulation",22:"emotion_regulation",23:"emotion_regulation",24:"emotion_regulation",25:"emotion_regulation"},s={stress_coping:0,communication:0,attachment:0,parenting:0,emotion_regulation:0};Object.entries(e).forEach(([e,r])=>{let o=n[Number.parseInt(e)];o&&"number"==typeof r&&(t[o]+=r,s[o]++)});let r={};Object.entries(t).forEach(([e,t])=>{r[e]=s[e]>0?t/s[e]:3});let o=Object.entries(r).reduce((e,t)=>r[e[0]]>r[t[0]]?e:t)[0],a=m(o);return{primaryType:o,scores:r,strengths:p(o),growthAreas:d(o),recommendedConsultant:a,detailedAnalysis:`당신의 주요 성향은 ${y(o)} 영역에서 나타납니다. 이는 당신이 이 영역에서 특별한 강점을 가지고 있음을 의미합니다. 동시에 다른 영역들도 균형 있게 발달시켜 나가시면 더욱 건강한 심리적 성장을 이룰 수 있을 것입니다.`,insights:h(r),recommendations:_(o,r)}}(t);return console.log("\uD83C\uDD98 폴백 분석 제공:",n.primaryType),i.NextResponse.json(n)}catch(e){return console.error("폴백 분석도 실패:",e),i.NextResponse.json({error:"심리 분석 중 문제가 발생했습니다.",primaryType:"balanced",scores:{stress_coping:3,communication:3,attachment:3,parenting:3,emotion_regulation:3},strengths:["균형감","적응력","공감 능력"],growthAreas:["자기 인식","감정 표현","스트레스 관리"],recommendedConsultant:"nurturing_mom",detailedAnalysis:"당신은 균형 잡힌 성향을 가지고 계시며, 상황에 따라 유연하게 대응하는 능력이 있습니다."})}}}function m(e){return({stress_coping:"stress_manager",communication:"relationship_counselor",attachment:"nurturing_mom",parenting:"practical_dad",emotion_regulation:"energy_coach"})[e]||"nurturing_mom"}function g(e,t){let n=RegExp(`${t}[^:]*:([^\\n]*(?:\\n[^\\n]*){0,2})`,"i"),s=e.match(n);return s?s[1].split(/[,\n]/).map(e=>e.trim()).filter(e=>e.length>0).slice(0,3):null}function p(e){return({stress_coping:["문제 해결 능력","위기 대처 능력","회복력"],communication:["소통 능력","공감 능력","관계 형성 능력"],attachment:["안정감","신뢰 구축 능력","정서적 지지"],parenting:["양육 역량","교육적 관점","아이 이해력"],emotion_regulation:["감정 인식","자기 조절","정서적 안정성"]})[e]||["균형감","적응력","성장 의지"]}function d(e){return({stress_coping:["스트레스 예방","휴식 기술","지원 체계 구축"],communication:["감정 표현","경계 설정","갈등 해결"],attachment:["독립성","자기 돌봄","관계 다양성"],parenting:["일관성","감정 조절","자기 돌봄"],emotion_regulation:["감정 표현","스트레스 관리","대인 관계"]})[e]||["자기 인식","감정 표현","스트레스 관리"]}function h(e){let t=[],n=Object.entries(e).sort(([,e],[,t])=>t-e),s=n[0],r=n[n.length-1];return t.push(`${y(s[0])} 영역에서 가장 강한 성향을 보입니다.`),t.push(`${y(r[0])} 영역에서 성장의 여지가 있습니다.`),Object.values(e).reduce((t,n)=>t+Math.pow(n-Object.values(e).reduce((e,t)=>e+t,0)/Object.values(e).length,2),0)/Object.values(e).length<.5?t.push("전반적으로 균형 잡힌 성향을 가지고 계십니다."):t.push("특정 영역에서 뚜렷한 특성을 보이는 성향입니다."),t}function _(e,t){let n=[],s={stress_coping:"스트레스 관리",communication:"소통 기술",attachment:"관계 형성",parenting:"육아 방식",emotion_regulation:"감정 조절"};return Object.entries(t).forEach(([e,t])=>{t<2.5&&n.push(`${s[e]} 영역의 개선을 위한 전문적 도움을 고려해보세요.`)}),n.push("정기적인 자기 성찰과 감정 일기 작성을 추천합니다."),n.push("스트레스 관리를 위한 이완 기법을 배워보세요."),n.push("가족이나 친구들과의 소통 시간을 늘려보세요."),n.slice(0,3)}function y(e){return({stress_coping:"스트레스 대처",communication:"의사소통",attachment:"애착 관계",parenting:"육아 철학",emotion_regulation:"감정 조절"})[e]||e}async function f(){return i.NextResponse.json({status:"심리 성향 분석 서비스가 정상 작동 중입니다.",timestamp:new Date().toISOString()})}let j=new r.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/personality-analysis/route",pathname:"/api/personality-analysis",filename:"route",bundlePath:"app/api/personality-analysis/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mind/app/api/personality-analysis/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:w,workUnitAsyncStorage:x,serverHooks:v}=j;function A(){return(0,a.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:x})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},95614:(e,t,n)=>{"use strict";n.d(t,{sK:()=>s});let s={trackPageView:(e,t)=>{},startChat:e=>{},viewRegionalPage:e=>{},sendMessage:(e,t)=>{},endChat:e=>{},detectCrisis:(e,t)=>{},error:(e,t,n)=>{},performance:(e,t,n)=>{},trackUserAction:(e,t,n,s)=>{},buttonClick:e=>{},trackConversion:(e,t)=>{},trackContentInteraction:(e,t,n)=>{}}},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),s=t.X(0,[447,580,449],()=>n(55421));module.exports=s})();