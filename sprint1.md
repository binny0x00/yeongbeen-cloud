# Sprint 1 — Yeongbeen Cloud 기반 구축

## 1. 프로젝트 개요

**Yeongbeen Cloud**는 최영빈의 프로젝트, 기술 기록, 경험을 한곳에서 보여주는 개인 개발 플랫폼이다.

단순한 포트폴리오 페이지가 아니라 다음 역량을 실제 서비스로 증명하는 것을 목표로 한다.

- Vue/Nuxt와 TypeScript를 활용한 프론트엔드 개발
- 재사용 가능한 공통 컴포넌트와 디자인 시스템 설계
- 반응형 웹, 접근성, 성능을 고려한 UI 구현
- REST API와 동적 콘텐츠 처리
- Docker 기반의 일관된 개발·빌드 환경 구성
- GitHub Actions를 이용한 CI/CD 자동화
- 실제 도메인과 HTTPS가 적용된 서비스 운영
- AI 도구를 활용해 짧은 기간에도 품질을 유지하는 개발 과정 기록

서비스 도메인은 `yeongbeen.cloud`이며, 사이트 자체를 대표 프로젝트로 활용한다.

## 2. Sprint 1 목표

> Figma 디자인을 기반으로 핵심 랜딩 페이지를 구현하고, 이후 기능을 안전하게 확장할 수 있는 개발·검증·배포 기반을 완성한다.

Sprint 1이 끝나면 방문자는 데스크톱과 모바일에서 다음 내용을 확인할 수 있어야 한다.

1. 최영빈이 어떤 개발자인지
2. 어떤 기술과 문제에 관심이 있는지
3. 대표 경험과 프로젝트가 무엇인지
4. 최근 기술 글로 이동할 수 있는지
5. GitHub, 이력서, 이메일로 연결할 수 있는지

## 3. 기술 스택

| 영역 | 기술 | 선택 목적 |
| --- | --- | --- |
| Framework | Nuxt 4, Vue 3 | SSR·SSG·서버 API를 하나의 프로젝트에서 구성 |
| Language | TypeScript | 컴포넌트와 API 데이터의 타입 안정성 확보 |
| Vue 방식 | Composition API, `<script setup>` | 간결하고 재사용 가능한 로직 구성 |
| Package Manager | pnpm | 빠른 설치와 엄격한 의존성 관리 |
| Styling | Tailwind CSS + CSS Variables | 빠른 반응형 구현과 Figma 디자인 토큰 연결 |
| Content | Nuxt Content, Markdown | 프로젝트와 기술 글을 코드 기반으로 관리 |
| Server API | Nuxt/Nitro Server Routes | REST API와 서버 로직 구현 |
| State | Vue composables 우선 | 불필요한 전역 상태를 줄이고 필요 시 Pinia 도입 |
| Unit Test | Vitest, Vue Test Utils | 컴포넌트와 유틸리티 동작 검증 |
| E2E Test | Playwright | 주요 사용자 흐름과 반응형 화면 검증 |
| Accessibility | axe-core, semantic HTML | 키보드 탐색과 접근성 오류 점검 |
| Code Quality | ESLint, Prettier, vue-tsc | 코드 스타일, 타입, 빌드 오류 자동 검사 |
| Container | Docker, Docker Compose | 개발·CI·운영 환경에서 동일한 Nuxt 실행 방식 유지 |
| CI/CD | GitHub Actions + Railway CLI | PR 품질 검증과 main 브랜치의 Docker 배포 자동화 |
| Production | Railway | Nuxt SSR 애플리케이션을 Docker 컨테이너로 운영 |
| Database | Railway PostgreSQL | 이후 조회수·방명록·관리 기능을 위한 동적 데이터 저장 |
| DNS/CDN/HTTPS | 가비아 + Cloudflare | 도메인 소유는 가비아에서 유지하고 DNS·프록시·HTTPS·DNSSEC 관리 |
| Analytics | Cloudflare Web Analytics | 개인정보 부담이 적은 기본 방문 지표 확인 |

### 기술 선택 원칙

