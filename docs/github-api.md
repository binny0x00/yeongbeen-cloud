# GitHub REST API 연동

홈의 Featured Projects 섹션은 브라우저에서 GitHub를 직접 호출하지 않습니다. Nitro의 `/api/github/repositories`가 GitHub REST API 응답을 받아 화면에 필요한 공개 필드만 반환합니다.

## 환경변수

`.env.example`을 참고해 로컬 `.env` 또는 Railway Variables를 구성합니다.

```bash
NUXT_GITHUB_OWNER=binny0x00
NUXT_GITHUB_REPOSITORIES=yeongbeen-cloud
NUXT_GITHUB_TOKEN=
```

- `NUXT_GITHUB_OWNER`: 저장소 소유자
- `NUXT_GITHUB_REPOSITORIES`: 쉼표로 구분한 공개 저장소 이름
- `NUXT_GITHUB_TOKEN`: 선택 사항인 서버 전용 토큰

공개 저장소는 토큰 없이도 조회할 수 있습니다. 토큰을 사용한다면 fine-grained personal access token에 대상 저장소의 읽기 전용 Metadata 권한만 부여합니다. 토큰을 `NUXT_PUBLIC_` 환경변수나 클라이언트 코드에 넣지 않습니다.

## 응답 경계

서버는 GitHub 원본 응답에서 다음 필드만 반환합니다.

- 저장소 ID, 이름, 설명, URL, 홈페이지
- 주 언어, 별, 포크, 열린 이슈 수
- 토픽, 마지막 push 시각, archive 여부

## 캐시와 요청 제한

- Nitro cached event handler: 1시간
- HTTP `Cache-Control`: `max-age=3600`

GitHub의 비인증 REST 요청은 IP 기준 시간당 60회이며, 인증 요청은 일반적으로 시간당 5,000회입니다. `403` 또는 `429` 응답은 사이트 API의 `503`으로 변환하고 클라이언트에서 재시도 UI를 제공합니다.

참고 문서:

- [Get a repository](https://docs.github.com/en/rest/repos/repos#get-a-repository)
- [REST API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [REST API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)
