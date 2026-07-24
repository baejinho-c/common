/**
 * AI 기본법(「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법」) 대응
 * — 공통 조항 + 고영향(P0/P1) 테넌트 별표
 */

export type AiLegalAppendix = {
  /** 서비스에서 쓰는 AI 기능 */
  aiFeatures: string[]
  /** 외부 AI로 전송될 수 있는 데이터 */
  outboundData: string[]
  /** 고영향·민감 영역 고지 */
  highImpactNote: string
  /** Human Review / 금지 용도 */
  humanReviewAndLimits: string[]
  /** 아동 등 추가 */
  extras?: string[]
}

export const AI_BASIC_LAW_COMMON = {
  effectiveNote:
    "대한민국 「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법」(이하 AI 기본법) 및 개인정보 보호법에 따라 AI 이용·신뢰성·투명성 관련 사항을 안내합니다.",
  generativeLabel:
    "생성형 AI가 만든 텍스트·이미지·음성·코드·추천 등에는 서비스 화면 또는 푸터에 AI 이용 안내(또는「AI 생성」표시)를 제공합니다.",
  noTrainingGuarantee:
    "회사는 서비스 제공 목적 범위에서 외부 AI API를 호출할 수 있으며, 이용자 입력을 당사 자체 모델 학습에 이용하지 않는 것을 원칙으로 합니다. 외부 사업자(OpenAI, Google 등)의 학습 이용 여부는 각 사업자 정책·계약을 따릅니다.",
  logging:
    "서비스 품질·보안·분쟁 대응을 위해 AI 요청·응답의 일부(입력 요약, 출력, 시각, 모델 식별자 등)가 로그로 보관될 수 있습니다. 보관 기간은 목적 달성 시까지 또는 관련 법령에 따릅니다.",
}