- 공고의 필수·우대 기술을 실제 코드와 운영 과정으로 증명한다.
- 새로운 라이브러리는 해결할 문제가 분명할 때만 추가한다.
- 공통 UI는 외부 UI 프레임워크에 의존하지 않고 직접 구현한다.
- 로컬, CI, 운영 환경 모두 같은 Dockerfile을 기준으로 실행한다.
- Pull Request에서는 품질과 이미지 빌드를 검증하고, main 브랜치에서는 검증을 통과한 버전을 Railway에 배포한다.
- Railway PostgreSQL은 실제 동적 데이터 기능이 필요해지는 시점에 연결하며 Sprint 1에서는 연결 구조와 환경변수를 준비한다.

### 최종 인프라 구성

```text
사용자
  ↓
yeongbeen.cloud
  ↓
가비아 — 도메인 소유 및 갱신
  ↓
Cloudflare — DNS, Proxy, CDN, HTTPS, DNSSEC, Web Analytics
  ↓
Railway — Nuxt SSR Docker Container
  └─ Railway PostgreSQL
```

- 가비아에서는 Cloudflare가 제공하는 네임서버를 등록한다.
- Cloudflare의 루트 도메인 CNAME과 Railway의 도메인 검증용 TXT 레코드를 설정한다.
- 일반 웹 트래픽은 Cloudflare Proxy를 활성화하고 Railway가 안내하는 SSL/TLS 모드를 적용한다.
- DNS와 Railway 도메인 검증이 완료된 뒤 DNSSEC를 활성화한다.
- Cloudflare Pages, Workers, D1은 애플리케이션 실행에 사용하지 않는다.

## 4. 디자인 방향

