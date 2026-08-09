# Sprint 3 운영 Runbook

## 로컬 통합 실행

실제 secret은 `.env`에만 두고 커밋하지 않습니다. Compose 내부 DB/Redis를 원격 서비스로 바꿀 때만 `COMPOSE_DATABASE_URL`, `COMPOSE_REDIS_URL`을 사용합니다.

```bash
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:3000/api/ready
```

`migrate` 컨테이너가 migration과 멱등 seed를 먼저 완료하고, 성공한 뒤 `web`이 시작됩니다. `/ko`, `/en`, OAuth 로그인, 편집·복구·발행, 댓글·좋아요, AI 보조 순서로 확인합니다. AI 제안은 적용 후에도 직접 저장하기 전까지 DB 버전이 바뀌면 안 됩니다.

## 품질과 데이터 검증

```bash
pnpm db:check
pnpm db:migrate
pnpm db:migrate
pnpm db:seed
pnpm infrastructure:verify
pnpm editor:verify
pnpm engagement:verify
pnpm ai:verify
pnpm operations:verify
pnpm performance:verify
pnpm db:rollback:verify
pnpm test:e2e
```

- `db:rollback:verify`는 `yb_migration_<random>` 임시 DB에 전체 migration을 적용한 뒤 그 DB만 제거합니다. 현재 연결 DB를 rollback하지 않습니다.
- `performance:verify`는 공개 목록을 30회 읽고 p95 400ms 미만을 강제합니다.
- E2E는 production preview에서 KO/EN, OWNER 편집·발행, 댓글·좋아요, 390/768/1200/1440 시각 회귀, axe WCAG 2.2 AA를 확인합니다.
- `E2E_TESTING=1`은 CI의 일회성 테스트 DB에서만 사용하며 staging/production에는 절대 설정하지 않습니다.

## 예약 발행과 미디어 정리

Railway Cron은 5분 간격 예약 발행, 일 1회 고아 미디어 정리를 권장합니다. `Authorization: Bearer <CRON_SECRET>` 또는 `x-cron-secret`을 보냅니다.

```text
POST /api/internal/cron/publish-scheduled
POST /api/internal/cron/cleanup-media
```

로컬 one-shot worker는 다음과 같이 실행합니다. R2 설정이 없으면 발행만 실행하고 미디어 정리는 안전하게 건너뜁니다.

```bash
docker compose --profile operations run --rm operations
```

발행은 due 상태를 트랜잭션에서 다시 확인해 멱등 처리하고 공개 Redis 캐시를 무효화합니다. 미디어는 `PENDING` 상태가 24시간 넘은 객체만 R2에서 먼저 삭제하고 DB 행을 제거합니다. 실패 행은 다음 실행에서 재시도합니다.

## Staging 확인

- Sprint 3 통합 PR commit SHA와 Railway deployment SHA 일치
- Google/GitHub callback과 검증된 이메일 계정 연결
- R2 CORS·직접 업로드·고아 파일 정리
- Redis rate limit·공개 캐시 무효화
- PostgreSQL 검색·migration 버전·예약 발행
- KO/EN canonical, hreflang, sitemap, RSS의 staging origin

## Rollback

1. Railway에서 직전 정상 이미지로 되돌립니다.
2. additive migration은 유지하고 문제가 된 worker 또는 기능을 중지합니다.
3. destructive migration은 사전 dump로 별도 복구 DB를 만든 뒤 검증하고 연결을 전환합니다.
4. R2 객체는 즉시 일괄 삭제하지 않고 24시간 유예와 재시도 기록을 보존합니다.
5. 원인, 영향 범위, 정상화 SHA를 Sprint 3 PR에 기록합니다.

`main`과 production은 별도 승인 전까지 변경하지 않습니다.
