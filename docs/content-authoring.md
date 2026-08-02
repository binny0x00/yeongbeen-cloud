# 콘텐츠 작성 가이드

Yeongbeen Cloud의 프로젝트와 기술 글은 루트 `content/` 디렉터리의 Markdown 파일로 관리합니다. `content.config.ts`의 Zod 스키마가 frontmatter를 검증하며 Nuxt Content가 쿼리 타입을 생성합니다.

## 디렉터리

```text
content/
├── projects/     # 프로젝트 사례 연구
└── writing/      # 기술 글과 작성 예정 글
```

파일 이름은 URL 경로가 되므로 영문 kebab-case를 사용합니다.

```text
content/projects/yeongbeen-cloud.md → /projects/yeongbeen-cloud
content/writing/safe-api-boundary.md → /writing/safe-api-boundary
```

## 프로젝트 frontmatter

```yaml
---
title: Project Name
description: 목록과 SEO에 사용하는 한 문장 요약
category: Team Project
status: completed # completed | in-progress | maintained
featured: true
order: 1
period: 2026.01 — 2026.03
role: Frontend Engineer
publishedAt: 2026-03-01
updatedAt: 2026-03-15 # 선택
tags:
  - Nuxt
repository: https://github.com/owner/repository # 선택
website: https://example.com # 선택
youtube: https://youtu.be/dQw4w9WgXcQ # 선택
---
```

`repository`와 `website`가 있으면 프로젝트 상세 화면에 각각 GitHub와 외부 사이트 아이콘이 표시됩니다. `youtube`에는 `youtube.com/watch`, `youtu.be`, `youtube.com/embed`, `youtube.com/shorts` 형식의 URL을 사용할 수 있으며, 입력한 영상은 상세 화면의 privacy-enhanced 플레이어에서 재생됩니다.

## 기술 글 frontmatter

```yaml
---
title: 글 제목
description: 목록과 SEO에 사용하는 한 문장 요약
status: published # draft | planned | published
order: 1
publishedAt: 2026-03-01 # published일 때 사용
updatedAt: 2026-03-15 # 선택
readingMinutes: 5 # 선택
series: Component Design # 선택
tags:
  - TypeScript
---
```

`draft`는 작성 중인 글, `planned`는 목록에서 예고할 글, `published`는 상세 페이지에서 공개할 글을 의미합니다. 날짜는 `YYYY-MM-DD` 형식을 사용합니다.

## 검증

```bash
pnpm typecheck
pnpm build
```

필수 필드 누락, 잘못된 상태값, URL이나 날짜 형식 오류는 Nuxt Content 빌드 단계에서 실패해야 합니다. `.data/`의 SQLite 파일은 빌드 산출물이므로 커밋하지 않습니다.
