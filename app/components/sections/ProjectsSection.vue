<script setup lang="ts">
const projects = [
  {
    category: 'AI PRESENTATION PLATFORM · 5-PERSON TEAM',
    description:
      'React·Konva 기반 슬라이드 편집 기능과 편집 명령을 모듈화하고, checkpoint·path 저장 구조와 버전 검증 lock으로 편집 데이터 충돌을 방지했습니다.',
    index: 1,
    outcome: '버전 검증 lock으로 편집 데이터 충돌 방지',
    outcomeLabel: 'ENGINEERING',
    tags: ['REACT', 'TYPESCRIPT', 'KONVA', 'NESTJS', 'REDIS', 'FASTAPI'],
    title: 'ORBIT',
    to: '/projects/orbit',
  },
  {
    category: 'PERSONAL PLATFORM · DESIGN TO OPERATIONS',
    description:
      '개발 기록과 프로젝트를 통합한 개인 플랫폼입니다. AI 보조 개발을 활용하되 Docker 빌드, CI/CD, Railway와 Cloudflare 운영까지 직접 검증합니다.',
    index: 2,
    outcome: 'CI/CD · Railway · Cloudflare production 운영',
    outcomeLabel: 'OPERATIONS',
    tags: ['VUE', 'NUXT', 'TYPESCRIPT', 'DOCKER', 'RAILWAY', 'CLOUDFLARE'],
    title: 'YEONGBEEN.CLOUD',
    titleLines: ['YEONGBEEN', '.CLOUD'],
    to: '/projects/yeongbeen-cloud',
  },
  {
    category: 'ANDROID · KAKAO TECH CAMPUS',
    description:
      '잃어버린 반려동물 제보와 발견 정보를 쉽게 공유하는 위치 기반 서비스를 개발해 카카오테크캠퍼스 2기 팀 프로젝트 최우수상을 수상했습니다.',
    index: 3,
    outcome: '카카오테크캠퍼스 2기 팀 프로젝트 최우수상',
    outcomeLabel: 'AWARD',
    tags: ['KOTLIN', 'COROUTINE', 'HILT', 'ROOM', 'RETROFIT', 'KAKAO MAP SDK'],
    title: 'LOST PET SERVICE',
    titleLines: ['LOST PET', 'SERVICE'],
    to: '/projects/lost-pet-service',
  },
  {
    category: 'BACKEND · BLOCKCHAIN · GRADUATION PROJECT',
    description:
      '계약 요청·승인·지갑 서명·결제 API를 구축하고, ethers로 스마트컨트랙트 상태와 PostgreSQL 계약 데이터를 연결한 부동산 계약 시스템입니다.',
    index: 4,
    outcome: '교내 2025 하계 NCCCOSS 경진대회 우수상',
    outcomeLabel: 'AWARD',
    tags: ['TYPESCRIPT', 'EXPRESS', 'TYPEORM', 'POSTGRESQL', 'ETHERS', 'STRIPE', 'DOCKER'],
    title: 'ANB',
    to: '/projects/anb',
  },
  {
    category: 'FLUTTER · 9OORMTHONUNIV',
    description:
      '금융 멀티 시뮬레이션 플랫폼의 프론트엔드를 개발해 시즌톤 본선에 진출하고 Figma 특별상을 수상했습니다.',
    index: 5,
    outcome: '시즌톤 본선 진출 · Figma 특별상',
    outcomeLabel: 'AWARD',
    tags: ['FLUTTER', 'RIVERPOD', 'FREEZED', 'GOROUTER', 'FIREBASE', 'LOTTIE'],
    title: 'FINANCE SIMULATOR',
    titleLines: ['FINANCE', 'SIMULATOR'],
    to: '/projects/finance-simulator',
  },
  {
    category: 'FLUTTER · GDG ON CAMPUS',
    description:
      'AI 기반 다크투어리즘 가이드 앱을 개발해 APAC Solution Challenge 2025에 출품하고 호남 ICT 지원사업에 선정됐습니다.',
    index: 6,
    outcome: '호남 ICT 지원사업 선정',
    outcomeLabel: 'SELECTION',
    tags: ['FLUTTER', 'DART', 'FIREBASE AUTH', 'CRASHLYTICS'],
    title: 'DARK TOUR GUIDE',
    titleLines: ['DARK TOUR', 'GUIDE'],
    to: '/projects/dark-tourism-guide',
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
        :outcome="project.outcome"
        :outcome-label="project.outcomeLabel"
        :tags="project.tags"
        :title="project.title"
        :title-lines="project.titleLines"
        :to="project.to"
      />
    </div>
  </section>
</template>
