"use strict";(()=>{var e={};e.id=358,e.ids=[358],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},59230:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>h,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l});var n={};r.r(n),r.d(n,{POST:()=>p});var o=r(73278),a=r(45002),s=r(54877),i=r(71309);async function p(e){try{let{topic:t,categoryName:r,personaName:n,ageGroup:o}=await e.json(),a=process.env.OPENAI_API_KEY;if(!a)throw Error("OPENAI_API_KEY가 설정되지 않았습니다");let s={"예비맘 지은":"임신 중인 초보 엄마로, 출산과 육아 준비에 대한 설렘과 걱정이 공존합니다. 임신 경험과 출산 준비 과정을 공유합니다.","신생아맘 수진":"생후 0-3개월 아기를 키우는 새내기 엄마로, 밤낮없는 육아에 지쳐있지만 아기의 작은 변화에 감동합니다. 수면 부족과 모유수유 고민이 많습니다.","영아맘 민지":"생후 4-12개월 아기를 키우는 엄마로, 이유식과 발달 단계에 관심이 많습니다. 아기의 첫 경험들을 함께하며 성장을 기록합니다.","유아맘 서연":"1-3세 아이를 키우는 엄마로, 아이의 자아가 생기면서 육아의 어려움과 재미를 동시에 느낍니다. 놀이와 훈육 사이에서 고민합니다.","유치원맘 혜진":"4-7세 유치원생을 둔 엄마로, 아이의 사회생활과 학습 준비에 관심이 많습니다. 친구 관계와 유치원 생활 적응을 도와줍니다.","초등맘 은영":"초등 저학년 자녀를 둔 엄마로, 학교 생활 적응과 학습 습관 형성에 신경 씁니다. 숙제 지도와 방과후 활동 선택에 고민이 많습니다.","초등맘 정아":"초등 고학년 자녀를 둔 엄마로, 아이의 독립성과 학업 관리 사이에서 균형을 찾습니다. 사춘기 초입의 아이와 소통하려 노력합니다.","중고등맘 미경":"청소년 자녀를 둔 엄마로, 진로와 입시, 사춘기 자녀와의 관계에 대한 고민이 깊습니다. 아이를 믿고 기다리는 법을 배워갑니다."}[n]||`${o} 자녀를 둔 엄마로, 육아 경험을 진솔하게 공유합니다.`,p=`당신은 "${n}"입니다. ${s}

주제: "${t}"
카테고리: ${r}

위 주제에 대한 실제 육아 경험담을 작성해주세요.

작성 가이드:
1. 제목: 공감 가는 제목 (15-25자, 이모티콘 사용 가능)
2. 본문 (400-600자):
   - 첫 문단: 상황 소개 (언제, 어떤 상황이었는지)
   - 중간 문단: 구체적인 경험과 감정 (어려웠던 점, 놀라웠던 점)
   - 마지막 문단: 해결 방법이나 깨달음, 다른 엄마들에게 전하고 싶은 말

말투:
- 친근하고 자연스러운 구어체 사용
- 적절한 이모티콘 사용 (😊, 😅, 💕 등)
- "~해요", "~더라고요", "~네요" 같은 부드러운 종결어미
- 너무 격식적이지 않게, 친구에게 이야기하듯

중요: 제목과 본문만 작성하고, "제목:", "본문:" 같은 라벨은 붙이지 마세요.`,c=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:"당신은 다양한 연령대의 자녀를 둔 엄마로서, 실제 육아 경험을 진솔하고 공감 가게 공유하는 사람입니다. 각 페르소나의 특성과 상황에 맞는 자연스러운 글을 작성합니다."},{role:"user",content:p}],temperature:.9,max_tokens:1200})});if(!c.ok)throw Error("OpenAI API 호출 실패");let u=(await c.json()).choices[0].message.content.trim().split("\n").filter(e=>e.trim()),l="",m="";return u.length>0&&(l=u[0].replace(/^제목:\s*/,"").replace(/^#\s*/,"").replace(/^\*\*/,"").replace(/\*\*$/,"").trim(),m=u.slice(1).join("\n\n").trim()),l.length>50&&(l=l.substring(0,47)+"..."),i.NextResponse.json({title:l,content:m})}catch(e){return console.error("[v0] 콘텐츠 생성 오류:",e),i.NextResponse.json({error:"콘텐츠 생성 실패"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/generate-content/route",pathname:"/api/generate-content",filename:"route",bundlePath:"app/api/generate-content/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/growup/app/api/generate-content/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:u,staticGenerationAsyncStorage:l,serverHooks:m}=c,d="/api/generate-content/route";function h(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[379,833],()=>r(59230));module.exports=n})();