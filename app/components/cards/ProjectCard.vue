<script setup lang="ts">
defineProps<{
  category: string
  description: string
  index: number
  tags: string[]
  title: string
  to: string
}>()

function formatIndex(index: number) {
  return String(index).padStart(2, '0')
}
</script>

<template>
  <article
    class="flex w-full flex-col items-start gap-6 rounded-lg bg-inverse p-12 text-ink-inverse shadow-float"
  >
    <p class="type-mono-sm text-ink-accent">{{ formatIndex(index) }} / {{ category }}</p>
    <h3 class="type-heading-lg w-full">{{ title }}</h3>
    <p class="type-body-lg w-full">{{ description }}</p>
    <ul class="flex flex-wrap gap-2" aria-label="사용 기술">
      <li v-for="tag in tags" :key="tag">
        <UiTag>{{ tag }}</UiTag>
      </li>
    </ul>
    <NuxtLink :to="to" class="type-label underline-offset-4 hover:text-ink-accent hover:underline">
      VIEW CASE STUDY&nbsp; ↗
    </NuxtLink>
  </article>
</template>
