<script setup lang="ts">
defineProps<{
  date: string
  description: string
  index: number
  readingTime?: string
  title: string
  to: string
}>()
</script>

<template>
  <article class="border-b border-border bg-surface">
    <NuxtLink
      :to="to"
      class="grid min-h-28 items-center gap-4 px-6 py-5 hover:bg-canvas tablet:grid-cols-[2rem_1fr_auto]"
      ><span class="font-mono text-xs">{{ String(index).padStart(2, '0') }}</span
      ><span class="min-w-0"
        ><strong class="block font-display text-xl text-ink">{{ title }}</strong
        ><span class="mt-1 block text-sm text-ink-muted">{{ description }}</span></span
      ><span class="font-mono text-[11px] text-ink-muted"
        >{{ date }}<template v-if="readingTime"> · {{ readingTime }}</template></span
      ></NuxtLink
    >
  </article>
</template>
