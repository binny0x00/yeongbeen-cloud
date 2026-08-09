# Sprint 3 운영 Runbook

## 로컬 통합 실행

1. `.env.example`을 참고해 `.env`를 만들되 실제 값은 커밋하지 않는다.
2. `docker compose up -d --build`로 Web, PostgreSQL, Redis를 시작한다.
3. `pnpm db:migrate`와 `pnpm db:seed`를 실행한다.
4. `curl http://127.0.0.1:3000/api/ready`에서 DB·Redis 상태를 확인한다.
5. `/ko`, `/en`, OAuth 로그인, 초안 저장·복구, 발행, 댓글, 좋아요, AI 보조를 순서대로 확인한다.
6. AI 제안이 비교 화면에만 나타나고 명시적 적용 뒤에도 수동 저장 전까지 DB 버전이 바뀌지 않는지 확인한다.
7. `ai_usage`에는 prompt 버전·토큰·추정 비용만 있고 원문과 생성문이 없는지 확인한다.

## Migration과 seed

- 배포 전 `pnpm db:check`와 `pnpm db:migrate`를 실행한다.
- seed는 멱등이며 개발·검증 환경에서만 실행한다.
- 콘텐츠 import 전 DB dump와 import 체크섬 결과를 보관한다.
- 실패 시 애플리케이션 배포를 중단하고 migration 로그와 schema version을 기록한다.

## Staging 확인

- Sprint 3 통합 PR의 commit SHA와 Railway deployment SHA가 일치해야 한다.
- Google/GitHub callback, R2 CORS·직접 업로드, Redis rate limit, PostgreSQL 검색, 예약 발행 worker를 확인한다.
- KO/EN의 canonical, hreflang, sitemap, RSS가 staging origin을 가리키는지 확인한다.

## Rollback

1. Railway에서 직전 정상 이미지로 rollback한다.
2. additive migration은 그대로 두고 기능 flag를 끈다.
3. destructive migration이 포함된 경우 사전 dump로 별도 복구 DB를 만든 뒤 검증하고 연결을 전환한다.
4. R2 객체는 즉시 삭제하지 않고 고아 상태로 표시해 정리 worker의 유예기간 이후 제거한다.
5. 원인, 영향 범위, 정상화 SHA를 Sprint 3 PR에 기록한다.

`main`과 production은 별도 승인 전까지 변경하지 않습니다.
