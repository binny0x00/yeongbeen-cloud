# Sprint 3 콘텐츠 마이그레이션

## 기준점

- Sprint 3 integration baseline: `d009c0713d1de5ad17a07f7d76884ee4c1391637`
- Legacy production baseline: `7fcfb0b05fb02a4de91af9af8918526251c15261`
- 입력: `content/projects/*.md`, ProjectsSection, ExperienceSection
- 한국어 localization은 공개, 영어 localization은 초안으로 생성한다.

## 실행

1. `pg_dump --format=custom --file=sprint3-before-content.dump "$DATABASE_URL"`로 DB를 백업한다.
2. `pnpm db:migrate`를 실행한다.
3. `OWNER_EMAILS`의 첫 번째 검증 이메일을 확인한다.
4. `pnpm content:import`를 실행한다. 같은 입력으로 반복해도 source key 기준으로 갱신된다.
5. `pnpm content:verify`로 문서 수, KO/EN localization, SHA-256 checksum을 검증한다.

## Rollback

- 콘텐츠만 되돌릴 때: `pnpm content:rollback`
- 전체 DB를 되돌릴 때: 새 DB에 `pg_restore --clean --if-exists --dbname="$DATABASE_URL" sprint3-before-content.dump`
- dump는 로컬 암호화 저장소나 Railway 백업에만 보관하고 Git에 추가하지 않는다.

## Cutover

PR 4에서 공개 읽기 경로가 PostgreSQL repository로 전환되고 검증된 뒤 Nuxt Content 런타임과 Vue 내부 legacy 배열을 제거한다. 이 순서로 무중단 fallback을 유지한다.
