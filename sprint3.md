# Sprint 3 — Content Platform

## 목표

개인 포트폴리오를 KO/EN 독립 발행, 프로젝트·스터디 게시물, 블록 편집기, 참여 기능, AI 작성 보조를 갖춘 모듈형 콘텐츠 플랫폼으로 확장합니다. 시각 언어는 한국 웹툰의 패널 호흡을 차용하되 Paper·Ink·Lime `#EAFF00`로 절제합니다.

- Figma: [Sprint 3 Design System](https://www.figma.com/design/o9H2K729hpqsiD0uz1OozA?node-id=133-2)
- 통합 브랜치: `feature/sprint-3-content-platform`
- 기준 브랜치: `main`
- production: 별도 승인 전 변경 금지

## 기능 PR 순서

1. `feature/s3-01-architecture-system` — Layers, 경계, 디자인 시스템, 설정 문서
2. `feature/s3-02-persistence-auth` — PostgreSQL, Drizzle, Better Auth, Redis
3. `feature/s3-03-content-migration` — Markdown·하드코딩 콘텐츠 import
4. `feature/s3-04-public-experience` — 포트폴리오·게시물·검색·SEO·i18n
5. `feature/s3-05-editor-media` — 관리자, Tiptap, R2, revision
6. `feature/s3-06-engagement` — 댓글, 좋아요, 신고, 알림, moderation
7. `feature/s3-07-ai-assistance` — Responses API 기반 명시적 AI 보조
8. `test/s3-08-quality-operations` — Docker, E2E, a11y, migration·운영 검증

각 브랜치는 통합 브랜치를 기준으로 만들고 Draft PR을 연 뒤 CI·자기 리뷰·문서화를 완료합니다. 통합은 merge commit만 사용하며 공유 브랜치 rebase와 force push를 금지합니다.

## 완료 조건

- lint, format, typecheck, unit/integration, E2E, build, Docker build 통과
- Domain의 Nuxt·DB·브라우저 의존 0건
- migration 순방향·rollback 및 콘텐츠 checksum 검증
- KO/EN 독립 발행, 자동저장·복구·revision 복원 무손실
- 권한 우회, 댓글·좋아요 중복, 실제 secret Git 기록 0건
- axe WCAG 2.2 AA, LCP 2.5초 미만, INP 200ms 미만, CLS 0.1 미만
- 공개 읽기 API p95 400ms 미만
- Sprint 3 통합 브랜치 로컬 Docker 검증 완료

Sprint 3 → `develop` merge와 Railway staging 확인은 통합 검증 성공 뒤 수행합니다. `main` PR과 production 배포는 생성하지 않습니다.
