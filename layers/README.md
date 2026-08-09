# Sprint 3 모듈 경계

각 Nuxt Layer는 `presentation → application → domain` 방향으로만 의존합니다. Application은 외부 시스템을 직접 알지 않고 `ports`의 인터페이스를 사용하며, `infrastructure`가 Port를 구현합니다.

```text
layers/<module>/
├─ app/                     # Vue presentation
├─ server/api/              # 얇은 Nitro adapter
├─ application/             # use case와 transaction orchestration
├─ domain/                  # entity, value object, policy
├─ ports/                   # repository/service interface
└─ infrastructure/          # database, auth, cache, external API adapter
```

Domain에서 Nuxt, Vue, 데이터베이스 ORM, 브라우저 API, Infrastructure를 import하면 ESLint가 실패합니다. 모듈 간 호출은 공개 Application service 또는 Port 계약을 통해서만 수행합니다.
