# 프로젝트별 멀티테넌트 마이그레이션 체크리스트

경로 기반 게이트웨이(`http://localhost:4000/{tenant}/`)와 중앙 인증 API(`http://localhost:4000/api/resty/*`)로 프로젝트를 이전할 때 사용합니다.

## 사전 조건

- [common](../) 서버 실행: `cd common && npm start` (**포트 4000만** 사용)
- 프론트 배포: `cd common && ./publish.sh <tenant>` → `common/public/<tenant>/`
- 테넌트 slug = **프로젝트 폴더명** (예: `bucket`, `wish`, `reading`, `arc`)
- 중앙 Auth: `POST /api/resty/auth/login` body에 `subdomain` 필수

## 마이그레이션 단계

| # | 작업 | 파일 예시 |
|---|------|-----------|
| 1 | `apiClient.subdomain` 또는 요청 body에 `subdomain: "{폴더명}"` 설정 | `lib/api/client.ts` |
| 2 | `baseURL`을 `""`(상대경로)로 — 게이트웨이 `:4000`에서 동작 | `lib/api/client.ts`, `lib/env.ts` |
| 3 | 인증 API 경로를 `/api/resty/auth/*`로 통일 | `lib/api/auth.ts` |
| 4 | `x-subdomain` 헤더 추가 | API 클라이언트 fetch 래퍼 |
| 5 | 프로젝트 내 `/app/api/resty/auth/*` 로컬 라우트 제거 (중앙으로 이전) | `app/api/resty/auth/` |
| 6 | 테넌트 전용 API는 `/{tenant}/api/resty/*` 경로 사용 (게이트웨이 프록시) | wishes, posts 등 |
| 7 | `NEXT_PUBLIC_TENANT_PATH=/{tenant}` 환경변수 (단독 실행 시 `""`) | `.env.local` |
| 8 | `cd common && ./publish.sh <tenant>` 로 정적 프론트 배포 | `common/public/{tenant}/` |
| 9 | common 대시보드에서 `/{tenant}/` Open 동작 확인 | http://localhost:4000 |

## API 경로 규칙

```
중앙 인증 (모든 테넌트 공통)
  POST /api/resty/auth/login      { subdomain, email, password }
  POST /api/resty/auth/register   { subdomain, email, password, name, ... }
  GET  /api/resty/users?subdomain={tenant}

테넌트 전용 API (각 Next.js 앱)
  GET  /{tenant}/api/resty/wishes     → 프록시 → 앱의 /api/resty/wishes
```

## 완료된 파일럿

### bucket
- [x] `lib/api/client.ts` — baseURL `""`, subdomain `bucket`
- [x] `lib/env.ts` — localhost:4000 기본값

### wish
- [x] `lib/api/client.ts` — 중앙 auth + 테넌트 API 경로 분리
- [x] `lib/config/env.ts` — `NEXT_PUBLIC_TENANT_PATH=/wish`

### reading
- [x] `lib/api-client.ts` — `/api/resty/auth/*` + subdomain
- [x] `lib/store/slices/authSlice.ts` — 동일 패턴

### arc
- [x] `lib/api/client.ts` — baseURL `""`, subdomain `arc`
- [x] `lib/api/auth.ts` — 중앙 `/api/resty/auth/*`
- [x] `lib/env.ts` — `NEXT_PUBLIC_TENANT_PATH=/arc`
- [x] `lib/auth-context.tsx` + `app/login`, `app/register`

## 다음 우선순위

1. growup — `/api/resty/auth/*` 클라이언트 통일
2. gpt — 동일
3. blog — cookie 세션 → resty API 전환 (별도 패턴, 마지막)
4. 정적 전용(trace, sports 등) — auth 스킵, `/{tenant}/` 라우팅만 확인

## nginx 연동 (프로덕션)

```nginx
location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

로컬과 동일한 경로 prefix(`/blog/`, `/api/resty/`)를 유지하면 앱 코드 변경 없이 배포 가능합니다.

## 검증 명령

```bash
# 테넌트 목록
curl http://localhost:4000/api/tenants

# 회원가입
curl -X POST http://localhost:4000/api/resty/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"subdomain":"bucket","email":"test@example.com","password":"password123","name":"Test"}'

# 로그인
curl -X POST http://localhost:4000/api/resty/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"subdomain":"bucket","email":"test@example.com","password":"password123"}'
```
