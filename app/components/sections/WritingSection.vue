<script setup lang="ts">
interface ArticleSummary {
  description: string
  mobileDescription: string
  mobileTitle: string
  status: string
  title: string
  to: string
}

const articles: ArticleSummary[] = [
  {
    description: '정보 우선순위와 공통 API를 먼저 정의해 화면 복잡도를 줄인 과정을 기록합니다.',
    mobileDescription: '정보 우선순위와 공통 API를 정의한 과정입니다.',
    mobileTitle: '재사용 가능한 리포트 카드 설계하기',
    status: 'PLANNED 01',
    title: 'React에서 재사용 가능한 리포트 카드 설계하기',
    to: '/writing/reusable-report-card',
  },
  {
    description: '정적 타입과 런타임 검증을 함께 사용해 신뢰할 수 없는 데이터를 다루는 방법입니다.',
    mobileDescription: '정적 타입과 런타임 검증을 함께 사용하는 방법입니다.',
    mobileTitle: 'TypeScript로 API 응답 경계 안전하게 만들기',
    status: 'PLANNED 02',
    title: 'TypeScript로 API 응답 경계를 안전하게 만들기',
    to: '/writing/safe-api-boundary',
  },
  {
    description: '개발 환경의 차이를 줄이고 main 브랜치의 배포 가능 상태를 유지하는 CI 흐름입니다.',
    mobileDescription: 'main 브랜치의 배포 가능 상태를 유지하는 CI 흐름입니다.',
    mobileTitle: 'Docker와 GitHub Actions로 빌드 검증하기',
    status: 'PLANNED 03',
    title: 'Docker와 GitHub Actions로 빌드 검증 자동화하기',
    to: '/writing/docker-github-actions',
  },
]
</script>

<template>
  <section
    id="writing"
    aria-labelledby="writing-title"
    class="flex w-full scroll-mt-8 flex-col items-start gap-4 desktop:gap-6"
  >
    <h2 id="writing-title" class="sr-only">Recent Writing</h2>
    <SectionEyebrow label="ENGINEERING NOTES" mobile-label="NOTES" class="-ml-4" />

    <ol class="w-full">
      <li v-for="article in articles" :key="article.to">
        <ArticleRow v-bind="article" />
      </li>
    </ol>
  </section>
</template>
