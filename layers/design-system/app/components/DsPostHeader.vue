<script setup lang="ts">
defineProps<{
  author: string
  date: string
  description: string
  eyebrow: string
  readingTime: string
  title: string
}>()
</script>

<template>
  <header class="s3-panel flex flex-col gap-3 p-7">
    <p class="font-mono text-xs font-semibold">{{ eyebrow }}</p>
    <h1 class="font-display text-4xl leading-none font-bold text-ink tablet:text-5xl">
      {{ title }}
    </h1>
    <p class="max-w-3xl text-base leading-7 text-ink">{{ description }}</p>
    <p class="font-mono text-[11px] text-ink-muted">
      {{ author }} · {{ date }} · {{ readingTime }}
    </p>
  </header>
</template>
