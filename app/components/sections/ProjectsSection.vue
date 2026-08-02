<script setup lang="ts">
const projects = [
  {
    category: 'FRONTEND ENGINEERING · TEAM PROJECT',
    description:
      '발표 편집·리허설·분석을 연결한 웹 서비스입니다. 복잡한 리포트 정보를 재구성하고 재사용 가능한 카드·차트 패턴을 설계했습니다.',
    index: 1,
    tags: ['REACT', 'TYPESCRIPT', 'REST API'],
    title: 'ORBIT',
    to: '/projects/orbit',
  },
  {
    category: 'PRODUCT DESIGN · FULL-STACK DELIVERY',
    description:
      '개발 기록과 프로젝트를 통합한 개인 플랫폼입니다. AI 보조 개발을 활용하되 Docker 빌드, CI/CD, Railway와 Cloudflare 운영까지 직접 검증합니다.',
    index: 2,
    tags: ['NUXT', 'TYPESCRIPT', 'DOCKER', 'RAILWAY'],
    title: 'YEONGBEEN.CLOUD',
    titleLines: ['YEONGBEEN', '.CLOUD'],
    to: '/projects/yeongbeen-cloud',
  },
  {
    category: 'SYSTEM PROGRAMMING · KRAFTON JUNGLE',
    description:
      '교육용 운영체제의 스레드, 사용자 프로그램, 가상 메모리 기능을 구현하며 동시성과 메모리 관리의 기초를 코드로 검증했습니다.',
    index: 3,
    tags: ['C', 'THREADS', 'VIRTUAL MEMORY'],
    title: 'PINTOS',
    to: '/projects/pintos',
  },
]
</script>

<template>
  <section
    id="projects"
    aria-labelledby="projects-title"
    class="flex w-full scroll-mt-8 flex-col items-start gap-5"
  >
    <SectionEyebrow label="PROJECTS" class="-ml-4" />

    <h2 id="projects-title" class="type-display-lg">
      <span class="block">SELECTED</span>
      <span class="block">PROJECTS</span>
    </h2>

    <p class="type-handwritten -rotate-2 text-ink-accent">built, tested, shipped →</p>

    <div class="mt-2 flex w-full flex-col" aria-label="선정 프로젝트">
      <ProjectCard
        v-for="project in projects"
        :key="project.title"
        :category="project.category"
        :description="project.description"
        :index="project.index"
        :tags="project.tags"
        :title="project.title"
        :title-lines="project.titleLines"
        :to="project.to"
      />
    </div>
  </section>
</template>
