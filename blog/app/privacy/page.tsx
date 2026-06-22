import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">개인정보 처리방침</h1>
          </div>
          <p className="text-gray-600">(주)리스티아트의 개인정보 처리방침을 확인하세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">(주)리스티아트 개인정보 처리방침</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6 text-sm leading-relaxed">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">
                  (주)리스티아트(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와
                  관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
                </p>
                <p className="mt-2 text-blue-700 font-semibold">
                  ※ 용어 정의: 본 방침에서 "이용자"란 리스티아트 웹사이트를 이용하는 자(회원 포함)를 의미합니다.
                </p>
              </div>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제1조(개인정보의 처리 목적)</h2>
                <p className="mb-3">
                  회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리 중인 개인정보는 다음 목적 이외의 용도로
                  이용되지 않으며, 이용 목적이 변경되는 경우 「개인정보 보호법」 제18조에 따라 별도 동의를 받는 등
                  필요한 조치를 이행하겠습니다.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>홈페이지 회원 가입 및 관리:</strong> 회원 가입의사 확인, 본인 식별·인증, 회원자격 유지·관리,
                    서비스 부정이용 방지, 만 14세 미만 법정대리인 동의 확인, 고지·통지, 고충처리 등
                  </li>
                  <li>
                    <strong>재화 또는 서비스 제공:</strong> 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤 서비스
                    제공, 본인·연령 인증, 요금결제·정산, 채권추심 등
                  </li>
                  <li>
                    <strong>고충처리:</strong> 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과
                    통보
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제2조(개인정보의 처리 및 보유기간)</h2>
                <p className="mb-3">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 동의 받은 보유·이용기간 내에서
                  개인정보를 처리·보유합니다.
                </p>
                <p className="mb-3">각각의 처리 및 보유기간은 다음과 같습니다.</p>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-semibold">홈페이지 회원 가입 및 관리</h4>
                    <p>회원 탈퇴 시까지</p>
                    <p className="text-sm text-gray-600 mt-1">다만, 다음 사유에 해당하는 경우 해당 사유 종료 시까지</p>
                    <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
                      <li>관계 법령 위반에 따른 수사·조사 진행 시: 해당 수사·조사 종료 시까지</li>
                      <li>서비스 이용에 따른 채권·채무 관계 존속 시: 해당 채권·채무 정산 시까지</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold">재화 또는 서비스 제공</h4>
                    <p>재화·서비스 공급 및 요금결제·정산 완료 시까지</p>
                    <p className="text-sm text-gray-600 mt-1">다만, 아래 기간 동안 관련 기록 보관</p>
                    <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
                      <li>표시·광고 기록: 6개월(전자상거래법)</li>
                      <li>계약·청약철회·대금결제·재화 등 공급 기록: 5년(전자상거래법)</li>
                      <li>소비자 불만 또는 분쟁처리 기록: 3년(전자상거래법)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold">통신사실확인자료 보관(통신비밀보호법 제41조)</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-600">
                      <li>가입자 전기통신 일시, 개시·종료시간, 상대방 번호, 사용도수, 발신기지국 위치추적자료: 1년</li>
                      <li>컴퓨터통신·인터넷 로그기록, 접속지 추적자료: 3개월</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제3조(개인정보의 제3자 제공)</h2>
                <p>
                  회사는 제1조에서 명시한 범위 내에서만 개인정보를 처리하며, 정보주체의 동의가 있거나 법률의 특별한 규정
                  등 「개인정보 보호법」 제17조에 해당하는 경우에만 제3자에게 제공합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제4조(개인정보 처리의 위탁)</h2>
                <p>
                  회사는 원활한 서비스 제공을 위해 필요한 경우 개인정보 처리를 위탁할 수 있으며, 위탁 시 「개인정보
                  보호법」 제26조에 따라 계약서 등에 기술적·관리적 보호조치, 재위탁 제한, 관리·감독 등을 규정합니다.
                </p>
                <p className="text-sm text-gray-600 mt-2">※ 현재 위탁사항 없음</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제5조(정보주체의 권리·의무 및 행사방법)</h2>
                <p className="mb-3">정보주체는 회사에 대해 언제든지 다음 각 호의 권리를 행사할 수 있습니다.</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ol>
                <div className="mt-4 space-y-2">
                  <p>위 권리는 서면, 전화, 전자우편, FAX 등을 통하여 행사할 수 있으며 회사는 지체 없이 조치합니다.</p>
                  <p>
                    정보주체가 오류 등에 대한 정정 또는 삭제를 요구한 경우, 회사는 정정 또는 삭제를 완료할 때까지 해당
                    개인정보를 이용하거나 제3자에게 제공하지 않습니다.
                  </p>
                  <p>
                    권리 행사는 정보주체의 법정대리인이나 위임을 받은 자를 통하여 하실 수 있으며, 이 경우 개인정보
                    보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출해야 합니다.
                  </p>
                  <p>
                    정보주체는 개인정보 보호법 등 관계법령을 위반하여 회사가 처리 중인 타인의 개인정보 및 사생활을
                    침해하여서는 아니 됩니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제6조(처리하는 개인정보 항목)</h2>
                <p>회사는 다음의 개인정보 항목을 처리합니다.</p>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="font-semibold">(예시/현재 설정) 1) 수집 없음</p>
                  <p className="text-sm text-gray-600 mt-2">
                    ※ 실제 수집 항목이 있는 경우(회원가입 정보, 결제/로그 기록 등) 목적별 필수·선택 항목을 본 조에 표로
                    명확히 기입하십시오.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제7조(개인정보의 파기)</h2>
                <p className="mb-3">
                  회사는 개인정보 보유기간 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이
                  파기합니다.
                </p>
                <p className="mb-3">
                  동의 받은 보유기간이 경과하거나 처리목적이 달성되었음에도 법령에 따라 계속 보존하여야 하는 경우에는
                  별도의 DB로 옮기거나 보관 장소를 달리하여 보관합니다.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">파기 절차 및 방법</h4>
                  <ul className="space-y-2">
                    <li>
                      <strong>파기 절차:</strong> 파기 사유가 발생한 개인정보를 선정하고 개인정보 보호책임자의 승인을
                      받아 파기
                    </li>
                    <li>
                      <strong>파기 방법:</strong> 전자적 파일은 복구·재생 불가한 기술적 방법(예: 로우레벨포맷 등), 종이
                      문서는 분쇄 또는 소각
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제8조(개인정보의 안전성 확보조치)</h2>
                <p className="mb-3">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취합니다.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육 등
                  </li>
                  <li>
                    <strong>기술적 조치:</strong> 접근권한 관리, 접근통제시스템 설치, 암호화, 보안프로그램 설치 등
                  </li>
                  <li>
                    <strong>물리적 조치:</strong> 전산실, 자료보관실 등의 출입통제
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  제9조(개인정보 자동수집 장치의 설치·운영 및 거부)
                </h2>
                <p className="mb-3">회사는 맞춤형 서비스 제공을 위해 '쿠키(cookie)'를 사용할 수 있습니다.</p>
                <p className="mb-3">
                  쿠키는 웹사이트 서버가 이용자의 브라우저에 보내는 소량의 정보로 하드디스크에 저장될 수 있습니다.
                </p>

                <div className="space-y-2">
                  <p>
                    <strong>가) 사용목적:</strong> 방문·이용형태 파악, 인기 검색어, 보안접속 여부 확인 등 최적화 정보
                    제공
                  </p>
                  <p>
                    <strong>나) 설치·운영 및 거부:</strong> 브라우저의 환경설정(예: 도구 {">"} 인터넷 옵션 {">"}{" "}
                    개인정보)에서 쿠키 저장을 거부할 수 있음
                  </p>
                  <p>
                    <strong>다) 거부 시:</strong> 맞춤형 서비스 이용에 일부 제한이 있을 수 있음
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제10조(개인정보 보호책임자)</h2>
                <p className="mb-3">
                  회사는 개인정보 처리에 관한 업무를 총괄·책임지고, 개인정보 관련 민원처리 및 피해구제를 위해 아래와
                  같이 개인정보 보호책임자를 지정합니다.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">개인정보 보호책임자</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <strong>성명:</strong> 배진호
                      </li>
                      <li>
                        <strong>직책:</strong> 개발자
                      </li>
                      <li>
                        <strong>연락처:</strong> 010-4068-9276
                      </li>
                      <li>
                        <strong>이메일:</strong> baeno@nate.com
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">개인정보 보호 담당부서</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <strong>부서명:</strong> 개발팀
                      </li>
                      <li>
                        <strong>담당자:</strong> 배진호
                      </li>
                      <li>
                        <strong>연락처:</strong> 010-4068-9276
                      </li>
                      <li>
                        <strong>이메일:</strong> baeno@nate.com
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의·불만처리·피해구제 등을 위
                  연락처로 문의하실 수 있으며, 회사는 지체 없이 답변 및 처리해 드리겠습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제11조(개인정보 열람청구)</h2>
                <p className="mb-3">개인정보 보호법 제35조에 따른 개인정보 열람청구는 다음 부서에 하실 수 있습니다.</p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">개인정보 열람청구 접수·처리 부서</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <strong>부서명:</strong> 운영부서
                    </li>
                    <li>
                      <strong>담당자:</strong> 서미원
                    </li>
                    <li>
                      <strong>연락처:</strong> 010-3452-0734
                    </li>
                    <li>
                      <strong>이메일:</strong> restyart@naver.com
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제12조(권익침해 구제방법)</h2>
                <p className="mb-3">
                  정보주체는 아래 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다. (아래 기관은
                  회사와 별개)
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg">
                    <p className="font-semibold">개인정보침해신고센터(한국인터넷진흥원)</p>
                    <p className="text-sm">privacy.kisa.or.kr</p>
                    <p className="text-sm">국번없이 118</p>
                    <p className="text-sm">(58324) 전남 나주시 진흥길 9, 3층</p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <p className="font-semibold">개인정보분쟁조정위원회</p>
                    <p className="text-sm">www.kopico.go.kr</p>
                    <p className="text-sm">국번없이 1833-6972</p>
                    <p className="text-sm">(03171) 서울특별시 종로구 세종대로 209, 정부서울청사 4층</p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <p className="font-semibold">대검찰청 사이버범죄수사단</p>
                    <p className="text-sm">www.spo.go.kr</p>
                    <p className="text-sm">02-3480-3573</p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <p className="font-semibold">경찰청 사이버안전국</p>
                    <p className="text-sm">cyberbureau.police.go.kr</p>
                    <p className="text-sm">국번없이 182</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제13조(정책의 고지 및 변경)</h2>
                <p>
                  본 방침의 내용 추가, 삭제 및 수정이 있을 경우 개정 최소 7일 전부터 홈페이지를 통해 고지합니다. 중요
                  변경 시에는 더 명확한 방법으로 고지할 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">제14조(시행일)</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-800">이 개인정보 처리방침은 2025년 8월 26일부터 적용됩니다.</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
