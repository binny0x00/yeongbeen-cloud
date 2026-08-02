# Railway·Cloudflare 도메인 운영 Runbook

`yeongbeen.cloud`의 요청이 Cloudflare를 거쳐 Railway의 Nuxt Docker 서비스에 도달하도록 구성하고, 배포·DNS 장애가 발생했을 때 안전하게 진단하고 되돌리는 절차를 정리한다.

## 목표 구성

```text
사용자
  ↓ HTTPS
Cloudflare — DNS, Proxy, CDN, Universal SSL, Redirect, DNSSEC
  ↓ HTTPS (SSL/TLS Full)
Railway — Nuxt Docker service
  ├─ /api/health
  └─ Postgres — private network
```

- 가비아는 도메인 등록기관과 갱신을 담당한다.
- Cloudflare는 authoritative DNS와 웹 Proxy를 담당한다.
- Railway는 애플리케이션 컨테이너와 PostgreSQL을 담당한다.
- Railway와 Cloudflare 대시보드에 표시되는 CNAME·TXT·DS 값은 예시로 대체하지 않고 그대로 복사한다.

## 0. 전환 전 준비

1. 가비아와 Cloudflare 계정에 MFA를 설정한다.
2. 가비아의 현재 네임서버, DNS 레코드, DNSSEC 상태를 캡처한다.
3. 기존 MX·TXT 등 웹 이외 레코드가 있다면 Cloudflare로 옮길 목록을 만든다.
4. 기존 DNSSEC 또는 DS 레코드가 있다면 먼저 해제하고 TTL 만료를 기다린다.
5. Railway의 `*.up.railway.app` 주소에서 `/api/health`가 HTTP 200인지 확인한다.

DNSSEC가 활성화된 채로 authoritative nameserver를 변경하면 기존 DS와 Cloudflare 키가 일치하지 않아 validating resolver에서 `SERVFAIL`이 발생할 수 있다. Cloudflare의 [full setup 절차](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)에 따라 이전 DNSSEC를 먼저 해제한다.

## 1. Railway 프로젝트와 서비스

### 환경

하나의 Railway 프로젝트에 다음 환경을 둔다.

| Git 브랜치 | Railway 환경 | GitHub Environment | 용도         |
| ---------- | ------------ | ------------------ | ------------ |
| `develop`  | staging      | staging            | 배포 전 검증 |
| `main`     | production   | production         | 실제 서비스  |

각 환경에 Nuxt 서비스가 같은 루트 `Dockerfile`과 `railway.json`을 사용하도록 설정한다. Railway 서비스는 플랫폼이 주입하는 `PORT`에서 요청을 받아야 한다.

### 최초 서비스 생성

1. Railway에서 `yeongbeen-cloud` 프로젝트를 생성한다.
2. production과 staging 환경을 만든다.
3. 각 환경에 Empty Service를 추가하고 이름을 `web`으로 지정한다.
4. Settings → Networking에서 Railway 제공 domain을 생성한다.
5. Settings → Variables에 필요한 Nuxt 런타임 환경변수를 추가한다.
6. 각 환경의 Project Token과 web Service ID를 GitHub Environment에 연결한다.

GitHub 설정값은 [CI/CD 문서](./ci-cd.md)를 따른다. Railway CLI 배포는 저장소의 `Dockerfile`을 감지해 이미지를 빌드하고, `railway.json`의 `/api/health`를 배포 healthcheck로 사용한다.

### PostgreSQL

Sprint 1 애플리케이션은 아직 데이터베이스를 사용하지 않으므로 무리하게 연결하지 않는다. 동적 기능을 시작할 때 각 Railway 환경에서 다음 순서로 추가한다.

