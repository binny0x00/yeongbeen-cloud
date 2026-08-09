<script setup lang="ts">
defineProps<{ items: Array<{ label: string; to?: string }> }>()
</script>

<template>
  <nav aria-label="현재 위치">
    <ol class="flex min-h-11 flex-wrap items-center gap-2 text-sm">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="flex items-center gap-2"
      >
        <span v-if="index" aria-hidden="true" class="font-mono text-xs">›</span
        ><NuxtLink v-if="item.to" :to="item.to" class="hover:underline">{{ item.label }}</NuxtLink
        ><span v-else aria-current="page" class="text-ink-muted">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
