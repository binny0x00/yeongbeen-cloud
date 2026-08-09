# GitHub Actions와 Railway 배포

Pull Request에서는 코드 품질, PostgreSQL·Redis 통합, E2E, Docker 이미지 빌드를 검증하고, 장기 브랜치에 반영된 커밋만 Railway에 배포한다.

## 브랜치와 배포 환경

| 이벤트                              | GitHub Actions 작업                  | Railway 환경 |
| ----------------------------------- | ------------------------------------ | ------------ |
| Sprint 3·develop·main Pull Request  | quality, infrastructure, E2E, Docker | 배포 안 함   |
| `feature/sprint-3-content-platform` | 전체 CI                              | 배포 안 함   |
| `develop` push                      | 전체 CI 통과 후 Railway 배포         | staging      |
| `main` push                         | 전체 CI 통과 후 Railway 배포         | production   |
| 그 외 `feature/*` 직접 push         | 실행 안 함                           | 배포 안 함   |

Sprint 3 작업은 `feature/sprint-3-content-platform`에서 통합합니다. 현재는 로컬 통합 실행까지만 수행하고, 사용자 승인 전에는 `develop`, `main`, production을 변경하지 않습니다.

## GitHub Environment

저장소의 Settings → Environments에서 `staging`과 `production`을 만든다. 두 Environment에는 동일한 이름으로 각 Railway 환경에 맞는 값을 설정한다.

### Secret

| 이름            | 설명                                                             |
| --------------- | ---------------------------------------------------------------- |
| `RAILWAY_TOKEN` | Railway 프로젝트의 해당 환경에서 발급한 project-scoped 배포 토큰 |

Account 또는 Workspace 전체 권한을 가진 `RAILWAY_API_TOKEN` 대신 환경 범위가 제한된 Project Token을 사용한다. 토큰은 저장소 파일이나 Railway CLI 인자에 직접 기록하지 않는다.

### Variables

| 이름                      | 예시                             | 설명                                |
| ------------------------- | -------------------------------- | ----------------------------------- |
| `RAILWAY_SERVICE_ID`      | Railway service UUID             | CLI가 배포할 Nuxt 서비스            |
| `RAILWAY_HEALTHCHECK_URL` | `https://example.up.railway.app` | 배포 후 외부 상태를 확인할 공개 URL |

`RAILWAY_HEALTHCHECK_URL`에는 마지막 `/`가 있어도 된다. 워크플로우가 `/api/health`를 붙이기 전에 제거한다.

## Railway 설정

루트의 `railway.json`은 다음 운영 설정을 코드로 관리한다.

- 루트 `Dockerfile`을 사용한 이미지 빌드
- `/api/health` 배포 healthcheck
- 300초 healthcheck 제한
- 실패 시 최대 3회 재시작

Railway는 런타임에 `PORT`를 주입하며 애플리케이션은 이 값을 listen port로 사용한다. 배포 과정에서 Railway 자체 healthcheck가 성공한 뒤, GitHub Actions가 공개 URL을 최대 5분 동안 다시 확인한다.

## 브랜치 보호 권장값

Sprint 3 통합 브랜치, `develop`, `main`에는 직접 push하지 않고 Pull Request를 사용합니다. 보호 규칙에는 다음 check를 필수로 지정합니다.

- `Code quality`
- `Infrastructure integration`
- `End-to-end quality`
- `Docker build`

`production` GitHub Environment에는 필요할 경우 배포 승인자를 추가한다. 개인 저장소에서 승인자를 본인 한 명으로 제한하면 self-review 정책 때문에 배포가 막힐 수 있으므로 실제 협업자가 생긴 뒤 적용한다.

## 장애 확인

배포가 실패하면 GitHub Actions에서 다음 순서로 확인한다.

1. `Validate deployment configuration`에서 Secret과 Variable 누락 여부 확인
2. `Deploy application`에서 Railway 빌드·배포 로그 확인
3. Railway 서비스 설정에서 `/api/health`와 `PORT` 확인
4. `Verify deployed service`에서 공개 URL과 HTTPS 응답 확인

GitHub Actions의 healthcheck가 실패하더라도 Railway의 이전 정상 배포는 자동으로 삭제하지 않는다. Railway 대시보드에서 새 배포 상태를 확인하고 필요하면 이전 버전으로 rollback한다.

도메인·Proxy·DNSSEC 설정과 복구 순서는 [Railway·Cloudflare 도메인 운영 Runbook](./deployment-runbook.md)을 따른다.
