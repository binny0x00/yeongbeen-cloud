<script setup lang="ts">
const projects = [
  {
    category: 'PERSONAL PLATFORM',
    description:
      'Nuxt와 TypeScript를 기반으로 디자인 시스템, 기술 기록, 프로젝트 아카이브, 접근성, CI/CD를 통합한 개인 개발 플랫폼입니다.',
    index: 1,
    tags: ['NUXT', 'TYPESCRIPT', 'CI/CD'],
    title: 'YEONGBEEN CLOUD',
    to: '/projects/yeongbeen-cloud',
  },
  {
    category: 'TEAM PROJECT',
    description:
      '발표 편집·리허설·분석 리포트를 하나의 흐름으로 연결하고 공통 컴포넌트와 명확한 정보 구조로 복잡한 사용자 경험을 정리했습니다.',
    index: 2,
    tags: ['REACT', 'TYPESCRIPT', 'REST API'],
    title: 'ORBIT',
    to: '/projects/orbit',
  },
]
</script>

<template>
  <section
    id="projects"
    aria-labelledby="projects-title"
    class="flex w-full scroll-mt-8 flex-col items-start gap-6 desktop:gap-8"
  >
    <h2 id="projects-title" class="sr-only">Featured Projects</h2>
    <SectionLabel :index="3" label="FEATURED PROJECTS" />
    <ProjectCard v-for="project in projects" :key="project.title" v-bind="project" />
  </section>
</template>
