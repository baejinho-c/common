(()=>{var e={};e.id=309,e.ids=[309],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},6934:(e,t,r)=>{"use strict";r.d(t,{dQ:()=>c,kj:()=>l});var s=r(37449);let n=process.env.GOOGLE_GENERATIVE_AI_API_KEY,a=null;n&&(a=new s.ij(n));let i=process.env.OPENAI_API_KEY,o={modernBrush:"현대적인 모던 붓글씨 스타일. 약간 두꺼운 붓글씨, 자연스러운 획 굵기 변화, 먹을 듬뿍 머금은 진한 검정, 읽기 쉬운 한글, 모던하고 세련된 느낌, 상업 로고 수준의 완성도, 흰 배경, 텍스트만 표현.",powerfulBrush:"강렬한 붓글씨 스타일. 매우 힘 있는 붓 터치, 두꺼운 획, 강한 먹의 질감, 빠른 붓의 속도감, 강한 존재감, 한국 현대 캘리그래피.",flowingCalligraphy:"자연스럽게 흘려 쓰는 흘림체 캘리그래피. 연결감 있는 획, 자유로운 리듬, 부드러운 곡선, 감성적인 느낌, 약간 기울어진 글씨.",ultraThinPen:"아주 얇은 펜글씨 스타일. 0.3mm 펜 느낌, 일정한 얇은 선, 자연스러운 손글씨, 감성적인 필기체, 미니멀 디자인, 여백이 아름다운 구성.",ballpointNote:"볼펜 손글씨 스타일. 실제 검정 볼펜 0.5mm 느낌, 자연스러운 손떨림, 학생 노트 필기 느낌, 깔끔한 손글씨.",fountainPen:"만년필 캘리그래피 스타일. 잉크 농담 표현, 얇고 우아한 획, 고급스러운 분위기, 차분한 감성.",logoOnly:"로고 전용 캘리그래피 스타일. 균형 잡힌 구조, 벡터 느낌, 매우 선명한 획, 상업 로고 수준, 심플함, 장식 없음.",warmEmotional:"따뜻한 감성 캘리그래피 스타일. 부드러운 곡선, 온기가 느껴지는 획, 편안한 분위기, 손편지 느낌, 자연스러운 리듬.",churchVerse:"교회 말씀 캘리그래피 스타일. 경건한 분위기, 차분한 붓글씨, 절제된 표현, 우아한 곡선, 여백의 미, 한국 현대 캘리그래피.",premiumMaster:"프리미엄 작가 스타일. 전시회 출품 수준, 붓의 생동감, 먹의 깊이, 자연스러운 속도감, 아름다운 획의 굵기 변화, 완벽한 자간과 여백, 현대적 미니멀 디자인, 로고 및 작품 사용 가능 수준, 초고해상도."};async function c(e,t,r,s){let n=function(e,t,r,s){let n=s?o[s]:null;return`당신은 한국 현대 캘리그래피 디렉터이며, 실제 사람이 아닌 AI 작가입니다.
입력 문구를 기준으로 "미니멀하고 세련된 모던 캘리그래피" 방향의 스타일을 추천하세요.

[입력]
- 텍스트: "${e}"
- 분위기: ${t||"감성적이고 따뜻함"}
- 용도: ${r||"상업 로고 및 개인 문구"}
- 샘플 기반 프리셋: ${n||"modernBrush (기본)"}

[핵심 스타일 가이드]
- 붓의 속도감이 느껴지는 자연스러운 획
- 굵기 변화가 아름다운 브러시 스트로크
- 과장되지 않은 우아한 곡선
- 읽기 쉬운 한글
- 균형 잡힌 자간과 여백
- 감성적이고 따뜻한 분위기
- 상업 로고에도 활용 가능한 완성도
- 과도한 장식 금지
- 일본풍/중국 서예 느낌 제외
- 한국 현대 캘리그래피 스타일 유지
- 먹 번짐 최소화, 선명한 검정 먹
- 벡터 느낌의 깔끔한 마감
- 흰 배경, 텍스트만 중앙 배치

[금지 요소]
- 꽃, 하트, 패턴, 프레임, 배경효과, 그림자, 그라디언트
- 낙관, 도장, 붉은 인주, 컬러 잉크

아래 JSON만 출력하세요(설명문 금지):
{
  "creatorLabel": "AI 작가",
  "styles": [
    {
      "id": "modern_balanced",
      "name": "스타일명",
      "description": "설명",
      "mood": "분위기",
      "difficulty": "easy|medium|hard",
      "price_range": "가격대",
      "sample_text": "${e}"
    }
  ],
  "promptPack": {
    "mainPrompt": "이미지 생성 모델용 메인 프롬프트 1개",
    "negativePrompt": "네거티브 프롬프트 1개"
  }
}

styles는 정확히 3개를 반환하세요.`}(e,t,r,s);if(a)try{let e=a.getGenerativeModel({model:"gemini-1.5-flash"}),t=(await e.generateContent(n)).response.text();return{success:!0,content:t,provider:"gemini",cost:0}}catch(e){console.error("Gemini API 오류:",e)}if(i)try{let e=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"system",content:"당신은 한국 현대 캘리그래피 디렉터입니다. 반드시 JSON만 출력하고 지정된 스키마를 준수하세요."},{role:"user",content:n}],max_tokens:900,temperature:.35})});if(!e.ok)throw Error(`OpenAI API 오류: ${e.status}`);let t=await e.json(),r=t.choices[0]?.message?.content||"응답을 생성할 수 없습니다.",s=n.length/4,a=r.length/4;return{success:!0,content:r,provider:"openai",cost:(.0015*s+.002*a)/1e3}}catch(e){console.error("OpenAI API 오류:",e)}let c={mainPrompt:`텍스트 "${e}"를 한국 현대 모던 캘리그래피 스타일로 표현. 미니멀하고 세련된 분위기, 자연스러운 붓의 속도감, 아름다운 굵기 변화, 읽기 쉬운 한글, 균형 잡힌 자간과 여백, 상업 로고 활용 가능한 완성도, 선명한 검정 먹, 먹 번짐 최소화, 벡터 느낌의 깔끔한 마감, 순백 배경, 텍스트만 중앙 배치, 초고해상도`,negativePrompt:"꽃, 하트, 패턴, 배경효과, 그림자, 그라디언트, 프레임, 일본풍 서체, 중국 서예풍, 과도한 번짐, 컬러 잉크, 낙관, 도장, 워터마크, 텍스트 외 장식 요소"};return{success:!0,content:JSON.stringify({creatorLabel:"AI 작가",styles:[{id:"modern_balanced",style:"모던 캘리그라피",reason:"깔끔하고 현대적인 느낌으로 다양한 용도에 적합합니다",features:"간결한 선, 균형잡힌 구조, 읽기 쉬운 형태",artist:"현대적 감각의 브랜딩 전문 작가",mood:"감성적이고 따뜻함",difficulty:"easy",priceRange:"20,000원~50,000원"},{id:"elegant_curve",style:"전통 서예",reason:"과장 없는 우아한 곡선으로 고급스러운 인상을 줍니다",features:"절제된 곡선, 안정적 자간, 깔끔한 마감",artist:"균형감이 뛰어난 실무형 작가",mood:"단정하고 세련됨",difficulty:"medium",priceRange:"30,000원~70,000원"},{id:"brush_speed",style:"캐주얼 손글씨",reason:"붓의 속도감이 살아 있어 생동감 있는 표현에 적합합니다",features:"강약 대비, 리듬감 있는 획, 높은 가독성",artist:"브러시 컨트롤이 좋은 작가",mood:"활기차고 따뜻함",difficulty:"hard",priceRange:"40,000원~90,000원"}].map(t=>({id:t.id,name:t.style,description:`${t.reason} ${t.features}`,mood:t.mood,difficulty:t.difficulty,price_range:t.priceRange,sample_text:e})),promptPack:c},null,2),provider:"fallback",cost:0}}async function l(e,t){let r=await c(e,t,"문의");return{summary:r.content.slice(0,200),sentiment:"중립",suggestedReply:r.content}}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},56602:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>f,routeModule:()=>p,serverHooks:()=>y,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>m});var s={};r.r(s),r.d(s,{GET:()=>u,POST:()=>l});var n=r(96559),a=r(48088),i=r(37719),o=r(32190),c=r(6934);async function l(e){try{let{text:t,mood:r,purpose:s,stylePreset:n}=await e.json();if(!t||"string"!=typeof t)return o.NextResponse.json({error:"텍스트가 필요합니다."},{status:400});if(t.length>500)return o.NextResponse.json({error:"텍스트는 500자 이하여야 합니다."},{status:400});let a=await (0,c.dQ)(t,r,s,n),i=function(e){let t=e.trim(),r=e=>{try{return JSON.parse(e)}catch{return null}},s=r(t);if(s?.styles?.length)return s;let n=t.toLowerCase().indexOf("```json");if(-1===n)return null;let a=t.indexOf("\n",n);if(-1===a)return null;let i=t.indexOf("```",a+1);if(-1===i)return null;let o=r(t.slice(a+1,i).trim());return o?.styles?.length?o:null}(a.content)||{creatorLabel:"AI 작가",styles:[{id:"modern_balanced",name:"모던 캘리그라피",description:"미니멀하고 세련된 인상, 읽기 쉬운 한글 구조를 중심으로 한 안정형 스타일",mood:"감성적이고 따뜻함",difficulty:"easy",price_range:"20,000원~50,000원",sample_text:t},{id:"elegant_curve",name:"우아한 곡선형",description:"과장 없이 부드러운 곡선을 살리고 균형 잡힌 자간으로 완성도를 높인 스타일",mood:"단정하고 세련됨",difficulty:"medium",price_range:"30,000원~70,000원",sample_text:t},{id:"brush_speed",name:"브러시 속도감형",description:"붓의 리듬감과 강약 대비를 살리되 과한 장식 없이 마감한 스타일",mood:"생동감 있고 따뜻함",difficulty:"hard",price_range:"40,000원~90,000원",sample_text:t}],promptPack:{mainPrompt:`텍스트 "${t}"를 한국 현대 모던 캘리그래피 스타일로 표현. 미니멀하고 세련된 분위기, 자연스러운 붓의 속도감, 아름다운 굵기 변화, 읽기 쉬운 한글, 균형 잡힌 자간과 여백, 상업 로고 활용 가능한 완성도, 선명한 검정 먹, 먹 번짐 최소화, 벡터 느낌의 깔끔한 마감, 흰 배경, 텍스트만 중앙 배치, 초고해상도`,negativePrompt:"꽃, 하트, 패턴, 배경효과, 그림자, 그라디언트, 프레임, 일본풍 서체, 중국 서예풍, 과도한 번짐, 컬러 잉크, 낙관, 도장, 워터마크, 텍스트 외 장식 요소"}},l={success:a.success,recommendation:a.content,creatorLabel:i.creatorLabel||"AI 작가",styles:i.styles,promptPack:i.promptPack,metadata:{provider:a.provider,cost:a.cost,timestamp:new Date().toISOString(),textLength:t.length,mood:r||null,purpose:s||null,stylePreset:n||"modernBrush"}};return a.success||(l.metadata.error=a.error),o.NextResponse.json(l)}catch(e){return console.error("캘리그라피 스타일 추천 오류:",e),o.NextResponse.json({success:!1,error:"서버 오류가 발생했습니다.",recommendation:"현재 AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.",metadata:{provider:"error",cost:0,timestamp:new Date().toISOString()}},{status:500})}}async function u(){let e=[{id:"modern",name:"모던 캘리그라피",description:"깔끔하고 현대적인 스타일",characteristics:["간결한 선","균형잡힌 구조","읽기 쉬운 형태"],suitableFor:["비즈니스","웨딩","브랜딩"]},{id:"traditional",name:"전통 서예",description:"격식있고 품격있는 전통 스타일",characteristics:["붓의 강약 조절","전통적 미감","깊이있는 표현"],suitableFor:["축하","기념품","공식 문서"]},{id:"casual",name:"캐주얼 손글씨",description:"친근하고 개성있는 스타일",characteristics:["자유로운 형태","개성적 표현","따뜻한 느낌"],suitableFor:["개인 선물","카드","일상 용품"]},{id:"elegant",name:"우아한 스크립트",description:"세련되고 우아한 곡선미",characteristics:["흐르는 듯한 선","우아한 곡선","세련된 마무리"],suitableFor:["웨딩","초대장","고급 브랜딩"]},{id:"bold",name:"볼드 스타일",description:"강렬하고 임팩트 있는 스타일",characteristics:["굵은 선","강한 대비","임팩트 있는 형태"],suitableFor:["포스터","로고","광고"]}];return o.NextResponse.json({success:!0,styles:e,total:e.length,timestamp:new Date().toISOString()})}let p=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/calligraphy-styles/route",pathname:"/api/calligraphy-styles",filename:"route",bundlePath:"app/api/calligraphy-styles/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/calli/app/api/calligraphy-styles/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:d,workUnitAsyncStorage:m,serverHooks:y}=p;function f(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:m})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580,449],()=>r(56602));module.exports=s})();