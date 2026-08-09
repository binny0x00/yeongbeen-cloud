<script setup lang="ts">
defineProps<{ homeLabel: string; homeTo: string }>()
</script>

<template>
  <header
    class="flex min-h-16 items-center justify-between border-b border-border bg-canvas px-[var(--layout-page-gutter)]"
  >
    <NuxtLink :to="homeTo" class="font-mono text-xs font-semibold">{{ homeLabel }}</NuxtLink>
    <nav class="flex min-h-11 items-center gap-5" aria-label="주요 메뉴"><slot /></nav>
    <div class="flex min-h-11 items-center gap-2"><slot name="actions" /></div>
  </header>
</template>