- Figma: [포트폴리오 웹사이트](https://www.figma.com/design/o9H2K729hpqsiD0uz1OozA/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8?node-id=0-1)
- Reference: [Artem Shcherbakov](https://artemartemartem.com/), [Brittany Chiang](https://brittanychiang.com/)
- Tone: 편집적인 강한 타이포그래피, 충분한 여백, 명확한 정보 계층
- Accent: 노란색을 주요 면 색상으로, 핑크를 서명선·배지·상태 강조에 제한적으로 사용
- Typography: Archivo Black + IBM Plex Sans KR + IBM Plex Mono
- Breakpoints: Mobile 390px 기준, Desktop 1440px 기준으로 시작하고 중간 너비를 유동적으로 대응

## 5. Sprint 1 범위

### Must Have

- Nuxt 4 + TypeScript 프로젝트 초기화
- Figma 토큰을 CSS Variables와 Tailwind 테마로 이전
- 공통 레이아웃과 반응형 내비게이션 구현
- Desktop/Mobile Hero 구현
- About, Experience, Projects, Writing, Contact 섹션 구현
- Button, Text Link, Navigation Link, Tag, Section Label 등 공통 컴포넌트 구현
- 프로젝트와 글 데이터를 TypeScript 또는 Markdown으로 분리
- 기본 SEO 메타데이터, favicon, Open Graph 설정
- 404 페이지와 기본 오류 상태 구현
- ESLint, Prettier, vue-tsc, Vitest 설정
- Dockerfile과 Docker Compose 구성
- Pull Request CI: lint → typecheck → test → build → Docker build
- main 브랜치 CD: CI 통과 → Railway Docker 배포 → health check
- Railway Production 환경 1회 배포
- `yeongbeen.cloud` 연결을 위한 DNS·배포 절차 문서화

### Should Have

- GitHub REST API를 활용한 공개 저장소 정보 표시
- 다크 모드 토큰과 테마 전환
- Lighthouse 성능·접근성 측정
- Playwright 기반 홈 화면 smoke test
- 콘텐츠 추가 방법을 설명하는 README

### Sprint 1 제외 범위

- 관리자 CMS
- 회원가입과 일반 사용자 로그인
- 댓글·좋아요·방명록
- 검색과 복합 태그 필터
- 이미지 업로드 및 R2 연동
- Kubernetes 운영 배포

위 기능은 랜딩 페이지와 배포 기반이 안정화된 이후 Sprint 2부터 검토한다.

## 6. 작업 단위

### Epic 1 — 프로젝트 기반

- Nuxt 프로젝트 생성 및 디렉터리 구조 정의
- TypeScript strict 설정
- 코드 품질 도구와 Git 훅 설정
- 환경변수 예시 파일 작성

### Epic 2 — 디자인 시스템

- 색상, 타이포그래피, 간격, 반경 토큰 구현
- 기본 UI 컴포넌트 구현
- Desktop/Mobile variant 규칙 정의
- focus, hover, disabled 상태 구현

### Epic 3 — 홈페이지

- Header와 Hero
- About와 Experience
- Featured Projects
- Recent Writing
- Contact CTA와 Footer
- 모바일·태블릿·데스크톱 레이아웃 검증

### Epic 4 — 콘텐츠와 API

- 프로젝트·경험·글 데이터 스키마 정의
- 샘플 콘텐츠 작성
- GitHub API 호출 모듈과 로딩·오류 상태 구현

### Epic 5 — 품질과 배포

- 단위 테스트와 smoke test 작성
- 접근성·성능 검사
- Docker 이미지 빌드 및 로컬 실행 검증
- GitHub Actions CI 구성
- Railway 프로젝트와 Production 서비스 구성
- GitHub Actions에서 Railway 배포 및 health check 자동화
- 가비아 네임서버를 Cloudflare로 변경
- Cloudflare에서 Railway CNAME·TXT 레코드와 HTTPS 프록시 설정
- DNS 구성이 안정화된 후 DNSSEC 활성화
- `www.yeongbeen.cloud`를 `yeongbeen.cloud`로 리다이렉트
- `yeongbeen.cloud` 도메인 연결 및 장애 대응 절차 작성

## 7. 완료 조건(Definition of Done)

- Figma의 Desktop/Mobile 핵심 화면이 구현되어 있다.
- 390px부터 1440px까지 가로 스크롤이나 콘텐츠 겹침이 없다.
- 키보드만으로 내비게이션과 주요 링크를 사용할 수 있다.
- 이미지에는 대체 텍스트가 있고, 버튼과 링크의 역할이 구분된다.
- 주요 본문 텍스트가 WCAG AA 수준의 색상 대비를 만족한다.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`가 통과한다.
- Docker 이미지가 빌드되고 컨테이너에서 사이트가 실행된다.
- Pull Request에서 CI가 자동 실행된다.
- main 브랜치의 CI가 성공하면 동일한 Docker 기반 애플리케이션이 Railway에 배포된다.
- Railway 배포 후 health check 실패 시 워크플로우에서 오류를 확인할 수 있다.
- `yeongbeen.cloud` 요청이 Cloudflare를 거쳐 Railway 서비스로 전달된다.
- HTTPS, 루트 도메인, `www` 리다이렉트와 DNSSEC가 정상 동작한다.
- 배포된 URL에서 홈 화면과 404 화면을 확인할 수 있다.
- README만 보고 로컬 실행과 콘텐츠 추가가 가능하다.
- AI가 생성한 코드도 개발자가 검토하고 테스트한 뒤 반영했다는 기록이 남아 있다.

## 8. Sprint 1 성공 지표

- Lighthouse Performance 90 이상을 목표로 한다.
- Lighthouse Accessibility 95 이상을 목표로 한다.
- 초기 화면에 레이아웃 이동을 유발하는 요소가 없어야 한다.
- 대표 프로젝트와 연락 수단까지 3회 이내의 클릭으로 도달할 수 있어야 한다.
- main 브랜치 병합 후 수동 파일 전송 없이 배포가 진행되어야 한다.

## 9. 예상 결과물

- 운영 가능한 Yeongbeen Cloud 랜딩 페이지
- 재사용 가능한 Vue 컴포넌트와 디자인 토큰
- Markdown 기반 프로젝트·글 콘텐츠 구조
- Railway에서 운영되는 Docker 기반 Nuxt 애플리케이션
- 필요 시 연결할 수 있는 Railway PostgreSQL 구성 기반
- GitHub Actions CI/CD 워크플로우
- 배포 및 도메인 연결 문서
- 성능·접근성 검사 결과
- AI 활용 과정과 개발자의 검증 내용을 정리한 개발 로그
