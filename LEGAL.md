# 리스티아트 공통 법적 표기

모든 테넌트 사이트에 동일한 **사업자 정보**와 **AI 이용 안내**를 표시합니다.

## 사업자 정보 (단일 출처)

| 항목 | 내용 |
|------|------|
| 상호 | 리스티아트 |
| 사업자등록번호 | 3961701077 |
| 주소 | 경기도 성남시 분당구 대왕판교로 645번길 12, 7·9층 145호 |
| 통신판매업신고 | 2022-성남분당C-0670 |

## 적용 방식

1. **소스** — `components/restyart-legal-bar.tsx` + 각 `app/layout.tsx` 하단 `<RestyartLegalBar />`
2. **퍼블리시** — `publish.sh` → `inject-legal.js` (HTML에 주입)
3. **런타임** — `tenant-proxy.js` `prepareHtml()` (미주입 HTML 보완)

### 중복 푸터 방지 (중요)

서비스에 **자체 `<footer>` / `<Footer />` 컴포넌트**가 있으면:

- `RestyartLegalBar`를 layout에 **추가하지 않음** (`sync-legal-component.js` 자동 제외)
- `inject-legal.js` / 게이트웨이가 **별도 legal bar를 주입하지 않음** (`shouldSkipLegalInjection`)
- AI 이용 안내는 **서비스 footer 안**에 `RestyartAiDisclosure`로 포함
- footer의 **회사명(법인 표기)** 은 `리스티아트`로 통일

일괄 패치:

```bash
node common/scripts/patch-tenant-footer-legal.js
```

## 동기화 명령

```bash
# 모든 프로젝트 layout + 컴포넌트 동기화
node common/sync-legal-component.js

# 약관/개인정보 페이지 + 가입 동의 + resty-auth 클라이언트
node common/sync-auth-legal.js

# 이미 배포된 public HTML 일괄 주입
node common/inject-legal.js common/public
```

정보 변경 시 `common/legal-info.js` 와 `common/components/restyart-legal-bar.tsx` 만 수정한 뒤 위 명령을 다시 실행합니다.
