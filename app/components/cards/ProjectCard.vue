<script setup lang="ts">
import type { GitHubRepositorySummary } from '#shared/types/github'

withDefaults(
  defineProps<{
    category: string
    description: string
    index: number
    repository?: GitHubRepositorySummary
    tags: string[]
    title: string
    to: string
  }>(),
  {
    repository: undefined,
  },
)

function formatIndex(index: number) {
  return String(index).padStart(2, '0')
}
</script>

<template>
  <article
    class="flex w-full flex-col items-start gap-6 rounded-lg bg-inverse p-6 text-ink-inverse shadow-float desktop:p-12"
  >
    <p class="type-mono-sm text-ink-accent">{{ formatIndex(index) }} / {{ category }}</p>
    <h3 class="type-heading-lg w-full">{{ title }}</h3>
    <p class="type-body-lg w-full">{{ description }}</p>
    <ul class="flex flex-wrap gap-2" aria-label="사용 기술">
      <li v-for="tag in tags" :key="tag">
        <UiTag>{{ tag }}</UiTag>
      </li>
    </ul>
    <dl
      v-if="repository"
      class="type-mono-sm flex w-full flex-wrap gap-x-5 gap-y-2 border-t border-white/20 pt-4 text-ink-inverse"
      aria-label="GitHub 저장소 정보"
    >
      <div class="flex gap-1">
        <dt>STARS</dt>
        <dd>{{ repository.stars }}</dd>
      </div>
      <div class="flex gap-1">
        <dt>FORKS</dt>
        <dd>{{ repository.forks }}</dd>
      </div>
      <div v-if="repository.language" class="flex gap-1">
        <dt>LANGUAGE</dt>
        <dd>{{ repository.language }}</dd>
      </div>
    </dl>
    <NuxtLink :to="to" class="type-label underline-offset-4 hover:text-ink-accent hover:underline">
      VIEW CASE STUDY&nbsp; ↗
    </NuxtLink>
  </article>
</template>
