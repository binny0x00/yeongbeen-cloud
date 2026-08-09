# Sprint 3 환경 설정

실제 비밀값은 저장소와 Markdown에 기록하지 않습니다. 로컬은 `.env`, GitHub는 `staging`/`production` Environment Secrets, Railway는 서비스 Variables에만 저장합니다. `.env.example`은 키 이름과 안전한 기본값만 제공합니다.

## 공통 설정 절차

1. 아래 발급처에서 최소 권한 키를 만든다.
2. 로컬 `.env`와 대상 환경의 Secret/Variable에 같은 이름으로 등록한다.
3. `pnpm config:check`와 `/api/ready`로 연결을 확인한다.
4. 노출 의심 시 공급자에서 키를 먼저 폐기하고 새 키를 등록한 뒤 배포한다.

| 변수                                       | 발급 위치·최소 권한                            | 설정 위치                    | 검증·회전                                  |
| ------------------------------------------ | ---------------------------------------------- | ---------------------------- | ------------------------------------------ |
| `DATABASE_URL`                             | Railway PostgreSQL, 애플리케이션 DB 소유자     | 로컬/GitHub/Railway          | migration dry-run 후 새 자격 증명으로 교체 |
| `REDIS_URL`                                | Railway Redis, 해당 인스턴스 연결 전용         | 로컬/GitHub/Railway          | ping 확인 후 이전 연결 폐기                |
| `BETTER_AUTH_SECRET`                       | `openssl rand -base64 32`, 32바이트 이상       | 로컬/GitHub/Railway          | 세션 전체 만료를 감수하고 교체             |
| `BETTER_AUTH_URL`                          | 직접 지정, 배포 원본 URL                       | 로컬/GitHub/Railway          | `/api/auth/session` 원본 확인              |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth Web client                  | 로컬/GitHub/Railway          | 로그인 후 이전 secret 폐기                 |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth App                               | 로컬/GitHub/Railway          | 로그인 후 새 client secret 활성화          |
| `OWNER_EMAILS`                             | 운영자 이메일의 쉼표 구분 allowlist            | 로컬/GitHub/Railway          | 로그인 계정이 OWNER인지 확인               |
| `R2_ACCOUNT_ID`                            | Cloudflare account 식별자                      | 로컬/GitHub/Railway          | sign API healthcheck                       |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | R2 Object Read & Write, 지정 bucket만          | 로컬/GitHub/Railway          | 업로드·삭제 확인 후 이전 token 폐기        |
| `R2_BUCKET`, `R2_PUBLIC_BASE_URL`          | R2 bucket과 공개 custom domain                 | 로컬/GitHub/Railway          | 업로드 결과 HEAD 요청                      |
| `OPENAI_API_KEY`                           | OpenAI project service account, 해당 project만 | 로컬/GitHub/Railway          | AI assist smoke test 후 이전 key 폐기      |
| `OPENAI_MODEL`                             | 기본값 `gpt-5.6-terra`                         | 로컬/GitHub/Railway          | model 응답과 usage log 확인                |
| `OPENAI_INPUT_COST_USD_PER_MILLION`        | 선택값, 대상 모델의 입력 100만 토큰 USD 단가   | 로컬/GitHub/Railway Variable | 공식 가격 변경 시 갱신 후 비용 로그 확인   |
| `OPENAI_OUTPUT_COST_USD_PER_MILLION`       | 선택값, 대상 모델의 출력 100만 토큰 USD 단가   | 로컬/GitHub/Railway Variable | 공식 가격 변경 시 갱신 후 비용 로그 확인   |
| `NUXT_PUBLIC_SITE_URL`                     | 서비스 canonical origin                        | 로컬/GitHub/Railway Variable | canonical URL 확인                         |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY`           | Cloudflare Turnstile widget                    | 로컬/GitHub/Railway Variable | 브라우저 challenge 확인                    |
| `TURNSTILE_SECRET_KEY`                     | Cloudflare Turnstile server secret             | 로컬/GitHub/Railway Secret   | siteverify 후 이전 secret 폐기             |
| `CRON_SECRET`                              | 32바이트 이상 무작위 값                        | GitHub/Railway Secret        | 예약 발행 401/200 확인 후 교체             |

## OAuth callback URL

Google과 GitHub 양쪽에 환경별 callback을 정확히 등록합니다.

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
https://<staging-host>/api/auth/callback/google
https://<staging-host>/api/auth/callback/github
https://yeongbeen.cloud/api/auth/callback/google
https://yeongbeen.cloud/api/auth/callback/github
```

Production 값은 Sprint 3의 `main` 병합 승인이 내려진 뒤에만 활성화합니다.

AI 비용 단가 변수는 비밀값이 아니며 선택 설정입니다. 비어 있으면 토큰 사용량은 기록하되 추정 비용은 `null`로 보존합니다. 가격은 저장소에 고정하지 않고 배포 환경 변수로 관리해 모델 가격 변경에 대응합니다. AI 요청은 원문·생성문을 사용량 로그에 저장하지 않으며 `store:false`로 전송합니다.

`E2E_TESTING=1`은 GitHub Actions의 폐기 가능한 테스트 DB에서만 Turnstile을 대체하는 내부 플래그입니다. `.env.example`, Railway staging, production에는 설정하지 않습니다.
