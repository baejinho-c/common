# 서버 배포 — common 게이트웨이 마이그레이션

기존 **서브도메인 + Docker(포트 302x)** 구조를 **단일 게이트웨이(:4000) + 경로 기반**(`/arc/`, `/light/`)으로 전환합니다.

## 목표 아키텍처

```
https://app.restyart.com/           → 기존 유지 (치킨모임 정적 /opt/restyart/build) — 변경 안 함
https://light.restyart.com/         → (nginx) proxy → :4000/light/
https://arc.restyart.com/           → (nginx) proxy → :4000/arc/
```

게이트웨이 대시보드는 **내부/개발용** `http://127.0.0.1:4000/` 또는 별도 도메인으로만 사용합니다. `app.restyart.com`은 건드리지 않습니다.

## 서버 현황 (2026-06)

| 항목 | 값 |
|------|-----|
| SSH | `ssh -i ~/Downloads/sports.pem ec2-user@app.restyart.com` |
| 디스크 | ~82% (빌드 전 여유 확보 권장) |
| Node | nvm **v16.20.2** (AL2 — Node 18+ glibc 오류) |
| 기존 | `/opt/{tenant}/source` + Docker + nginx `:302x` |
| 신규 | `/opt/resty-gateway/common` + `public/{tenant}/` + `:4000` |

## 배포 전략 (2가지)

### A. 권장 — 로컬 빌드 + rsync (디스크·시간 절약)

로컬에서 이미 `publish.sh`로 `common/public/`이 있으므로:

```bash
# 로컬
cd ~/Documents/resty/common
./publish.sh arc          # 필요 테넌트
./scripts/rsync-to-server.sh
```

서버에서는 **게이트웨이만** 설치하고 `public/` 동기화.

### B. 서버에서 pull + publish (디스크 15GB+ 여유 필요)

```bash
# 서버
/opt/resty-gateway/scripts/pull-all-tenants.sh
cd /opt/resty-gateway/common && ./publish.sh arc
```

45개 전체 빌드는 디스크·CPU 부담이 큼 → **배치로 나눠 실행**.

---

## 단계별 체크리스트

### 0. 사전 준비

- [ ] 디스크 20GB+ 여유 (`df -h /`)
- [ ] GitHub에서 서버가 `baejinho-c/*` pull 가능
- [ ] **`app.restyart.com`은 변경하지 않음** (치킨모임 `/opt/restyart/build` 유지)

### 1. 게이트웨이 설치 (서버)

```bash
ssh -i ~/Downloads/sports.pem ec2-user@app.restyart.com
sudo bash /opt/resty-gateway/common/scripts/install-gateway.sh
```

또는 수동:

```bash
sudo mkdir -p /opt/resty-gateway
sudo chown ec2-user:ec2-user /opt/resty-gateway
git clone https://github.com/baejinho-c/common.git /opt/resty-gateway/common
cd /opt/resty-gateway/common
source ~/.nvm/nvm.sh && nvm use 20
npm install
sudo cp scripts/resty-gateway.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now resty-gateway
curl -s http://127.0.0.1:4000/api/published | head
```

### 2. 정적 파일 배포

**로컬 → 서버:**

```bash
cd ~/Documents/resty/common
./scripts/rsync-to-server.sh
```

**또는 서버에서 pull + publish:**

```bash
./scripts/pull-all-tenants.sh arc light bucket   # 인자 없으면 opt_list 기준
cd /opt/resty-gateway/common && ./publish.sh arc
```

환경변수 (프로덕션 canonical):

```bash
export NEXT_PUBLIC_SITE_URL=https://light.restyart.com
./publish.sh light
```

### 3. nginx 전환 (파일럿 → 전체)

예시 설정: `scripts/nginx-common-gateway.conf.example`

파일럿 (`light`만):

```bash
sudo cp scripts/nginx-common-gateway.conf.example /etc/nginx/conf.d/resty-gateway.conf
# light 블록만 활성화 후
sudo nginx -t && sudo systemctl reload nginx
```

검증:

```bash
curl -sI -H "Host: light.restyart.com" https://127.0.0.1/light/ -k | head
curl -s http://127.0.0.1:4000/light/ | head
```

### 4. 전체 컷오버

- [ ] `opt_list.txt` 테넌트별 nginx `proxy_pass` → `:4000/{tenant}/`
- [ ] Docker wake(`:5001`) 의존 제거 가능
- [ ] Exited 컨테이너 정리: `docker container prune` (신중히)
- [ ] 테넌트 서브도메인 nginx → `:4000/{tenant}/` (app.restyart.com 제외)

### 5. 롤백

nginx에서 `resty-gateway.conf` 제거 후 reload → 기존 `:302x` Docker 방식으로 복귀.

---

## 디렉터리 매핑

| 로컬 | 서버 (신규) | 서버 (기존 소스) |
|------|-------------|------------------|
| `resty/common/` | `/opt/resty-gateway/common/` | `/opt/common/` (Docker entrypoint만) |
| `resty/arc/` | publish → `common/public/arc/` | `/opt/arc/source/` |
| `resty/light/` | `common/public/light/` | `/opt/light/source/` |

`git pull`은 기존 경로 유지:

```bash
git -C /opt/arc/source pull origin main
```

`safe.directory` 필요 시:

```bash
git config --global --add safe.directory /opt/arc/source
```

---

## systemd 서비스

- 유닛: `resty-gateway.service`
- 포트: `4000`
- 환경: `WORKDIR=/opt/resty-gateway`, `PORT=4000`

---

## 주의사항

1. **디스크 82%** — 서버 전체 빌드 전 `docker system prune`, 로그 정리 권장
2. **API 키** — `publish.sh`는 빌드용 placeholder 사용; 런타임 API는 테넌트별 서버 API 또는 중앙 auth만 사용
3. **app.restyart.com** — **변경 금지**. 치킨모임 정적(`/opt/restyart/build`) 그대로 유지
4. **SEO** — publish 시 `NEXT_PUBLIC_SITE_URL=https://{tenant}.restyart.com` 설정
