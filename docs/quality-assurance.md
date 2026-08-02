# 브라우저 품질 검사

## Playwright

홈 화면의 핵심 콘텐츠, 390px·768px·1200px·1440px 반응형 레이아웃, 가로 overflow, 키보드 탐색, reduced motion, WCAG A·AA 자동 검사를 Chromium에서 확인한다.

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

실패 시 `test-results/`의 screenshot과 trace를 확인한다. 로컬에서 단계별로 디버깅할 때는 다음 명령을 사용한다.

```bash
pnpm test:e2e:ui
```

axe 자동 검사는 모든 접근성 문제를 발견하지 못한다. 키보드 탐색, focus 표시, 본문 읽기 순서, 링크 문맥은 배포 전 수동으로 함께 확인한다.

## Lighthouse

### 목표

- Performance: 90 이상
- Accessibility: 95 이상
- Best Practices: 95 이상
- SEO: 95 이상

### Sprint 2 기준선

| 항목           | Mobile | Desktop | 판정 기준                   |
| -------------- | -----: | ------: | --------------------------- |
| Performance    |     90 |      90 | 3회 측정 중앙값             |
| Accessibility  |     95 |      95 | axe WCAG A·AA 위반 0건 병행 |
| Best Practices |     95 |      95 | 이전 배포 대비 하락 없음    |
| SEO            |     95 |      95 | 주요 메타데이터 누락 없음   |

Sprint 2 integration branch를 `develop`에 병합한 뒤 Railway staging URL에서 측정하고, 측정 일시와 commit SHA를 해당 PR에 기록한다.

### 측정 환경

1. production build를 생성하고 preview 서버를 실행한다.
2. 브라우저 확장 프로그램의 영향을 피하기 위해 Chrome 시크릿 창을 사용한다.
3. Chrome DevTools의 Lighthouse에서 Mobile과 Desktop을 각각 3회 측정한다.
4. 각 카테고리의 중앙값과 측정 일시, commit SHA, Chrome 버전을 PR에 기록한다.

```bash
pnpm build
pnpm preview
```

CLI로 재현할 때는 preview URL을 대상으로 HTML 보고서를 생성한다.

```bash
pnpm dlx lighthouse http://127.0.0.1:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html \
  --output-path=./lighthouse-report.html
```

네트워크·CPU 조건과 외부 API 응답에 따라 점수가 달라질 수 있으므로 단일 측정값만으로 회귀를 판단하지 않는다.
