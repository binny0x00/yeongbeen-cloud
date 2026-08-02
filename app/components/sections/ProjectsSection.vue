<script setup lang="ts">
import type { GitHubRepositoriesResponse } from '#shared/types/github'

const projects = [
  {
    category: 'PERSONAL PLATFORM',
    description:
      'Nuxt와 TypeScript를 기반으로 디자인 시스템, 기술 기록, 프로젝트 아카이브, 접근성, CI/CD를 통합한 개인 개발 플랫폼입니다.',
    index: 1,
    repositoryName: 'yeongbeen-cloud',
    tags: ['NUXT', 'TYPESCRIPT', 'CI/CD'],
    title: 'YEONGBEEN CLOUD',
    to: '/projects/yeongbeen-cloud',
  },
  {
    category: 'TEAM PROJECT',
    description:
      '발표 편집·리허설·분석 리포트를 하나의 흐름으로 연결하고 공통 컴포넌트와 명확한 정보 구조로 복잡한 사용자 경험을 정리했습니다.',
    index: 2,
    repositoryName: undefined,
    tags: ['REACT', 'TYPESCRIPT', 'REST API'],
    title: 'ORBIT',
    to: '/projects/orbit',
  },
]

const { data, error, refresh, status } = await useFetch<GitHubRepositoriesResponse>(
  '/api/github/repositories',
  { key: 'github-repositories' },
)

const repositoriesByName = computed(
  () => new Map(data.value?.repositories.map(repository => [repository.name, repository]) ?? []),
)
</script>

<template>
  <section
    id="projects"
    aria-labelledby="projects-title"
    class="flex w-full scroll-mt-8 flex-col items-start gap-6 desktop:gap-8"
  >
    <h2 id="projects-title" class="sr-only">Featured Projects</h2>
    <SectionLabel :index="3" label="FEATURED PROJECTS" />

    <div aria-live="polite" class="w-full">
      <p v-if="status === 'pending'" class="type-mono-sm text-ink-muted">GITHUB DATA / LOADING</p>
      <div
        v-else-if="error"
        class="flex flex-wrap items-center justify-between gap-3 border-t border-border py-4"
        role="alert"
      >
        <p class="type-body-sm text-ink-muted">GitHub 저장소 정보를 불러오지 못했습니다.</p>
        <button
          type="button"
          class="type-label cursor-pointer underline-offset-4 hover:text-ink-accent hover:underline"
          @click="refresh()"
        >
          RETRY
        </button>
      </div>
      <p
        v-else-if="data && data.repositories.length === 0"
        class="type-body-sm border-t border-border py-4 text-ink-muted"
      >
        표시할 공개 GitHub 저장소가 없습니다.
      </p>
    </div>

    <ProjectCard
      v-for="project in projects"
      :key="project.title"
      :category="project.category"
      :description="project.description"
      :index="project.index"
      :repository="
        project.repositoryName ? repositoriesByName.get(project.repositoryName) : undefined
      "
      :tags="project.tags"
      :title="project.title"
      :to="project.to"
    />
  </section>
</template>
