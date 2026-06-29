"use strict";(()=>{var e={};e.id=505,e.ids=[505],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2355:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>h,patchFetch:()=>g,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>d,staticGenerationAsyncStorage:()=>m});var i={};a.r(i),a.d(i,{POST:()=>l});var n=a(3278),s=a(5002),r=a(4877),o=a(1309),c=a(6398);async function l(e){try{let{prompt:t,taskType:a="simple"}=await e.json();if(!t)return o.NextResponse.json({error:"프롬프트가 필요합니다."},{status:400});let i=await c.$9.generateText(t,a);return o.NextResponse.json({success:!0,data:i,model:"optimized",timestamp:new Date().toISOString()})}catch(e){return console.error("AI 생성 API 오류:",e),o.NextResponse.json({error:"AI 응답 생성에 실패했습니다."},{status:500})}}let p=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/ai/generate/route",pathname:"/api/ai/generate",filename:"route",bundlePath:"app/api/ai/generate/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/crm/app/api/ai/generate/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:m,serverHooks:d}=p,h="/api/ai/generate/route";function g(){return(0,r.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:m})}},6398:(e,t,a)=>{a.d(t,{$9:()=>s});var i=a(8339);class n{static getInstance(){return n.instance||(n.instance=new n),n.instance}async analyzeSentiment(e){let t,a;await new Promise(e=>setTimeout(e,1500));let n=["좋은","훌륭한","만족","성공","긍정적","우수한","효과적"],s=["나쁜","실망","문제","어려운","부정적","실패","불만"],r=e.toLowerCase().split(/\s+/),o=r.filter(e=>n.some(t=>e.includes(t))).length,c=r.filter(e=>s.some(t=>e.includes(t))).length;o>c?(t="positive",a=Math.min(.9,.6+(o-c)*.1)):c>o?(t="negative",a=Math.min(.9,.6+(c-o)*.1)):(t="neutral",a=.7);let l=r.filter(e=>e.length>2).slice(0,5);return(0,i.ZO)("ai_sentiment","analyze"),{sentiment:t,confidence:a,keywords:l,summary:`텍스트 분석 결과 ${"positive"===t?"긍정적":"negative"===t?"부정적":"중립적"}인 감정이 감지되었습니다.`,recommendations:["positive"===t?"긍정적인 피드백을 활용하여 관계를 더욱 강화하세요.":"negative"===t?"부정적인 요소를 파악하고 개선 방안을 마련하세요.":"추가적인 소통을 통해 고객의 의견을 더 자세히 파악하세요.","정기적인 피드백 수집을 통해 관계를 지속적으로 모니터링하세요.","AI 분석 결과를 바탕으로 맞춤형 커뮤니케이션 전략을 수립하세요."]}}async calculateLeadScore(e){let t;await new Promise(e=>setTimeout(e,2e3));let a=50,n=[];return"enterprise"===e.size?(a+=25,n.push({factor:"기업 규모",impact:"high",description:"대기업으로 높은 구매력을 보유하고 있습니다."})):"large"===e.size&&(a+=15,n.push({factor:"기업 규모",impact:"medium",description:"중견기업으로 안정적인 구매력을 보유하고 있습니다."})),["IT","기술","소프트웨어"].some(t=>e.industry?.toLowerCase().includes(t.toLowerCase()))&&(a+=20,n.push({factor:"업종",impact:"high",description:"기술 업종으로 디지털 솔루션에 대한 수요가 높습니다."})),e.lastContact&&new Date(e.lastContact)>new Date(Date.now()-2592e6)&&(a+=15,n.push({factor:"최근 활동",impact:"medium",description:"최근 30일 내 접촉이 있어 관심도가 높습니다."})),e.deals?.some(e=>["proposal","negotiation"].includes(e.stage))&&(a+=20,n.push({factor:"거래 단계",impact:"high",description:"진행 중인 거래가 있어 성사 가능성이 높습니다."})),t=(a=Math.min(100,Math.max(0,a)))>=80?"매우 높은 우선순위로 집중 관리하세요. 즉시 후속 조치를 취하는 것이 좋습니다.":a>=60?"높은 우선순위로 관리하세요. 정기적인 소통을 유지하며 기회를 모니터링하세요.":a>=40?"중간 우선순위로 관리하세요. 장기적인 관계 구축에 집중하세요.":"낮은 우선순위입니다. 기본적인 관계 유지 수준에서 관리하세요.",(0,i.ZO)("ai_lead_scoring","calculate"),{score:a,factors:n,recommendation:t}}async generateInsights(e){await new Promise(e=>setTimeout(e,2500));let t=[];return e.deals?.some(e=>"proposal"===e.stage)&&t.push({type:"opportunity",title:"제안 단계 거래 기회",description:"현재 제안 단계에 있는 거래가 있습니다. 적극적인 후속 조치로 성사 가능성을 높일 수 있습니다.",confidence:.85,actionItems:["제안서에 대한 피드백 요청","의사결정자와의 미팅 스케줄링","경쟁사 분석 및 차별화 포인트 강조"]}),e.lastContact&&new Date(e.lastContact)<new Date(Date.now()-5184e6)&&t.push({type:"risk",title:"장기간 미접촉 위험",description:"60일 이상 접촉이 없어 관계가 소원해질 위험이 있습니다.",confidence:.75,actionItems:["즉시 안부 인사 연락","최근 업계 동향 공유","새로운 서비스 소개 미팅 제안"]}),(e.industry?.includes("IT")||e.industry?.includes("기술"))&&t.push({type:"trend",title:"디지털 전환 트렌드",description:"IT 업계의 디지털 전환 가속화로 관련 솔루션 수요가 증가하고 있습니다.",confidence:.9,actionItems:["디지털 전환 관련 솔루션 제안","업계 트렌드 리포트 공유","성공 사례 및 ROI 데이터 제시"]}),t.push({type:"recommendation",title:"관계 강화 추천",description:"정기적인 소통과 가치 있는 콘텐츠 공유를 통해 장기적인 관계를 구축하세요.",confidence:.8,actionItems:["월간 뉴스레터 구독 제안","업계 세미나 초대","맞춤형 솔루션 데모 제공"]}),(0,i.ZO)("ai_insights","generate"),t}async generateEmailTemplate(e){await new Promise(e=>setTimeout(e,1e3));let{companyName:t,contactName:a,purpose:n,tone:s}=e,r="",o="formal"===s?"안녕하십니까":"안녕하세요",c="formal"===s?"감사합니다.":"casual"===s?"좋은 하루 되세요!":"감사합니다.";switch(n){case"introduction":r=`제목: ${t} 맞춤 솔루션 소개

${a}님, ${o}.

저는 [회사명]의 [이름]입니다. ${t}의 비즈니스 성장을 위한 맞춤형 솔루션을 소개드리고자 연락드렸습니다.

저희는 ${t}과 같은 기업들이 디지털 전환을 통해 효율성을 높이고 비용을 절감할 수 있도록 도와드리고 있습니다.

간단한 미팅을 통해 ${t}의 현재 상황과 목표를 파악하고, 어떻게 도움을 드릴 수 있는지 논의해보면 좋겠습니다.

편하신 시간에 15-20분 정도 통화나 미팅이 가능하실까요?

${c}

[이름]
[직책]
[연락처]`;break;case"follow-up":r=`제목: ${t} 미팅 후속 조치

${a}님, ${o}.

지난번 미팅에서 나눈 대화가 매우 유익했습니다. ${t}의 현재 과제와 목표에 대해 더 잘 이해할 수 있었습니다.

미팅에서 논의된 내용을 바탕으로 몇 가지 추가 자료를 준비했습니다:

• [관련 자료 1]
• [관련 자료 2]
• [참고 사례]

다음 단계에 대해 논의하기 위해 추가 미팅을 제안드립니다. 언제 시간이 되시는지 알려주시면 일정을 조율하겠습니다.

궁금한 점이 있으시면 언제든 연락주세요.

${c}

[이름]
[직책]
[연락처]`;break;case"proposal":r=`제목: ${t} 맞춤 제안서

${a}님, ${o}.

${t}의 요구사항을 바탕으로 맞춤형 제안서를 준비했습니다.

제안 내용 요약:
• 솔루션 개요: [간단한 설명]
• 예상 효과: [ROI 및 이익]
• 구현 일정: [타임라인]
• 투자 비용: [가격 정보]

상세한 제안서는 첨부파일로 보내드렸습니다. 검토 후 궁금한 점이나 추가 논의가 필요한 부분이 있으시면 언제든 연락주세요.

제안 내용에 대해 직접 설명드릴 수 있는 프레젠테이션 미팅도 가능합니다.

${c}

[이름]
[직책]
[연락처]`;break;case"meeting":r=`제목: ${t} 미팅 요청

${a}님, ${o}.

${t}의 비즈니스 성장을 위한 협력 방안을 논의하고자 미팅을 요청드립니다.

미팅 목적:
• 현재 과제 및 목표 파악
• 맞춤형 솔루션 제안
• 협력 가능성 탐색

소요 시간: 약 30-45분
장소: ${t} 사무실 또는 온라인 미팅

다음 주 중 편하신 시간이 있으시면 알려주세요:
• 월요일 오후 2-5시
• 화요일 오전 10-12시
• 수요일 오후 3-6시

미팅 전에 간단한 자료를 미리 보내드릴 수도 있습니다.

${c}

[이름]
[직책]
[연락처]`}return(0,i.ZO)("ai_email","generate"),r}async predictChurnRisk(e){let t;await new Promise(e=>setTimeout(e,1800));let a=0,n=[];if(e.lastContact){let t=Math.floor((Date.now()-new Date(e.lastContact).getTime())/864e5);t>90?(a+=40,n.push("90일 이상 미접촉")):t>60?(a+=25,n.push("60일 이상 미접촉")):t>30&&(a+=15,n.push("30일 이상 미접촉"))}0===(e.deals?.filter(e=>!["closed-won","closed-lost"].includes(e.stage))||[]).length&&(a+=30,n.push("진행 중인 거래 없음")),"inactive"===e.status&&(a+=35,n.push("비활성 상태")),0===(e.activities?.filter(e=>new Date(e.date)>new Date(Date.now()-30*24*60*60*1e3))||[]).length&&(a+=20,n.push("최근 활동 없음"));let s=Math.min(100,a)/100,r=["high"==(t=s>=.7?"high":s>=.4?"medium":"low")?"즉시 고객과 연락하여 현재 상황을 파악하세요":"정기적인 소통을 통해 관계를 유지하세요","고객의 비즈니스 변화와 새로운 니즈를 파악하세요","가치 있는 콘텐츠와 인사이트를 정기적으로 공유하세요","고객 만족도 조사를 실시하여 개선점을 찾으세요"];return(0,i.ZO)("ai_churn","predict"),{riskLevel:t,probability:s,factors:n,recommendations:r}}}let s=n.getInstance()},8339:(e,t,a)=>{a.d(t,{U3:()=>i,ZO:()=>n});let i=(e,t)=>{},n=(e,t)=>{}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),i=t.X(0,[379,833],()=>a(2355));module.exports=i})();