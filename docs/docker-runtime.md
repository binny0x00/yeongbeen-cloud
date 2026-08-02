# Docker 운영 런타임

Nuxt 애플리케이션은 multi-stage Dockerfile에서 빌드하고, 운영 이미지에는 Nitro의 `.output` 결과만 포함한다. 런타임 프로세스는 `node` 사용자로 실행한다.

## 이미지 빌드

```bash
docker build --target runtime -t yeongbeen-cloud:local .
```

## Compose 실행

기본 포트는 3000이다.

```bash
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:3000/api/health
```

다른 포트로 실행할 때는 `PORT`를 지정한다. 호스트와 컨테이너에서 같은 포트를 사용한다.

```bash
PORT=8080 docker compose up -d --build
curl http://127.0.0.1:8080/api/health
```

컨테이너를 종료할 때는 다음 명령을 사용한다.

```bash
docker compose down
```

## 환경변수

| 변수                       | 기본값                    | 설명                                             |
| -------------------------- | ------------------------- | ------------------------------------------------ |
| `HOST`                     | `0.0.0.0`                 | 컨테이너 외부 요청을 받기 위한 Nitro listen host |
| `PORT`                     | `3000`                    | Nitro listen port와 Compose 공개 port            |
| `NUXT_GITHUB_OWNER`        | `binny0x00`               | GitHub API에서 조회할 소유자                     |
| `NUXT_GITHUB_REPOSITORIES` | `yeongbeen-cloud`         | 쉼표로 구분한 저장소 목록                        |
| `NUXT_GITHUB_TOKEN`        | 빈 값                     | 선택적인 GitHub API 인증 토큰                    |
| `NUXT_PUBLIC_SITE_URL`     | `https://yeongbeen.cloud` | canonical·Open Graph 기준 URL                    |

비밀값은 이미지에 포함하지 않고 Railway 또는 로컬 실행 환경에서 런타임 환경변수로 주입한다.

## 상태 확인

`GET /api/health`는 외부 API나 데이터베이스에 의존하지 않고 프로세스가 요청에 응답할 수 있는지 확인한다.

```json
{
  "status": "ok",
  "timestamp": "2026-08-02T00:00:00.000Z"
}
```

Docker와 Compose는 이 endpoint를 사용해 컨테이너 상태를 판정한다.
