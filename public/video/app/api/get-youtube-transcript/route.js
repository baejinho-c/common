(()=>{var e={};e.id=733,e.ids=[733],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1740:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>l,serverHooks:()=>g,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>x});var s={};r.r(s),r.d(s,{POST:()=>c});var o=r(6559),n=r(8088),a=r(7719),u=r(2190);async function i(e){try{let t=await fetch(`https://www.youtube.com/api/timedtext?lang=ko&v=${e}`);if(!t.ok){let t=await fetch(`https://www.youtube.com/api/timedtext?lang=en&v=${e}`);if(!t.ok)throw Error("No subtitles available");let r=await t.text();return p(r)}let r=await t.text();return p(r)}catch(t){return console.error("Transcript fetch error:",t),function(e){let t=[`안녕하세요! 오늘은 최신 스마트폰 리뷰를 해보겠습니다. 
    삼성 갤럭시 S24 울트라는 정말 놀라운 성능을 보여줍니다. 200MP 카메라와 S펜 지원으로 
    생산성이 크게 향상되었어요. 현재 온라인에서 약 140만원 정도에 구매할 수 있습니다.
    
    아이폰 15 프로 맥스도 함께 비교해보겠습니다. A17 프로 칩셋의 성능이 정말 인상적이고,
    티타늄 소재로 만들어져서 가볍고 튼튼합니다. 가격은 약 155만원 정도네요.
    
    그리고 무선충전기도 하나 추천드릴게요. 애플 맥세이프 충전기는 15W 고속 무선충전을 지원하고
    아이폰과 완벽하게 호환됩니다. 약 7만원 정도에 구매할 수 있어요.`,`오늘은 뷰티 제품 리뷰를 가져왔습니다!
    먼저 디올 립스틱을 소개해드릴게요. 색상이 정말 예쁘고 발색도 좋습니다.
    백화점에서 약 5만원 정도에 판매하고 있어요.
    
    그리고 샤넬 향수도 함께 사용해보았는데요, 향이 정말 고급스럽고 지속력도 좋습니다.
    온라인에서 약 15만원 정도에 구매할 수 있습니다.
    
    마지막으로 에스티로더 파운데이션도 추천드려요. 커버력이 좋고 자연스러운 마무리감이 특징입니다.
    약 6만원 정도의 가격대입니다.`,`IT 제품 언박싱 영상입니다!
    애플 맥북 프로 M3를 개봉해보겠습니다. 성능이 정말 놀랍고 배터리 수명도 길어졌어요.
    현재 애플 스토어에서 약 250만원에 판매중입니다.
    
    그리고 로지텍 MX 마스터 3S 마우스도 함께 사용해보았는데,
    정밀도가 높고 여러 기기 간 연결이 편리합니다. 약 12만원 정도에 구매할 수 있어요.
    
    키보드는 애플 매직 키보드를 사용하고 있는데, 타이핑감이 정말 좋습니다.
    약 15만원 정도의 가격입니다.`],r=e.charCodeAt(0)%t.length;return t[r]}(e)}}function p(e){let t=e.match(/<text[^>]*>(.*?)<\/text>/g);return t?t.map(e=>e.replace(/<[^>]*>/g,"").trim().replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")).filter(e=>e.length>0).join(" "):""}async function c(e){try{let{youtubeUrl:t}=await e.json();if(!t)return u.NextResponse.json({error:"YouTube URL is required"},{status:400});let r=function(e){let t=e.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);return t?t[1]:null}(t);if(!r)return u.NextResponse.json({error:"Invalid YouTube URL"},{status:400});let s=await i(r);return u.NextResponse.json({success:!0,transcript:s,videoId:r})}catch(e){return console.error("Transcript API error:",e),u.NextResponse.json({error:"Failed to get transcript"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/get-youtube-transcript/route",pathname:"/api/get-youtube-transcript",filename:"route",bundlePath:"app/api/get-youtube-transcript/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/video/app/api/get-youtube-transcript/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:d,workUnitAsyncStorage:x,serverHooks:g}=l;function h(){return(0,a.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:x})}},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580],()=>r(1740));module.exports=s})();