/** tenant slug → 별표 */
export const AI_LEGAL_APPENDIX: Record<string, AiLegalAppendix> = {
  mind: {
    aiFeatures: [
      "AI 심리상담 대화",
      "감정 일기·성격/주간 리포트 등 생성·분석",
    ],
    outboundData: [
      "이용자가 입력한 상담·일기 내용",
      "대화 맥락·세션 정보(서비스 제공에 필요한 범위)",
    ],
    highImpactNote:
      "본 서비스는 심리·정서 관련 AI 상담을 제공하나 의료기관의 진료·진단을 대체하지 않습니다. 생명·안전에 긴급한 위험이 있으면 즉시 전문 기관·응급 연락처를 이용해 주세요.",
    humanReviewAndLimits: [
      "AI 응답은 참고용이며, 최종 판단·행동의 책임은 이용자에게 있습니다.",
      "위기·응급 상황의 자동 대응을 보장하지 않습니다.",
      "상담 내용의 외부 AI(OpenAI, Google Gemini 등) 전송이 발생할 수 있습니다.",
    ],
  },
  resume: {
    aiFeatures: ["이력서·경력 문서 AI 분석", "피드백·개선 제안 생성", "AI 도우미 채팅"],
    outboundData: ["업로드·붙여넣기한 이력서·경력 텍스트", "분석 요청 프롬프트"],
    highImpactNote:
      "채용·인사와 관련된 AI 분석 도구로 활용될 수 있으나, 채용·합격 여부의 최종 결정을 대체하지 않습니다.",
    humanReviewAndLimits: [
      "AI 분석 결과는 참고용이며, 인사·채용 최종 결정은 사람이 내려야 합니다.",
      "차별·편향 가능성이 있는 자동 평가에 단독으로 의존하지 마세요.",
    ],
  },
  vtest: {
    aiFeatures: ["모의면접 질문 생성", "답변 피드백·분석"],
    outboundData: ["면접 답변 텍스트", "직무·경력 관련 입력"],
    highImpactNote:
      "면접 연습·피드백 목적의 AI이며, 실제 채용 전형의 합격 판정을 대체하지 않습니다.",
    humanReviewAndLimits: [
      "점수·피드백은 참고용입니다.",
      "채용 최종 결정·인사평가에 AI 결과만으로 사용해서는 안 됩니다.",
    ],
  },
  career: {
    aiFeatures: ["진로·목표 분석", "학습/입시 경로 제안"],
    outboundData: ["목표·성적·학교 선호도 등 이용자 입력"],
    highImpactNote:
      "진로·입시와 인접한 정보를 다룰 수 있으나, 입학·진학·평가의 공식 결정을 대체하지 않습니다.",
    humanReviewAndLimits: [
      "AI 제안은 참고용이며, 진학·진로 최종 결정은 이용자·보호자·상담 전문가가 합니다.",
    ],
  },
  qbank: {
    aiFeatures: ["맞춤 문제·해설 생성", "학습 관련 AI 추천"],
    outboundData: ["학습 주제·난이도·성적/풀이 관련 입력"],
    highImpactNote:
      "교육·평가 콘텐츠를 생성할 수 있으나, 공식 시험·성적 평가를 대체하는 고지된 평가 시스템이 아닙니다.",
    humanReviewAndLimits: [
      "AI 문항·해설에 오류가 있을 수 있으므로 학습·평가에 활용 시 사람이 검증해야 합니다.",
    ],
  },
  wonder: {
    aiFeatures: ["영어 동화 텍스트 생성", "삽화(이미지) 생성"],
    outboundData: ["동화 주제·설정 프롬프트", "생성 요청 내용"],
    highImpactNote:
      "아동이 이용할 수 있는 생성형 콘텐츠 서비스입니다. 만 14세 미만은 보호자 동의·관리 하에 이용해 주세요.",
    humanReviewAndLimits: [
      "생성된 동화·이미지는 참고·학습 보조 목적이며, 부적절 콘텐츠가 나올 수 있어 보호자 확인을 권장합니다.",
    ],
    extras: [
      "아동 대상 서비스 특성상 과도한 개인정보(실명·학교·연락처 등)를 프롬프트에 입력하지 않도록 안내합니다.",
    ],
  },
  growup: {
    aiFeatures: ["육아·연령별 콘텐츠 생성", "AI 안내 문구 생성"],
    outboundData: ["자녀 연령대·육아 관련 이용자 입력"],
    highImpactNote:
      "육아 정보·콘텐츠를 생성할 수 있으나, 의료·발달 진단·치료를 대체하지 않습니다.",
    humanReviewAndLimits: [
      "AI 콘텐츠는 참고용이며, 건강·발달 문제는 전문가 상담을 이용하세요.",
      "아동 개인 식별 정보를 입력하지 않도록 주의해 주세요.",
    ],
    extras: ["만 14세 미만 아동의 회원가입·이용은 보호자 동의가 필요할 수 있습니다."],
  },

  // —— P1 ——
  care: {
    aiFeatures: ["돌봄·요양 관련 AI 문의 응대", "서비스 안내 챗봇"],
    outboundData: ["이용자가 입력한 문의·상담 내용"],
    highImpactNote:
      "돌봄·요양·건강과 인접한 안내를 할 수 있으나, 의료 진단·처방·응급 대응을 대체하지 않습니다.",
    humanReviewAndLimits: [
      "AI 응답은 참고용이며, 건강·돌봄 결정은 전문 인력·기관과 상의해야 합니다.",
      "긴급 상황에서는 119 등 공식 응급 체계를 이용해 주세요.",
    ],
  },
  crm: {
    aiFeatures: ["리드 스코어링", "감성·문의 분석", "영업 이메일·문구 생성", "AI 인사이트"],
    outboundData: ["고객·문의 텍스트", "CRM에 저장된 연락·활동 요약(기능 사용 시)"],
    highImpactNote:
      "고객·영업 개인정보가 AI 분석·생성에 사용될 수 있습니다. 채용·신용·보험 등 중요 결정의 자동 대체를 목적으로 하지 않습니다.",
    humanReviewAndLimits: [
      "AI 점수·초안은 참고용이며, 고객 응대·계약·할인 등 최종 결정은 사람이 합니다.",
      "민감정보·불필요한 개인식별정보를 AI 프롬프트에 넣지 마세요.",
    ],
  },
  search: {
    aiFeatures: ["AI 검색 답변 생성", "출처 기반 요약·추천"],
    outboundData: ["검색 질의", "답변 생성에 필요한 문맥"],
    highImpactNote:
      "공개 정보 기반 AI 답변·추천을 제공하며, 특정 사실의 정확성·완전성을 보장하지 않습니다.",
    humanReviewAndLimits: [
      "AI 답변은 참고용이며, 중요 결정 전 원문·공식 자료를 확인하세요.",
      "의료·법률·투자 등 전문 자문을 대체하지 않습니다.",
    ],
  },
  "seo-copilot": {
    aiFeatures: ["사이트 SEO 감사", "키워드·로드맵 생성", "상품·시장 검증 제안"],
    outboundData: ["분석 대상 URL·키워드·사업 설명 등 이용자 입력"],
    highImpactNote:
      "마케팅·SEO 전략 보조 도구이며, 검색엔진 순위·매출을 보장하지 않습니다.",
    humanReviewAndLimits: [
      "AI 제안은 참고용이며, 콘텐츠·광고·법적 고지 최종 책임은 이용자에게 있습니다.",
    ],
  },
  toonsnap: {
    aiFeatures: ["웹툰 스토리 생성", "패널 이미지 생성", "공감·바이럴 분석"],
    outboundData: ["상황·캐릭터 설정 프롬프트", "생성 요청 내용"],
    highImpactNote:
      "생성형 만화·이미지 서비스입니다. 타인의 초상·상표·저작권을 침해하는 입력을 하지 마세요.",
    humanReviewAndLimits: [
      "생성물에는 오류·부적절 표현이 포함될 수 있으며, 공개 전 이용자가 검수해야 합니다.",
    ],
  },
  blog: {
    aiFeatures: ["블로그 아웃라인·본문 생성", "SEO 키워드·분석"],
    outboundData: ["주제·키워드·초안 관련 입력"],
    highImpactNote:
      "자동 콘텐츠 생성·발행 보조 도구이며, 게시물의 사실 확인·표절·광고 표시 책임은 이용자에게 있습니다.",
    humanReviewAndLimits: [
      "AI 초안은 참고용이며, 공개 전 사람이 검토·수정해야 합니다.",
    ],
  },
  sim: {
    aiFeatures: ["커리어·수입 시뮬레이션", "스킬 갭·액션 플랜 생성"],
    outboundData: ["경력·목표·조건 등 이용자 입력"],
    highImpactNote:
      "진로·수입 전망을 시뮬레이션할 수 있으나, 실제 연봉·채용·투자 결과를 보장하지 않습니다.",
    humanReviewAndLimits: [
      "결과는 참고용 시나리오이며, 진로·계약 최종 결정은 이용자가 합니다.",
    ],
  },
  today: {
    aiFeatures: ["맛집·부동산 등 위치 기반 AI 추천", "추천 대화"],
    outboundData: ["검색·선호 입력", "위치 정보(이용자가 허용한 경우)"],
    highImpactNote:
      "위치·선호 기반 추천을 제공하며, 특정 업소·매물의 품질·가격·안전성을 보장하지 않습니다.",
    humanReviewAndLimits: [
      "추천은 참고용이며, 방문·계약 전 직접 확인하세요.",
      "위치 정보는 브라우저 권한에 따라 선택적으로 수집됩니다.",
    ],
  },
  "comic-studio": {
    aiFeatures: ["만화 스토리·컷 생성 보조", "스튜디오 AI 에이전트"],
    outboundData: ["스토리·캐릭터·컷 관련 프롬프트"],
    highImpactNote: "생성형 만화 제작 보조 서비스이며, 저작권·초상권 침해 입력을 금지합니다.",
    humanReviewAndLimits: [
      "생성 결과는 참고용이며, 공개·상업 이용 전 이용자가 검수해야 합니다.",
    ],
  },
  food: {
    aiFeatures: ["맞춤 레시피·식단 추천"],
    outboundData: ["선호·제한 식재료·프로필 관련 입력"],
    highImpactNote:
      "식단·레시피 추천은 참고용이며, 알레르기·질환에 따른 의료·영양 진단을 대체하지 않습니다.",
    humanReviewAndLimits: [
      "알레르기·금기 식품은 이용자가 최종 확인해야 합니다.",
    ],
  },
  logo: {
    aiFeatures: ["로고·브랜드 이미지 생성", "브랜드 URL 분석"],
    outboundData: ["상호·업종·브랜드 설명·URL"],
    highImpactNote:
      "디자인 초안 생성 도구이며, 상표·디자인 등록 가능성·타사 권리 침해 여부를 보장하지 않습니다.",
    humanReviewAndLimits: [
      "상업적 사용 전 상표·저작권 검토를 권장합니다.",
    ],
  },
  poster: {
    aiFeatures: ["포스터·팜플렛 문구·레이아웃 AI 생성"],
    outboundData: ["인터뷰 응답·행사·상품 설명 입력"],
    highImpactNote: "마케팅 자료 초안 생성 도구이며, 광고 표시·사실 확인 책임은 이용자에게 있습니다.",
    humanReviewAndLimits: ["공개 전 문구·이미지·법적 고지를 사람이 검수해야 합니다."],
  },
  light: {
    aiFeatures: ["QT·묵상·나눔 문구 생성", "성경 관련 AI 응답"],
    outboundData: ["본문·기도·나눔 관련 이용자 입력"],
    highImpactNote:
      "신앙 생활 보조 콘텐츠를 생성할 수 있으나, 특정 교리·상담·목회 결정을 대체하지 않습니다.",
    humanReviewAndLimits: ["AI 문구는 참고용이며, 최종 해석·적용은 이용자·공동체가 합니다."],
  },
  vibecommunity: {
    aiFeatures: ["커뮤니티 게시글 AI 초안 생성", "자동 포스팅 보조"],
    outboundData: ["주제·태그·초안 관련 입력"],
    highImpactNote: "커뮤니티 글 작성 보조 도구이며, 게시 내용의 사실·권리·커뮤니티 규정 준수 책임은 이용자에게 있습니다.",
    humanReviewAndLimits: ["AI 초안은 참고용이며, 게시 전 사람이 검토해야 합니다."],
  },
  arc: {
    aiFeatures: ["전자책 원고·챕터 AI 작성·편집", "원고 임포트·초안 생성"],
    outboundData: ["주제·원고·편집 지시 텍스트"],
    highImpactNote:
      "전자책 창작·편집 보조 도구이며, 저작권·사실 확인·출판 책임은 이용자에게 있습니다.",
    humanReviewAndLimits: ["AI 생성·편집 결과는 참고용이며, 공개·판매 전 검수가 필요합니다."],
  },
  "trip-course": {
    aiFeatures: ["여행 일정·코스 생성", "링크·문서 기반 추출"],
    outboundData: ["여행 조건·URL·일정 관련 입력"],
    highImpactNote: "여행 계획 보조 도구이며, 교통·요금·안전·비자 정보의 정확성을 보장하지 않습니다.",
    humanReviewAndLimits: ["예약·출국 전 공식 정보를 확인하세요."],
  },

  // —— P2 ——
  qbox: {
    aiFeatures: ["개발 Q&A AI 답변 생성", "질문 분석·유사 질문 추천"],
    outboundData: ["질문·코드·오류 메시지 등 이용자 입력"],
    highImpactNote:
      "프로그래밍 Q&A 보조 도구이며, 보안·운영·법률 관련 조언의 정확성을 보장하지 않습니다.",
    humanReviewAndLimits: [
      "AI 답변·코드는 참고용이며, 프로덕션 적용 전 사람이 검증해야 합니다.",
    ],
  },
  tech: {
    aiFeatures: ["기술 콘텐츠 초안·윤문 생성", "전문가 포스트 보조"],
    outboundData: ["주제·초안·편집 지시 텍스트"],
    highImpactNote:
      "기술 블로그·콘텐츠 작성 보조 도구이며, 게시물의 사실·보안·라이선스 확인 책임은 이용자에게 있습니다.",
    humanReviewAndLimits: ["AI 초안은 참고용이며, 공개 전 검수가 필요합니다."],
  },
  rebrand: {
    aiFeatures: ["브랜드 진단", "리브랜딩 문구·방향 제안"],
    outboundData: ["브랜드·제품·URL·목표 관련 입력"],
    highImpactNote:
      "브랜드·디자인 전략 보조 도구이며, 상표 등록·법적 권리 확보를 보장하지 않습니다.",
    humanReviewAndLimits: ["제안은 참고용이며, 상업적 사용 전 전문가 검토를 권장합니다."],
  },
  comparison: {
    aiFeatures: ["여행 견적·일정 비교 생성"],
    outboundData: ["여행 조건·선호 입력"],
    highImpactNote: "여행 비용·일정 추정 보조이며, 실제 요금·좌석·정책을 보장하지 않습니다.",
    humanReviewAndLimits: ["예약 전 항공·숙소 공식 정보를 확인하세요."],
  },
  calli: {
    aiFeatures: ["서예·캘리그라피 스타일 가이드 생성"],
    outboundData: ["문구·스타일·용도 관련 입력"],
    highImpactNote: "디자인 스타일 제안 도구이며, 폰트·저작권 라이선스를 보장하지 않습니다.",
    humanReviewAndLimits: ["상업 이용 전 폰트·이미지 라이선스를 확인하세요."],
  },
  math: {
    aiFeatures: ["수학 풀이·증명 튜터 대화"],
    outboundData: ["문제·풀이 과정·질문 텍스트"],
    highImpactNote:
      "학습 보조 AI이며, 공식 시험·성적 평가를 대체하지 않습니다. 풀이 오류가 있을 수 있습니다.",
    humanReviewAndLimits: ["결과는 참고용이며, 학습·평가에 활용 시 사람이 검증해야 합니다."],
  },
  english: {
    aiFeatures: ["영어 학습·회화 튜터 대화"],
    outboundData: ["학습 문장·대화·교정 요청 텍스트"],
    highImpactNote: "언어 학습 보조 AI이며, 공식 시험·성적 평가를 대체하지 않습니다.",
    humanReviewAndLimits: ["교정·설명은 참고용이며, 오류가 있을 수 있습니다."],
  },
  special: {
    aiFeatures: ["맞춤 맛집 목록 생성"],
    outboundData: ["지역·취향·상황 관련 입력"],
    highImpactNote: "맛집 추천 보조이며, 업소 정보·위생·가격의 정확성을 보장하지 않습니다.",
    humanReviewAndLimits: ["방문 전 영업·메뉴 정보를 직접 확인하세요."],
  },
  plot: {
    aiFeatures: ["스토리·플롯 분석", "구성 제안"],
    outboundData: ["원고·시놉시스 텍스트"],
    highImpactNote: "창작 보조 도구이며, 저작권·표절 여부를 보장하지 않습니다.",
    humanReviewAndLimits: ["분석·제안은 참고용이며, 최종 창작 책임은 이용자에게 있습니다."],
  },
  mindmap: {
    aiFeatures: ["텍스트 분해·노드 구성", "마인드맵 AI 보조"],
    outboundData: ["분해·합성 대상 텍스트"],
    highImpactNote: "아이디어 정리 보조 도구이며, 결과의 완전성을 보장하지 않습니다.",
    humanReviewAndLimits: ["생성 구조는 참고용이며, 업무·학습 활용 전 검토하세요."],
  },
  concept: {
    aiFeatures: ["콘셉트·아이디어 생성"],
    outboundData: ["주제·제약 조건 입력"],
    highImpactNote: "브레인스토밍 보조이며, 사업·법적 타당성을 보장하지 않습니다.",
    humanReviewAndLimits: ["제안은 참고용입니다."],
  },
  recipe: {
    aiFeatures: ["레시피 생성·변형"],
    outboundData: ["재료·취향·제한 조건 입력"],
    highImpactNote:
      "요리 레시피 보조이며, 알레르기·영양·식품 안전을 보장하지 않습니다.",
    humanReviewAndLimits: ["알레르기·금기 식품은 이용자가 최종 확인해야 합니다."],
  },

  // —— P3 ——
  mud: {
    aiFeatures: ["AI RPG 세계관 생성", "인터랙티브 스토리·GM 내레이션"],
    outboundData: ["세계관·캐릭터·플레이 입력"],
    highImpactNote: "엔터테인먼트용 생성형 스토리 서비스이며, 사실·역사·법률 정보의 정확성을 보장하지 않습니다.",
    humanReviewAndLimits: ["생성 내용은 참고·오락용이며, 부적절 콘텐츠가 나올 수 있습니다."],
  },
  form: {
    aiFeatures: ["문서·양식·계약 초안 템플릿 생성"],
    outboundData: ["문서 유형·요구사항·초안 관련 입력"],
    highImpactNote:
      "문서 초안 보조 도구이며, 법률·세무·계약의 공식 자문을 대체하지 않습니다.",
    humanReviewAndLimits: [
      "생성 초안은 참고용이며, 법적 효력·정확성은 전문가 검토가 필요합니다.",
    ],
  },
  sight: {
    aiFeatures: ["웹·스크린샷 문제 분석", "퀴즈·풀이 생성"],
    outboundData: ["분석 대상 URL·이미지·문제 텍스트"],
    highImpactNote: "학습·문제 풀이 보조이며, 공식 시험·성적 평가를 대체하지 않습니다.",
    humanReviewAndLimits: ["분석·답변은 참고용이며, 오류가 있을 수 있습니다."],
  },
  mypage: {
    aiFeatures: ["원페이지 사이트 기획·HTML 생성", "카피 개선"],
    outboundData: ["사업·브랜드 설명·사이트 요구사항"],
    highImpactNote: "웹사이트 초안 생성 보조이며, 상표·저작권·광고 표시 준수 책임은 이용자에게 있습니다.",
    humanReviewAndLimits: ["생성 HTML·문구는 참고용이며, 공개 전 검수가 필요합니다."],
  },
  video: {
    aiFeatures: ["영상 자막·스크립트 분석", "상품·요약 추출"],
    outboundData: ["영상 URL·자막·분석 요청"],
    highImpactNote: "영상 콘텐츠 분석 보조이며, 사실·제품 정보의 정확성을 보장하지 않습니다.",
    humanReviewAndLimits: ["분석 결과는 참고용이며, 상업적 활용 전 원본·권리를 확인하세요."],
  },
  foodsns: {
    aiFeatures: ["맛집 리뷰 문체 변환·생성"],
    outboundData: ["리뷰 초안·변환 요청 텍스트"],
    highImpactNote: "리뷰 작성 보조이며, 허위·과장 광고에 해당하지 않도록 이용자가 확인해야 합니다.",
    humanReviewAndLimits: ["변환 결과는 참고용이며, 게시 전 사실 여부를 검토하세요."],
  },
  youtube: {
    aiFeatures: ["유튜브 댓글 감성 분석", "콘텐츠 아이디어 제안"],
    outboundData: ["채널·댓글·분석 대상 텍스트"],
    highImpactNote: "콘텐츠·마케팅 보조 분석이며, 조회수·수익을 보장하지 않습니다.",
    humanReviewAndLimits: ["분석·아이디어는 참고용입니다."],
  },
}
