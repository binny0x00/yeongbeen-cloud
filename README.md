# Yeongbeen Cloud

Nuxt와 TypeScript로 만드는 최영빈의 개인 개발 플랫폼입니다.

## 요구사항

- Node.js 22 이상
- pnpm 10 이상

## 설치

```bash
pnpm install
```

## 실행

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

```bash
pnpm dev
```

## 빌드

프로덕션 빌드와 로컬 미리보기는 다음 명령을 사용합니다.

```bash
pnpm build
pnpm preview
```

## 테스트

코드 스타일, 타입, 프로덕션 빌드를 한 번에 검증합니다.

```bash
pnpm verify
```

개별 검사는 다음 명령으로 실행할 수 있습니다.

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

## 디자인 시스템

- `app/assets/css/tokens.css`: Figma의 색상, 타이포그래피, 간격, 반경, 그림자 토큰
- `app/assets/css/main.css`: Tailwind CSS 진입점, 로컬 폰트, 전역 기본 스타일
- 의미 기반 색상 유틸리티: `bg-canvas`, `bg-accent`, `text-ink`, `text-ink-muted`
- 타이포그래피 클래스: `type-display-*`, `type-heading-*`, `type-body-*`, `type-label`, `type-mono-sm`

테마는 루트 요소의 `data-theme="dark"` 속성으로 전환할 수 있으며, 컴포넌트에서는 원시 색상 대신 의미 기반 토큰을 사용합니다.

## 문서

- [Sprint 1 계획](./sprint1.md)
- [콘텐츠 작성 가이드](./docs/content-authoring.md)
- [Figma 디자인](https://www.figma.com/design/o9H2K729hpqsiD0uz1OozA/)

## 팀원

- 최영빈 — 기획, 디자인, 프론트엔드, 인프라
