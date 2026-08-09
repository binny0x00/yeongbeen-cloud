# Sprint 3 품질 보증

## 자동 검사

```bash
pnpm verify
pnpm test:e2e
```

`verify`는 lint, format, typecheck, 70개 unit/Nuxt test, production build를 실행합니다. Playwright는 production preview를 직접 만들고 다음을 검증합니다.

- KO/EN 탐색과 locale 전환
- OWNER 초안 생성, Tiptap 저장, KO 독립 발행
- 로그인 사용자 댓글·좋아요
- 390px, 768px, 1200px, 1440px 시각 회귀와 가로 overflow
- axe 자동 검사 가능한 WCAG 2.2 A/AA 위반 0건

최초 브라우저 설치:

```bash
pnpm exec playwright install chromium
```

실패 artifact는 `test-results/`의 screenshot, axe JSON, trace에서 확인합니다. 네 viewport의 정상 실행 screenshot도 CI artifact로 첨부해 사람의 시각 검토가 가능하게 합니다.

## 성능 기준

| 지표            | 기준    | 검증 위치                        |
| --------------- | ------- | -------------------------------- |
| LCP             | < 2.5초 | Railway staging, 3회 측정 중앙값 |
| INP             | < 200ms | Railway staging 실제 상호작용    |
| CLS             | < 0.1   | Railway staging                  |
| 공개 읽기 API   | < 400ms | `pnpm performance:verify` p95    |
| axe WCAG 2.2 AA | 0건     | 네 viewport Playwright           |

axe는 수동 검사를 대체하지 않습니다. 키보드 순서, focus 표시, 스크린리더 본문 순서, KO/EN 긴 문자열, 편집기 toolbar를 staging 승인 전에 확인합니다.

## Migration과 운영 검사

PostgreSQL·Redis 서비스가 있는 CI에서 migration 2회 적용, 멱등 seed/import, 낙관적 잠금, 댓글/좋아요, AI 사용량 프라이버시, 예약 발행, 고아 파일 정리, 임시 DB rollback을 모두 실행합니다. 실제 secret과 OAuth 공급자 호출은 CI fixture에 포함하지 않습니다.