1. Project canvas의 Create → Database → Add PostgreSQL을 선택한다.
2. staging과 production에 서로 다른 Postgres를 둔다.
3. web 서비스에 `DATABASE_URL=${{Postgres.DATABASE_URL}}` reference variable을 추가한다.
4. 애플리케이션은 외부 TCP Proxy가 아니라 Railway private network URL을 사용한다.
5. production은 Railway의 backup·restore 지원 범위와 보존 정책을 확인한 뒤 데이터를 저장한다.

Railway의 [PostgreSQL 서비스 가이드](https://docs.railway.com/databases/build-a-database-service)는 영속 볼륨과 private network 연결을 권장한다. 로컬 관리가 꼭 필요한 경우에만 제한적으로 TCP Proxy를 사용한다.

## 2. Cloudflare에 도메인 추가

1. Cloudflare에서 Add a domain을 선택하고 `yeongbeen.cloud`를 추가한다.
2. Free plan의 Primary DNS(full setup)를 선택한다.
3. 자동 스캔된 레코드를 검토하고 기존 웹·메일 레코드를 빠짐없이 보완한다.
4. Cloudflare가 배정한 nameserver 두 개를 기록한다.
5. 이 시점에는 Cloudflare DNSSEC를 활성화하지 않는다.

Cloudflare Free·Pro에서는 full setup이 기본이며, Cloudflare가 authoritative DNS가 되어야 Proxy·CDN 기능을 사용할 수 있다. 자세한 구조는 [Cloudflare Primary setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/)을 참고한다.

## 3. 가비아 네임서버 변경

1. My가비아 → 도메인 → 도메인 통합 관리툴로 이동한다.
2. `yeongbeen.cloud`를 선택하고 네임서버 설정을 연다.
3. 기존 가비아 네임서버를 제거한다.
4. Cloudflare가 배정한 두 nameserver를 오탈자 없이 입력한다.
5. 변경을 저장하고 Cloudflare zone 상태가 `Active`가 될 때까지 기다린다.

가비아의 메뉴 위치는 [가비아 도메인 연결 안내](https://customer.gabia.com/faq/detail/960/2340)를 기준으로 한다. 전파에는 최대 24시간 이상 걸릴 수 있으므로 중간에 nameserver를 반복 변경하지 않는다.

```bash
dig NS yeongbeen.cloud @1.1.1.1
dig NS yeongbeen.cloud @8.8.8.8
```

두 조회가 Cloudflare에서 배정한 nameserver만 반환해야 다음 단계로 진행한다.

## 4. Railway custom domain과 Cloudflare DNS

### Railway에서 domain 추가

1. Railway production web 서비스의 Settings → Networking → Public Networking으로 이동한다.
2. `+ Custom Domain`을 선택하고 `yeongbeen.cloud`를 입력한다.
3. target port는 Railway가 주입한 `PORT`를 사용하는 web 서비스로 선택한다.
4. Railway가 표시한 CNAME의 target과 TXT의 name·value를 복사한다.

### Cloudflare 레코드

Railway 대시보드가 보여준 실제 값을 사용한다.

| Type  | Name              | Content                | Proxy 상태           | 용도            |
| ----- | ----------------- | ---------------------- | -------------------- | --------------- |
| CNAME | `@`               | Railway가 제공한 CNAME | Proxied(주황색 구름) | 루트 웹 트래픽  |
| TXT   | Railway 제공 name | Railway 제공 value     | DNS Only             | 소유권 검증     |
| CNAME | `www`             | `@`                    | Proxied(주황색 구름) | redirect 진입점 |

Cloudflare는 apex CNAME을 자동 flattening한다. Railway의 [custom domain 가이드](https://docs.railway.com/networking/domains/working-with-domains)에 따라 CNAME과 TXT를 모두 등록한다. TXT가 없으면 CNAME이 해석되더라도 Railway가 소유권을 확인하지 못해 404를 반환할 수 있다.

Railway에 초록색 검증 표시와 `Cloudflare proxy detected`가 나타날 때까지 기다린다. 루트 domain만 Railway custom domain으로 등록하고 `www`는 Cloudflare에서 루트로 redirect하면 불필요한 custom domain 슬롯을 쓰지 않는다.

## 5. Proxy와 HTTPS

1. Cloudflare SSL/TLS → Overview에서 mode를 `Full`로 설정한다.
2. SSL/TLS → Edge Certificates에서 Universal SSL이 Active인지 확인한다.
3. 루트와 `www` CNAME의 Proxy를 활성화한다.
4. HTTPS가 정상 동작한 뒤 Always Use HTTPS를 활성화한다.

일반적인 origin에는 `Full (Strict)`가 더 안전하지만, Cloudflare Proxy 앞의 Railway custom domain은 Railway 공식 가이드에 따라 `Full`을 사용한다. `Flexible`은 Cloudflare와 Railway 사이를 암호화하지 않고 redirect loop를 만들 수 있으므로 사용하지 않는다.

## 6. www를 루트로 redirect

Cloudflare Rules → Redirect Rules에서 다음 규칙을 만든다.

- 조건: hostname이 `www.yeongbeen.cloud`
- 대상: `https://yeongbeen.cloud` + 기존 path
- status: `301`
- query string: 보존

Cloudflare의 [www → apex redirect 예시](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/)처럼 path와 query string을 보존한다.

```bash
curl --head https://www.yeongbeen.cloud/projects/example?from=www
```

응답은 301이고 `Location`은 `https://yeongbeen.cloud/projects/example?from=www`여야 한다.

## 7. DNSSEC 활성화

다음 조건을 모두 만족한 뒤 마지막으로 진행한다.

- Cloudflare zone이 Active다.
- 루트와 `www`가 HTTPS로 동작한다.
- Railway custom domain이 verified 상태다.
- 최소 한 번의 production 배포와 `/api/health` 검증이 끝났다.

1. Cloudflare DNS → Settings → DNSSEC에서 Enable을 선택한다.
2. Cloudflare가 생성한 DS의 key tag, algorithm, digest type, digest를 복사한다.
3. 가비아 도메인 통합 관리툴의 DNSSEC 설정에서 동일한 DS 정보를 등록한다.
4. Cloudflare의 DNSSEC 상태가 Active인지 확인한다.

```bash
dig +short DS yeongbeen.cloud
dig +dnssec yeongbeen.cloud @1.1.1.1
```

Cloudflare의 [DNSSEC 절차](https://developers.cloudflare.com/dns/dnssec/)처럼 nameserver 전환 전에 있던 DS를 재사용하지 않는다. 가비아는 일부 New gTLD의 DNSSEC 설정을 제한할 수 있으므로 `.cloud`의 DS 등록이 거부되면 값을 임의로 바꾸지 말고 가비아 고객센터에 확인한다.

## 8. 운영 검증 체크리스트

```bash
dig NS yeongbeen.cloud @1.1.1.1
dig A yeongbeen.cloud @1.1.1.1
dig TXT <Railway가_제공한_TXT_name> @1.1.1.1
curl --fail --show-error https://yeongbeen.cloud/api/health
curl --head https://yeongbeen.cloud
curl --head https://www.yeongbeen.cloud
```

- [ ] NS가 Cloudflare 두 개만 반환한다.
- [ ] Railway custom domain과 certificate가 정상이다.
- [ ] `/api/health`가 HTTP 200과 JSON을 반환한다.
- [ ] 루트 domain이 HTTPS로 열린다.
- [ ] `www`가 path와 query를 보존해 301 redirect한다.
- [ ] Cloudflare response header와 Railway 배포 로그를 확인할 수 있다.
- [ ] DNSSEC가 Active이며 validating resolver에서도 조회된다.

## 9. 장애 진단

| 증상               | 우선 확인할 항목                                       | 조치                                                      |
| ------------------ | ------------------------------------------------------ | --------------------------------------------------------- |
| `NXDOMAIN`         | Cloudflare zone Active, 가비아 NS, apex CNAME          | NS와 누락 레코드를 수정하고 TTL 전파를 기다린다.          |
| `SERVFAIL`         | 가비아 DS와 Cloudflare DNSSEC key                      | DNSSEC rollback 순서에 따라 기존 DS부터 제거한다.         |
| Railway 404        | Railway TXT와 domain verified 상태                     | TXT name·value를 그대로 복원하고 재검증한다.              |
| Cloudflare 525/526 | Proxy 상태와 SSL/TLS mode                              | Railway 구성에서는 `Full`인지 확인한다.                   |
| 502/503            | Railway deploy, container log, `PORT`, healthcheck     | Railway URL로 origin을 확인하고 이전 배포로 rollback한다. |
| redirect loop      | Flexible mode, Always Use HTTPS, 애플리케이션 redirect | SSL mode를 `Full`로 바꾸고 중복 redirect를 제거한다.      |
| GitHub CD 실패     | Environment Secret·Variable, Railway deploy log        | [CI/CD 장애 절차](./ci-cd.md#장애-확인)를 따른다.         |

Cloudflare 문제와 애플리케이션 문제를 구분하려면 먼저 Railway가 제공한 `*.up.railway.app/api/health`를 호출한다. 이 주소도 실패하면 Railway 배포를, 이 주소만 성공하면 Cloudflare DNS·Proxy·redirect를 조사한다.

## 10. 롤백

### 애플리케이션 배포

1. Railway에서 직전 정상 deployment를 확인한다.
2. 해당 deployment를 Redeploy한다.
3. Railway URL의 `/api/health`를 확인한다.
4. custom domain의 `/api/health`를 확인한다.

DNS는 바꾸지 않고 애플리케이션만 되돌리는 것이 가장 빠르고 영향 범위가 작다.

### Cloudflare Proxy 또는 DNS

1. 현재 CNAME·TXT·redirect 설정을 캡처한다.
2. Railway 제공 URL이 정상인지 먼저 확인한다.
3. 잘못 변경한 CNAME target 또는 redirect rule을 직전 값으로 복원한다.
4. Proxy 문제를 진단할 때는 잠시 DNS Only로 비교할 수 있지만, Railway의 `Cloudflare proxy detected`와 custom domain routing 상태를 함께 확인한다.
5. 정상화 후 Proxy를 다시 활성화하고 HTTPS를 검증한다.

### Nameserver

Cloudflare 전체 장애로 이전 DNS로 돌아가야 한다면 기존 DNS zone과 레코드가 그대로 남아 있을 때만 가비아 nameserver를 복원한다. 기존 zone을 삭제했다면 먼저 동일한 레코드를 복구한다.

DNSSEC가 활성화되어 있다면 순서가 중요하다.

1. 가비아에서 Cloudflare DS를 제거한다.
2. DS TTL이 충분히 만료될 때까지 Cloudflare zone signing을 유지한다.
3. `dig DS yeongbeen.cloud`가 빈 응답인지 확인한다.
4. 그 다음 nameserver를 변경하거나 Cloudflare DNSSEC를 비활성화한다.

Cloudflare의 [DNSSEC rollback 지침](https://developers.cloudflare.com/dns/dnssec/)과 반대로 Cloudflare 서명을 먼저 끄면 resolver에서 도메인이 해석되지 않을 수 있다.

## 변경 기록

실제 전환 시 아래 값을 Issue 또는 비밀정보가 없는 운영 로그에 기록한다.

| 항목                         | 기록값 |
| ---------------------------- | ------ |
| Railway project/environment  |        |
| Railway service ID 일부      |        |
| Railway domain verified 시각 |        |
| Cloudflare NS 전환 시각      |        |
| Universal SSL Active 시각    |        |
| production 첫 배포 commit    |        |
| DNSSEC Active 시각           |        |
| 최종 확인 담당자             |        |
