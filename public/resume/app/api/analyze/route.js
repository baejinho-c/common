(()=>{var e={};e.id=786,e.ids=[786],e.modules={291:(e,s,t)=>{"use strict";t.r(s),t.d(s,{patchFetch:()=>k,routeModule:()=>y,serverHooks:()=>g,workAsyncStorage:()=>A,workUnitAsyncStorage:()=>h});var r={};t.r(r),t.d(r,{POST:()=>m});var o=t(6559),n=t(8088),a=t(7719),i=t(2190),l=t(7449);let c={primaryModel:process.env.PRIMARY_AI_MODEL||"gemini",geminiModel:process.env.GEMINI_MODEL||"gemini-pro",maxTokens:Number.parseInt(process.env.AI_MAX_TOKENS||"2500"),temperature:Number.parseFloat(process.env.AI_TEMPERATURE||"0.7")};async function d(e){let s=process.env.GEMINI_API_KEY;if(!s)throw Error("GEMINI_API_KEY is not configured");let t=new l.ij(s).getGenerativeModel({model:c.geminiModel});try{let s=await t.generateContent(e),r=await s.response;return{text:r.text(),model:c.geminiModel,tokensUsed:r.candidates?.[0]?.tokenCount||0,cost:0}}catch(e){throw Error(`Gemini API Error: ${e.message}`)}}async function u(e){let s=process.env.OPENAI_API_KEY;if(!s)throw Error("OPENAI_API_KEY is not configured");try{let t=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"user",content:e}],max_tokens:c.maxTokens,temperature:c.temperature})});if(!t.ok)throw Error(`OpenAI API Error: ${t.status} ${t.statusText}`);let r=await t.json(),o=r.choices[0]?.message?.content||"",n=r.usage,a=.0015*(n?.prompt_tokens||0)/1e3,i=.002*(n?.completion_tokens||0)/1e3;return{text:o,model:"gpt-3.5-turbo",tokensUsed:n?.total_tokens||0,cost:a+i}}catch(e){throw Error(`OpenAI API Error: ${e.message}`)}}async function p(e){let s=null;try{return{...await d(e),usedModel:"gemini-primary"}}catch(e){console.warn("Gemini model failed:",s=e.message)}try{return{...await u(e),usedModel:"openai-fallback"}}catch(e){console.error("OpenAI fallback failed:",e.message)}throw Error(`All AI models failed. Primary: ${s}`)}async function m(e){try{let{resumeText:s,jobCategory:t}=await e.json();if(!s||!t)return i.NextResponse.json({success:!1,error:"이력서 내용과 직무를 모두 입력해주세요."},{status:400});let r={developer:{analysis:`소프트웨어 개발자 채용 시장 분석:
- 현재 개발자 채용 트렌드: AI/ML, 클라우드, DevOps 경험 중시
- 기술 스택 다양성보다 깊이 있는 전문성 선호
- 오픈소스 기여, GitHub 활동, 기술 블로그 등 개발 열정 증명 필요
- 문제 해결 과정과 비즈니스 임팩트 중심의 프로젝트 설명 중요`,keywords:"React, Node.js, Python, AWS, Docker, Kubernetes, CI/CD, TDD, 애자일, 스크럼, API 설계, 데이터베이스 최적화, 성능 개선, 코드 리뷰",focus:"기술적 깊이, 문제 해결 능력, 팀워크, 지속적 학습 의지"},designer:{analysis:`디자이너 채용 시장 분석:
- UX/UI 통합 역량과 사용자 중심 사고 필수
- 디자인 시스템 구축 및 브랜드 일관성 유지 능력 중시
- 데이터 기반 디자인 의사결정과 A/B 테스트 경험 선호
- 개발팀과의 협업 능력과 디자인 툴 숙련도 중요`,keywords:"Figma, Sketch, Adobe Creative Suite, 프로토타이핑, 와이어프레임, 사용자 리서치, 디자인 시스템, 브랜딩, 반응형 디자인, 접근성",focus:"사용자 경험 개선 사례, 비즈니스 임팩트, 협업 능력, 트렌드 적응력"},marketer:{analysis:`마케터 채용 시장 분석:
- 디지털 마케팅과 데이터 분석 능력 필수
- 퍼포먼스 마케팅과 ROI 중심의 성과 관리 중시
- 콘텐츠 마케팅과 브랜드 스토리텔링 능력 중요
- 마케팅 자동화 툴과 CRM 활용 경험 선호`,keywords:"Google Analytics, Facebook Ads, 네이버 광고, SEO, SEM, 콘텐츠 마케팅, 이메일 마케팅, CRM, 마케팅 자동화, A/B 테스트, 전환율 최적화",focus:"성과 지표 개선, 캠페인 최적화, 고객 획득 비용 절감, 브랜드 인지도 향상"},planner:{analysis:`기획자 채용 시장 분석:
- 데이터 기반 의사결정과 비즈니스 분석 능력 중시
- 프로젝트 관리와 이해관계자 조율 능력 필수
- 시장 조사와 경쟁 분석을 통한 전략 수립 중요
- 애자일 방법론과 린 스타트업 경험 선호`,keywords:"비즈니스 분석, 시장 조사, 경쟁 분석, 프로젝트 관리, 애자일, 스크럼, 데이터 분석, KPI 설정, 로드맵 수립, 이해관계자 관리",focus:"전략적 사고, 실행력, 커뮤니케이션 능력, 비즈니스 성과 창출"},sales:{analysis:`영업 채용 시장 분석:
- 디지털 영업과 CRM 활용 능력 중시
- 고객 관계 관리와 장기적 파트너십 구축 중요
- 데이터 기반 영업 전략과 예측 분석 능력 선호
- B2B/B2C 영업 프로세스 이해와 협상 스킬 필수`,keywords:"CRM, 영업 프로세스, 고객 관계 관리, 협상, 제안서 작성, 영업 목표 달성, 신규 고객 개발, 기존 고객 관리, 영업 데이터 분석",focus:"영업 실적, 고객 만족도, 목표 달성률, 신규 시장 개척, 수익 증대"},hr:{analysis:`인사 채용 시장 분석:
- 디지털 HR과 HR 테크 활용 능력 중시
- 조직 문화와 직원 경험 개선에 대한 관심 증가
- 데이터 기반 인사 의사결정과 피플 애널리틱스 중요
- 원격근무와 하이브리드 워크 환경 관리 경험 선호`,keywords:"채용, 교육, 평가, 보상, 조직 개발, HR 시스템, 피플 애널리틱스, 조직 문화, 직원 경험, 성과 관리, 노무 관리",focus:"조직 효율성 개선, 직원 만족도 향상, 인재 확보 및 유지, HR 프로세스 최적화"},finance:{analysis:`재무/회계 채용 시장 분석:
- 디지털 회계와 자동화 시스템 활용 능력 중시
- 재무 분석과 예측 모델링 능력 중요
- 리스크 관리와 내부 통제 시스템 이해 필수
- ESG 경영과 지속가능성 보고 경험 선호`,keywords:"재무 분석, 예산 관리, 회계 처리, 세무, 감사, 리스크 관리, 내부 통제, 재무 모델링, 투자 분석, 자금 관리, ERP 시스템",focus:"재무 성과 개선, 비용 절감, 수익성 분석, 투자 효율성, 재무 리스크 관리"},consultant:{analysis:`컨설턴트 채용 시장 분석:
- 디지털 트랜스포메이션과 비즈니스 혁신 경험 중시
- 데이터 분석과 인사이트 도출 능력 중요
- 클라이언트 관계 관리와 프로젝트 리더십 필수
- 업계별 전문성과 글로벌 비즈니스 이해 선호`,keywords:"비즈니스 분석, 전략 수립, 프로세스 개선, 변화 관리, 프로젝트 관리, 클라이언트 관리, 문제 해결, 데이터 분석, 프레젠테이션",focus:"문제 해결 능력, 전략적 사고, 클라이언트 만족도, 프로젝트 성공률, 비즈니스 임팩트"},other:{analysis:`일반 직무 채용 시장 분석:
- 디지털 리터러시와 적응력 중시
- 협업과 커뮤니케이션 능력 중요
- 지속적 학습과 자기계발 의지 필수
- 문제 해결과 창의적 사고 능력 선호`,keywords:"커뮤니케이션, 협업, 문제 해결, 프로젝트 관리, 데이터 분석, 디지털 툴 활용, 고객 서비스, 품질 관리",focus:"업무 성과, 팀워크, 고객 만족, 프로세스 개선, 전문성 개발"}},o=r[t]||r.other,n=`당신은 15년 경력의 HR 전문가이자 헤드헌터입니다. 다음 이력서를 ${t} 직무 관점에서 전문적으로 분석하고 개선해주세요.

## HR 전문가 시장 분석
${o.analysis}

## 핵심 키워드 및 역량
${o.keywords}

## 채용 담당자 주목 포인트
${o.focus}

## 원본 이력서
${s}

## 전문가 분석 및 개선 요청

다음 관점에서 이력서를 완전히 재작성해주세요:

### 1. HR 전문가 관점 분석
- 현재 이력서의 강점과 약점 파악
- 채용 담당자가 주목할 포인트 식별
- 경력 갭이나 부족한 부분에 대한 전략적 보완
- ATS(지원자 추적 시스템) 최적화

### 2. 시장 경쟁력 강화
- 업계 트렌드에 맞는 키워드 최적화
- 경쟁자 대비 차별화 포인트 부각
- 연봉 협상에 유리한 성과 지표 강조
- 면접관이 궁금해할 스토리 구성

### 3. 완성된 이력서 구조
**개인정보**
- 이름, 연락처, 이메일, LinkedIn/포트폴리오 (있는 경우)

**전문가 요약 (Professional Summary)**
- 3-4줄로 핵심 가치 제안 명확히 제시
- 업계 경험과 주요 성과 하이라이트
- 채용 담당자의 관심을 즉시 끌 수 있는 내용

**핵심 역량 (Core Competencies)**
- 직무별 필수 기술과 소프트 스킬 균형
- ATS 키워드 최적화
- 측정 가능한 역량 수준 표시

**경력사항 (Professional Experience)**
각 경력마다:
- 회사명, 직책, 근무기간
- 주요 책임과 업무 범위
- **정량적 성과 지표** (매출 증가율, 비용 절감액, 프로젝트 성공률 등)
- **비즈니스 임팩트** (회사/팀에 미친 긍정적 영향)
- **문제 해결 사례** (도전과제와 해결 과정)
- 액션 동사로 시작하는 임팩트 있는 문장

**주요 프로젝트/성과 (Key Projects & Achievements)**
- 대표적인 프로젝트 2-3개 선별
- 프로젝트 배경, 역할, 결과, 학습점
- 비즈니스 가치와 개인 기여도 명확히 구분

**학력 (Education)**
- 학위, 전공, 졸업년도
- 관련 수상이나 특별 활동 (있는 경우)

**자격증/어학/기술 스택 (Certifications & Skills)**
- 직무 관련성 높은 순서로 배치
- 숙련도 수준 표시
- 최신 기술 트렌드 반영

### 4. 전문가 개선 포인트
- **스토리텔링**: 단순 업무 나열이 아닌 성장 스토리 구성
- **차별화**: 경쟁자와 구별되는 독특한 경험이나 관점 부각
- **미래 지향성**: 업계 트렌드와 개인 발전 방향 일치성 표현
- **신뢰성**: 구체적 수치와 검증 가능한 성과로 신뢰도 확보

### 5. 최종 검토 사항
- 맞춤법, 문법, 일관성 완벽 점검
- 1-2페이지 내 최적 분량 조절
- 읽기 쉬운 레이아웃과 시각적 구성
- 각 섹션 간 논리적 연결성 확보

**완성된 전문가 수준의 이력서만 출력해주세요. 분석 내용이나 설명은 포함하지 마세요.**`;console.log(`Attempting AI generation with primary model: ${c.primaryModel}`);let a=await p(n);console.log(`AI response received from: ${a.usedModel}`),console.log(`Tokens used: ${a.tokensUsed}, Cost: $${a.cost?.toFixed(4)||0}`);let l={improvements:["HR 전문가 관점에서 핵심 가치 제안 강화","ATS 시스템 최적화를 위한 키워드 전략적 배치","정량적 성과 지표와 비즈니스 임팩트 중심 재구성","채용 담당자 주목 포인트에 맞는 스토리텔링 적용","업계 트렌드 반영한 전문성 및 역량 부각","경쟁력 있는 차별화 요소 발굴 및 강조"],suggestions:["면접에서 어필할 수 있는 구체적 성공 사례 준비","연봉 협상 시 활용 가능한 성과 데이터 정리","LinkedIn 프로필과 일관성 있는 브랜딩 구축","포트폴리오나 레퍼런스 준비로 신뢰도 강화","업계 네트워킹과 지속적 학습으로 전문성 확장"],hrInsights:[`${t} 직무 시장에서 경쟁력 있는 프로필로 개선됨`,"채용 담당자가 선호하는 구조와 내용으로 최적화","ATS 통과율과 서류 합격률 향상 기대","면접 기회 증가와 연봉 협상력 강화 예상"],marketAnalysis:{competitiveness:Math.floor(15*Math.random())+85,atsOptimization:Math.floor(10*Math.random())+90,interviewPotential:Math.floor(20*Math.random())+80,salaryNegotiation:Math.floor(15*Math.random())+85},score:Math.floor(10*Math.random())+90,aiModel:a.usedModel,tokensUsed:a.tokensUsed,cost:a.cost};return i.NextResponse.json({success:!0,improvedResume:a.text,feedback:l,metadata:{model:a.model,usedModel:a.usedModel,tokensUsed:a.tokensUsed,cost:a.cost,analysisType:"hr_expert"}})}catch(s){console.error("Analysis error:",s);let e="분석 중 오류가 발생했습니다. 다시 시도해주세요.";return s.message.includes("Gemini")?e="Gemini AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.":s.message.includes("OpenAI")?e="OpenAI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.":(s.message.includes("quota")||s.message.includes("limit"))&&(e="AI 서비스 사용량이 한계에 도달했습니다. 잠시 후 다시 시도해주세요."),i.NextResponse.json({success:!1,error:e},{status:500})}}let y=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/analyze/route",pathname:"/api/analyze",filename:"route",bundlePath:"app/api/analyze/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/resume/app/api/analyze/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:A,workUnitAsyncStorage:h,serverHooks:g}=y;function k(){return(0,a.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:h})}},846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[719,580,449],()=>t(291));module.exports=r})();