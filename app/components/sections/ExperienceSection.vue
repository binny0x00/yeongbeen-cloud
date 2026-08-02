<script setup lang="ts">
interface ExperienceItem {
  description: string
  period: string
  technologies: string[]
  title: string
  to?: string
}

const experiences: ExperienceItem[] = [
  {
    description:
      '발표 편집기와 리허설·리포트 화면을 개발했습니다. 복잡한 분석 결과의 우선순위를 재정의하고 공통 카드와 차트 패턴을 설계해 정보 구조와 유지보수성을 함께 개선했습니다.',
    period: '2025 — PRESENT',
    technologies: ['REACT', 'TYPESCRIPT', 'REST API', 'DESIGN SYSTEM'],
    title: 'Frontend Engineer · Orbit',
    to: '/projects/orbit',
  },
  {
    description:
      '포트폴리오와 기술 기록을 하나의 개인 개발 플랫폼으로 설계했습니다. Nuxt와 TypeScript 기반 UI, Docker 이미지, GitHub Actions, Railway 배포와 Cloudflare DNS까지 실제 운영 흐름을 연결합니다.',
    period: '2026',
    technologies: ['NUXT', 'VUE', 'TYPESCRIPT', 'DOCKER', 'RAILWAY', 'CLOUDFLARE'],
    title: 'Builder · Yeongbeen Cloud',
    to: '/projects/yeongbeen-cloud',
  },
  {
    description:
      '자료구조와 알고리즘, 운영체제, 네트워크를 집중적으로 학습하고 C 기반 시스템 프로젝트를 수행했습니다. 화면 구현을 넘어 요청 흐름과 메모리, 동시성까지 이해하는 기반을 다졌습니다.',
    period: '2024 — 2025',
    technologies: ['C', 'PINTOS', 'NETWORK', 'DATA STRUCTURES', 'ALGORITHMS'],
    title: 'Trainee · KRAFTON JUNGLE',
  },
]
</script>

<template>
  <section
    id="experience"
    aria-labelledby="experience-title"
    class="flex w-full scroll-mt-8 flex-col items-start gap-7"
  >
    <SectionEyebrow label="EXPERIENCE" class="-ml-4" />

    <h2
      id="experience-title"
      class="type-display-mobile text-ink desktop:text-[var(--font-size-display-lg)] desktop:leading-[var(--line-height-display-lg)] desktop:tracking-[var(--letter-spacing-display-lg)]"
    >
      WHERE I LEARNED<span class="block">TO BUILD FOR REAL.</span>
    </h2>

    <ol class="w-full">
      <ExperienceRow
        v-for="experience in experiences"
        :key="experience.title"
        v-bind="experience"
      />
    </ol>

    <UiTextLink to="/resume" show-arrow>VIEW FULL RÉSUMÉ</UiTextLink>
  </section>
</template>
