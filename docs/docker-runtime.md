# Docker 운영 런타임

Dockerfile은 세 target을 제공합니다.

- `tooling`: migration, seed, one-shot worker
- `build`: Nuxt production build
- `runtime`: `.output`만 포함하고 비권한 `node` 사용자로 실행

```bash
docker build --target runtime -t yeongbeen-cloud:local .
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:3000/api/ready
```

Compose의 `migrate`가 PostgreSQL 준비 후 migration과 seed를 마쳐야 `web`이 시작됩니다. PostgreSQL과 Redis는 healthcheck와 영속 volume을 사용합니다.

| 변수                   | 기본값                                             | 설명                      |
| ---------------------- | -------------------------------------------------- | ------------------------- |
| `PORT`                 | `3000`                                             | 공개·Nitro listen port    |
| `COMPOSE_DATABASE_URL` | `postgresql://postgres:postgres@postgres:5432/...` | 컨테이너용 DB override    |
| `COMPOSE_REDIS_URL`    | `redis://redis:6379`                               | 컨테이너용 Redis override |
| `BETTER_AUTH_URL`      | `http://localhost:3000`                            | 로컬 인증 origin          |
| `BETTER_AUTH_SECRET`   | 로컬 전용 안전 기본값                              | staging 전 반드시 교체    |
| `NUXT_PUBLIC_SITE_URL` | `http://localhost:3000`                            | 로컬 canonical origin     |

호스트의 `DATABASE_URL`을 그대로 컨테이너에 주입하면 `127.0.0.1`이 컨테이너 자신을 가리킬 수 있으므로 Compose 전용 override 이름을 사용합니다. 실제 secret은 이미지에 포함하지 않습니다.

```bash
PORT=8080 BETTER_AUTH_URL=http://localhost:8080 docker compose up -d --build
docker compose --profile operations run --rm operations
docker compose down
```

`GET /api/health`는 프로세스 liveness, `GET /api/ready`는 PostgreSQL·Redis readiness를 반환합니다.
