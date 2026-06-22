(()=>{var e={};e.id=912,e.ids=[912],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1820:e=>{"use strict";e.exports=require("os")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5657:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>w,routeModule:()=>v,serverHooks:()=>y,workAsyncStorage:()=>h,workUnitAsyncStorage:()=>f});var n={};r.r(n),r.d(n,{POST:()=>g});var s=r(6559),a=r(8088),o=r(7719),i=r(2190),c=r(9239),l=r(1248);let p={corporate:{style:"formal and structured",characteristics:"professional, methodical, focuses on company culture fit and standard procedures",greeting:"formal business greeting with company introduction"},startup:{style:"direct and practical",characteristics:"results-oriented, informal but focused, emphasizes problem-solving and adaptability",greeting:"casual but professional, emphasizes innovation and growth"},"team-lead":{style:"collaborative and supportive",characteristics:"team-focused, emphasizes collaboration and mentoring, asks about teamwork and leadership potential",greeting:"warm and encouraging, focuses on team dynamics"}},u={developer:"software development, programming languages, technical problem-solving, system design, coding best practices",designer:"UI/UX design, design thinking, user research, design tools, visual communication, user experience",marketing:"digital marketing, campaign management, analytics, brand strategy, customer acquisition, market research",pm:"product management, roadmap planning, stakeholder management, user requirements, project coordination",sales:"sales processes, customer relationship management, negotiation, target achievement, business development",general:"general business operations, administrative skills, organizational abilities, communication, teamwork"},d={basic:"entry-level to 2 years experience, fundamental concepts, basic scenarios",intermediate:"3-5 years experience, practical application, real-world problem solving",advanced:"5+ years experience, strategic thinking, leadership scenarios, complex problem solving"},m=()=>{let e=process.env.OPEN_AI_KEY||process.env.OPENAI_API_KEY||process.env.OPEN_API_KEY;if(!e)throw console.error("[v0] No OpenAI API key found in environment variables"),console.error("[v0] Checked: OPEN_AI_KEY, OPENAI_API_KEY, OPEN_API_KEY"),Error("OpenAI API key is missing. Please set OPEN_AI_KEY environment variable.");return console.log("[v0] OpenAI API key found, length:",e.length),(0,l.ry)({apiKey:e})};async function g(e){try{let t=m(),{jobCategory:r,difficulty:n,persona:s,questionNumber:a,previousMessages:o,userResponse:l}=await e.json();console.log("[v0] Received persona:",s),console.log("[v0] Available personas:",Object.keys(p));let g=p[s]||p.corporate;if(console.log("[v0] Selected personaInfo:",g),console.log("[v0] PersonaInfo type:",typeof g),console.log("[v0] PersonaInfo characteristics:",g?.characteristics),!g||"object"!=typeof g||!g.characteristics){console.error("[v0] Invalid personaInfo structure:",g);let e={style:"formal and structured",characteristics:"professional, methodical, focuses on company culture fit and standard procedures"};console.log("[v0] Using hardcoded fallback persona");let s=u[r]||u.general,p=d[n]||d.basic,m=o.map(e=>`${"interviewer"===e.type?"Interviewer":"Candidate"}: ${e.content}`).join("\n"),v="";if(1===a)v=`You are an AI interviewer conducting a mock interview. Your persona is: ${e.characteristics}.

Job Category: ${r} (${s})
Difficulty Level: ${n} (${p})
Interview Style: ${e.style}

This is the start of a 30-minute mock interview. Provide a professional greeting and ask for a self-introduction. Keep it natural and match your persona style. Respond in Korean.

Make the greeting warm but professional, and ask the candidate to introduce themselves briefly.`;else{let t=["behavioral (STAR method encouraged)","technical/professional knowledge","situational problem-solving","strengths and weaknesses","motivation and goals","company fit and culture","pressure/challenging scenario"],o=t[Math.min(a-2,t.length-1)];v=`You are an AI interviewer with this persona: ${e.characteristics}.

Job Category: ${r} (${s})
Difficulty Level: ${n} (${p})
Interview Style: ${e.style}
Question Number: ${a}/10
Question Type Focus: ${o}

Previous conversation:
${m}

Latest candidate response: "${l}"

Based on the candidate's response, provide:
1. A brief acknowledgment of their answer (1-2 sentences)
2. A follow-up question that focuses on "${o}"

Guidelines:
- Keep the ${e.style} interview style
- Make questions relevant to ${r} role
- Adjust complexity for ${p} level
- If this is question 7-10, make it more challenging/pressure-oriented
- Encourage specific examples and STAR method when appropriate
- Respond in Korean
- Keep total response under 150 words`}let{text:h}=await (0,c.Df)({model:t("gpt-4o"),prompt:v,temperature:.7,maxTokens:300});return i.NextResponse.json({question:h.trim()})}let v=u[r]||u.general,h=d[n]||d.basic,f=o.map(e=>`${"interviewer"===e.type?"Interviewer":"Candidate"}: ${e.content}`).join("\n"),y="";if(1===a)y=`You are an AI interviewer conducting a mock interview. Your persona is: ${g.characteristics}.

Job Category: ${r} (${v})
Difficulty Level: ${n} (${h})
Interview Style: ${g.style}

This is the start of a 30-minute mock interview. Provide a professional greeting and ask for a self-introduction. Keep it natural and match your persona style. Respond in Korean.

Make the greeting warm but professional, and ask the candidate to introduce themselves briefly.`;else{let e=["behavioral (STAR method encouraged)","technical/professional knowledge","situational problem-solving","strengths and weaknesses","motivation and goals","company fit and culture","pressure/challenging scenario"],t=e[Math.min(a-2,e.length-1)];y=`You are an AI interviewer with this persona: ${g.characteristics}.

Job Category: ${r} (${v})
Difficulty Level: ${n} (${h})
Interview Style: ${g.style}
Question Number: ${a}/10
Question Type Focus: ${t}

Previous conversation:
${f}

Latest candidate response: "${l}"

Based on the candidate's response, provide:
1. A brief acknowledgment of their answer (1-2 sentences)
2. A follow-up question that focuses on "${t}"

Guidelines:
- Keep the ${g.style} interview style
- Make questions relevant to ${r} role
- Adjust complexity for ${h} level
- If this is question 7-10, make it more challenging/pressure-oriented
- Encourage specific examples and STAR method when appropriate
- Respond in Korean
- Keep total response under 150 words`}let{text:w}=await (0,c.Df)({model:t("gpt-4o"),prompt:y,temperature:.7,maxTokens:300});return i.NextResponse.json({question:w.trim()})}catch(t){return console.error("Error generating question:",t),console.error("[v0] Full error details:",{message:t instanceof Error?t.message:"Unknown error",stack:t instanceof Error?t.stack:"No stack trace"}),console.error("[v0] Request body:",await e.clone().json().catch(()=>"Failed to parse")),i.NextResponse.json({error:"Failed to generate question"},{status:500})}}let v=new s.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/interview/generate-question/route",pathname:"/api/interview/generate-question",filename:"route",bundlePath:"app/api/interview/generate-question/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/vtest/app/api/interview/generate-question/route.ts",nextConfigOutput:"",userland:n}),{workAsyncStorage:h,workUnitAsyncStorage:f,serverHooks:y}=v;function w(){return(0,o.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:f})}},6487:()=>{},8335:()=>{},9021:e=>{"use strict";e.exports=require("fs")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[447,580,866],()=>r(5657));module.exports=n})();