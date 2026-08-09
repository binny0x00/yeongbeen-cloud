<script setup lang="ts">
import type { PublicContentItem } from '../../../shared/schemas/api/content'

const props = defineProps<{ item: PublicContentItem }>()
const localePath = useLocalePath()
const base = computed(() => (props.item.kind === 'POST' ? '/posts' : '/portfolio'))
const target = computed(() => localePath(`${base.value}/${props.item.slug}`))
</script>

<template>
  <article class="group border-t-2 border-ink py-6 last:border-b-2">
    <NuxtLink
      :to="target"
      class="flex min-h-11 flex-col gap-3 focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="type-label text-ink-muted">{{ item.kind }}</p>
        <time v-if="item.publishedAt" class="type-mono-sm text-ink-muted">
          {{ new Date(item.publishedAt).toLocaleDateString(item.locale) }}
        </time>
      </div>
      <h2 class="type-heading-lg transition-transform group-hover:translate-x-1">
        {{ item.title }}
      </h2>
      <p class="type-body-md max-w-[720px] text-ink-muted">{{ item.summary }}</p>
      <ul v-if="item.tags.length" class="flex flex-wrap gap-2" aria-label="태그">
        <li v-for="tag in item.tags" :key="tag">
          <DsBadge>{{ tag }}</DsBadge>
        </li>
      </ul>
    </NuxtLink>
  </article>
</template>
