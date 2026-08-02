# Sprint 2 — V3 Editorial Redesign

## 1. 목표

Figma V3를 기준으로 Yeongbeen Cloud를 정적인 카드형 포트폴리오에서 편집적인 개인 개발 플랫폼으로 재구성한다.

- Artem Shcherbakov 레퍼런스의 강한 타이포그래피와 여백을 살린다.
- Brittany Chiang 레퍼런스의 고정 identity 영역과 명확한 정보 구조를 적용한다.
- 노랑 계열은 muted gold primary로 조정하고, 핑크는 필기체와 작은 상태 강조에만 사용한다.
- 마스코트는 전면 장식이 아니라 현재 위치와 새 콘텐츠를 알려주는 작은 companion으로 사용한다.
- 390px부터 1440px까지 반응형·접근성·성능을 함께 검증한다.

## 2. 디자인 기준

- Figma V3: https://www.figma.com/design/o9H2K729hpqsiD0uz1OozA/포트폴리오-웹사이트?node-id=48-3
- Figma Foundations: https://www.figma.com/design/o9H2K729hpqsiD0uz1OozA/포트폴리오-웹사이트?node-id=7-2
- Figma Components V3: https://www.figma.com/design/o9H2K729hpqsiD0uz1OozA/포트폴리오-웹사이트?node-id=88-15
- Reference: https://artemartemartem.com/
- Reference: https://brittanychiang.com/

### 핵심 토큰

| 역할 | 값 |
| --- | --- |
| Canvas | `#F9F7F1` |
| Surface | `#FFFFFF` |
| Ink | `#141412` |
| Muted ink | `#545247` |
| Border | `#C7C2B2` |
| Primary gold | `#A6842E` |
| Strong gold | `#8A6E20` |
| Accent pink | `#EB4587` |

### 타이포그래피

- Display: Archivo Narrow Bold
- Body: IBM Plex Sans KR
- Navigation and metadata: IBM Plex Mono
- Handwritten accent: Caveat Brush

## 3. GitHub Project

- Project: https://github.com/users/binny0x00/projects/11
- Integration branch: `feature/sprint-2-v3-redesign`
- 기능별 브랜치에서 작업한 뒤 Integration branch로 Pull Request를 생성한다.
- 코드 리뷰와 CI를 통과한 PR만 병합한다.
- Sprint 2 완료 후 Integration branch를 `develop`로 병합해 staging에서 검증한다.

## 4. 작업 이슈

| 순서 | 이슈 | 권장 브랜치 |
| --- | --- | --- |
| 1 | [#46 V3 디자인 토큰과 타이포그래피 동기화](https://github.com/binny0x00/yeongbeen-cloud/issues/46) | `feature/46-s2-design-tokens` |
| 2 | [#47 Sticky Identity 데스크톱 셸 구현](https://github.com/binny0x00/yeongbeen-cloud/issues/47) | `feature/47-s2-sticky-identity` |
| 3 | [#51 Hero와 Section Eyebrow 구현](https://github.com/binny0x00/yeongbeen-cloud/issues/51) | `feature/51-s2-hero-eyebrow` |
| 4 | [#48 Experience Row 구현](https://github.com/binny0x00/yeongbeen-cloud/issues/48) | `feature/48-s2-experience-row` |
| 5 | [#52 Project Reel Row 구현](https://github.com/binny0x00/yeongbeen-cloud/issues/52) | `feature/52-s2-project-reel` |
| 6 | [#49 Article Row와 Writing 섹션 구현](https://github.com/binny0x00/yeongbeen-cloud/issues/49) | `feature/49-s2-article-row` |
| 7 | [#53 Pet Companion 상태와 모션 구현](https://github.com/binny0x00/yeongbeen-cloud/issues/53) | `feature/53-s2-pet-companion` |
| 8 | [#50 반응형·접근성·시각 품질 검증](https://github.com/binny0x00/yeongbeen-cloud/issues/50) | `test/50-s2-responsive-quality` |

## 5. 완료 조건

- V3 semantic token과 코드의 CSS 변수가 대응한다.
- 데스크톱에서는 identity sidebar가 고정되고 콘텐츠가 독립적으로 읽힌다.
- 숫자 접두사 섹션 라벨과 검은 면 hero가 제거된다.
- Experience, Project, Article이 재사용 가능한 row 컴포넌트로 구성된다.
- 마스코트가 콘텐츠를 가리지 않고 `prefers-reduced-motion`을 존중한다.
- 390px, 768px, 1200px, 1440px에서 가로 스크롤과 콘텐츠 겹침이 없다.
- `pnpm verify`와 Playwright 핵심 흐름이 통과한다.
- Integration branch가 Railway staging에서 정상 배포된다.
