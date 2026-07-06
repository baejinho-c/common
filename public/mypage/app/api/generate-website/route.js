"use strict";(()=>{var e={};e.id=562,e.ids=[562],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},3823:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>f,patchFetch:()=>h,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>g,staticGenerationAsyncStorage:()=>y});var r={};o.r(r),o.d(r,{POST:()=>u});var n=o(3278),a=o(5002),i=o(4877),s=o(1309),l=o(1173),c=o(1584),d=o(2987);async function u(e){try{let{plan:t,sections:o,style:r,businessType:n,description:a,targetAudience:i,colors:u,fonts:p,brandDna:m}=await e.json(),y=process.env.OPEN_API_KEY||process.env.OPENAI_API_KEY;if(!y)return s.NextResponse.json({error:"OpenAI API key not configured"},{status:500});let g=(0,d.oy)({plan:t,sections:Array.isArray(o)?o:void 0,style:r,businessType:n,description:a,targetAudience:i,colors:u,fonts:p,brandDna:m}),{text:f}=await (0,l._4)({model:(0,c.fr)("gpt-4o",{apiKey:y}),system:d.Yf,prompt:g,temperature:.25,maxTokens:16e3});return s.NextResponse.json({html:(0,d.ZF)(f)})}catch(e){return console.error("Website generation error:",e),s.NextResponse.json({error:"Failed to generate website"},{status:500})}}let p=new n.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/generate-website/route",pathname:"/api/generate-website",filename:"route",bundlePath:"app/api/generate-website/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/mypage/app/api/generate-website/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:y,serverHooks:g}=p,f="/api/generate-website/route";function h(){return(0,i.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:y})}},2987:(e,t,o)=>{o.d(t,{Mz:()=>u,Yf:()=>r,ZF:()=>p,ob:()=>c,oy:()=>d});let r=`You are an elite product designer and front-end engineer who builds premium one-page brand websites.
You output a SINGLE, COMPLETE, self-contained HTML document and nothing else.

Hard requirements:
- Return ONLY raw HTML. No markdown, no code fences, no commentary before or after.
- The document MUST start with <!DOCTYPE html> and include <html lang="ko">, <head> and <body>.
- ALL CSS must be inline inside a single <style> tag in the <head>. No external stylesheets except Google Fonts <link> tags.
- Do NOT use Tailwind CDN, Bootstrap, or any CSS framework. Do NOT use JavaScript frameworks.
- Plain HTML + CSS only. Minimal vanilla JS is allowed only for a mobile menu toggle.
- Use Google Fonts via <link> for typography — pick fonts that match the brand mood.
- Use real, production-quality Korean copy relevant to the actual business. No "lorem ipsum", no placeholder English.
- Write ALL visible page copy in KOREAN (한국어): nav links, headlines, subheads, button labels, feature text, footer.
- For imagery, use solid color blocks, CSS gradients, decorative shapes, or simple inline SVG. Do NOT reference external image files or broken image URLs.
- The page must be fully responsive (mobile-first) and look polished on 1280px desktop and 390px phone.
- Build a complete landing page: sticky nav with logo wordmark + links + primary CTA, a strong hero with headline/subhead/CTA, value/features section, social proof or stats, contact/CTA section, and footer.
- Modern, confident, high craft: generous whitespace, clear type hierarchy, one disciplined accent color, accessible contrast (WCAG AA).
- Primary CTA must be obvious above the fold with compelling Korean copy.
- Use CSS custom properties (--color-primary, --color-accent, etc.) for a coherent design system.`,n={blue:"#2563eb",green:"#16a34a",red:"#dc2626",purple:"#7c3aed",orange:"#ea580c",gray:"#4b5563"},a={modern:{heading:"Montserrat",body:"Noto Sans KR"},classic:{heading:"Playfair Display",body:"Noto Serif KR"},minimal:{heading:"Inter",body:"Noto Sans KR"},friendly:{heading:"Baloo 2",body:"Noto Sans KR"}};function i(e=[]){return e.length?{primary:n[e[0]]||e[0],accent:n[e[1]]||n[e[0]]||"#6366f1",neutral:"#1f2937"}:{primary:"#2563eb",accent:"#6366f1",neutral:"#1f2937"}}function s(e=[]){return a[Array.isArray(e)?e[0]:e]||a.modern}function l(e){let t=i(e.colors),o=s(e.fonts);return[e.description?`비즈니스: ${e.description}`:"",e.businessType?`업종/유형: ${e.businessType}`:"",e.targetAudience?`타겟 고객: ${e.targetAudience}`:"",e.style?`원하는 무드: ${e.style}`:"",`브랜드 컬러 — Primary: ${t.primary}, Accent: ${t.accent}`,`타이포 — 제목: ${o.heading}, 본문: ${o.body}`,"브랜드 경험 목표: 모던\xb7프리미엄\xb7신뢰감 있는 원페이지. 경쟁사와 차별화되는 명확한 가치 제안과 강한 CTA."].filter(Boolean).join("\n")}function c(e){let t=e.colors||e.features,o=i(t),r=s(e.fonts||e.style),n=l({...e,colors:t});return`당신은 시니어 브랜드 디렉터이자 프로덕트 디자이너입니다.
아래 브리프를 바탕으로, 실제 디자이너\xb7개발자가 바로 실행할 수 있는 **프리미엄 원페이지 브랜드 기획서**를 작성하세요.
일반적이거나 뻔한 조언은 금지합니다. 구체적이고 실행 가능한 내용만 작성하세요.

=== 브랜드 DNA ===
${n}

=== 프로젝트 정보 ===
• 비즈니스 설명: ${e.description}
• 비즈니스 유형: ${e.businessType||"general"}
• 타겟 고객: ${e.targetAudience||"일반 사용자"}
• 원하는 스타일: ${e.style||"modern"}
• 선호 컬러: ${Array.isArray(t)?t.join(", "):"blue"}
• 선호 폰트 무드: ${Array.isArray(e.fonts)?e.fonts.join(", "):e.fonts||"modern"}

다음 형식으로 **한국어**로 작성하세요:

## 1. 브랜드 포지셔닝
## 2. 타겟 & 전환 전략
## 3. 디자인 시스템 (hex 코드 포함 — Primary: ${o.primary}, Accent: ${o.accent}, 폰트: ${r.heading}/${r.body})
## 4. 섹션별 상세 기획 (Nav, Hero, Value, Social Proof, Contact, Footer)
## 5. 카피라이팅 가이드
## 6. SEO & 메타
## 7. 품질 체크리스트 (Top 3 우선 개선 과제)`}function d(e){let t=i(e.colors),o=s(e.fonts),r=e.sections?.length?e.sections.map(e=>`• ${e.title}: ${e.content}`).join("\n"):"(기획서의 섹션별 카피를 그대로 반영)",n=e.brandDna||l({description:e.description,businessType:e.businessType,targetAudience:e.targetAudience,style:e.style,colors:e.colors,fonts:e.fonts});return`Design and build a premium one-page brand website from this creative brief.

=== BUSINESS BRIEF ===
${e.description||"(기획서 참조)"}
Business type: ${e.businessType||"general"}
Target audience: ${e.targetAudience||"일반 사용자"}
Style mood: ${e.style||"modern"}

=== BRAND DNA (follow strictly) ===
${n}

=== DESIGN TOKENS ===
--color-primary: ${t.primary}
--color-accent: ${t.accent}
--color-neutral: ${t.neutral}
Heading font: ${o.heading}
Body font: ${o.body}

=== DETAILED PLAN ===
${e.plan}

=== SECTION COPY HINTS ===
${r}

Elevate to reference-quality brand experience: strong hero, disciplined accent color, generous whitespace, Korean CTAs, social proof, polished mobile layout.
Output the complete HTML document now.`}function u(e){return`당신은 시니어 브랜드 카피라이터입니다.

섹션 제목: ${e.title||"(없음)"}
비즈니스 유형: ${e.businessType||"general"}

현재 콘텐츠:
${e.content}

개선 요청:
${e.instruction}

개선된 본문 텍스트만 반환 (마크다운\xb7설명 없음)`}function p(e){let t=String(e||"").trim(),o=t.match(/```(?:html)?\s*([\s\S]*?)```/i);o&&(t=o[1].trim());let r=t.toLowerCase().indexOf("<!doctype");r>0&&(t=t.slice(r));let n=t.toLowerCase().lastIndexOf("</html>");return -1!==n&&(t=t.slice(0,n+7)),t}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[379,698],()=>o(3823));module.exports=r})();