# common — 단일 포트 멀티테넌트 게이트웨이

**포트 4000 하나**로 모든 프로젝트 프론트 + 중앙 인증 API를 제공합니다.  
각 프로젝트를 **별도 포트로 띄우지 않습니다.**

## 아키텍처

```
http://localhost:4000/              → 대시보드
http://localhost:4000/arc/          → arc 정적 프론트 (common/public/arc/)
http://localhost:4000/bucket/       → bucket 정적 프론트
http://localhost:4000/api/resty/... → 중앙 멀티테넌트 인증 API
```

### 워크플로우

1. 소스는 `~/Documents/resty/{project}/` 에서 개발
2. 빌드 후 **common으로 배포**: `./publish.sh arc`
3. 결과물 → `common/public/arc/` (정적 HTML/JS/CSS)
4. `npm start` — **common만** 실행, 추가 포트 불필요

## 설치 및 실행

```bash
cd common
npm install
npm start
```

## 프로젝트 배포 (프론트 → common)

```bash
cd common
./publish.sh arc        # arc 하나
./publish.sh bucket     # bucket 하나
./publish.sh --all      # opt_list.txt 전체 (오래 걸림)
```

배포 후 `http://localhost:4000/arc/` 에서 확인.

## 인증 API

테넌트 slug = 폴더명 (`arc`, `bucket`, …)

```bash
curl -X POST http://localhost:4000/api/resty/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"subdomain":"arc","email":"u@ex.com","password":"pass123","name":"User"}'
```

프론트에서 API 호출 시 `baseURL: ""`(상대경로) + `x-subdomain: arc` 사용.

## (선택) 개발용 별도 포트 프록시

로컬에서 `npm run dev` 핫리로드가 필요할 때만:

```bash
ENABLE_DEV_PROXY=1 npm start
```

대시보드에 Dev 버튼이 나타나며, 이 경우에만 5001+ 포트로 프록시합니다. **일반 사용 시 불필요.**

## nginx (프로덕션)

```nginx
location / {
    proxy_pass http://127.0.0.1:4000;
}
```

경로 구조(`/arc/`, `/api/resty/`)가 로컬과 동일합니다.

## 관련 문서

- [MIGRATION.md](./MIGRATION.md) — 프로젝트별 인증 마이그레이션 체크리스트

## 보안

로컬 개발용입니다. 외부 노출 시 nginx 뒤에서만 사용하세요.
