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
      '5개월 합숙형 CS 기반 AI-Native 교육과정을 수료했습니다. 5인 팀으로 발표자료 생성부터 리허설 코칭·실전 발표 분석까지 지원하는 AI 프레젠테이션 플랫폼을 개발하고 발표회와 포스트세션을 진행했습니다.',
    period: '2026.03 — 2026.07',
    technologies: [
      'TYPESCRIPT',
      'REACT',
      'KONVA',
      'NESTJS',
      'POSTGRESQL',
      'REDIS',
      'FASTAPI',
      'DOCKER',
    ],
    title: 'SW-AI Lab 12기 · KRAFTON JUNGLE',
    to: '/projects/orbit',
  },
  {
    description:
      'Android 앱 개발 교육을 이수하고 5인 팀으로 잃어버린 반려동물 제보와 발견 정보를 공유하는 위치 기반 서비스를 개발했습니다. 카카오테크캠퍼스 2기 팀 프로젝트 최우수상을 수상했습니다.',
    period: '2024.04 — 2024.11',
    technologies: ['ANDROID', 'KOTLIN', 'COROUTINE', 'HILT', 'ROOM', 'RETROFIT', 'KAKAO MAP SDK'],
    title: 'Android Track 2기 · KAKAO TECH CAMPUS',
    to: '/projects/lost-pet-service',
  },
  {
    description:
      '의공학을 주전공, 컴퓨터정보통신공학을 복수전공했습니다. 졸업논문으로 블록체인 기반 부동산 계약 시스템 AnB를 개발해 교내 2025 하계 NCCOSS 경진대회 우수상을 수상했습니다.',
    period: '2019.03 — 2025.08',
    technologies: ['TYPESCRIPT', 'EXPRESS', 'TYPEORM', 'POSTGRESQL', 'ETHERS', 'STRIPE', 'DOCKER'],
    title: '의공학과 · 컴퓨터정보통신공학과 · 전남대학교',
    to: '/projects/anb',
  },
  {
    description:
      '프론트엔드 개발자로 금융 멀티 시뮬레이션 플랫폼을 제작했습니다. 9oormthonUNIV 시즌톤 본선에 진출하고 Figma 특별상을 수상했습니다.',
    period: '2025.08 — 2025.09',
    technologies: ['FLUTTER', 'DART', 'RIVERPOD', 'FREEZED', 'GOROUTER', 'FIREBASE', 'LOTTIE'],
    title: 'Frontend · 9oormthonUNIV 4기',
    to: '/projects/finance-simulator',
  },
  {
    description:
      '4인 팀으로 AI 기반 다크투어리즘 가이드 앱을 개발했습니다. APAC Solution Challenge 2025에 출품하고 호남 ICT 지원사업에 선정됐습니다.',
    period: '2025.04 — 2025.05',
    technologies: ['FLUTTER', 'DART', 'FIREBASE AUTH', 'CRASHLYTICS'],
    title: 'Frontend · GDG on Campus',
    to: '/projects/dark-tourism-guide',
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
