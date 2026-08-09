<script setup lang="ts">
withDefaults(defineProps<{ description: string; loading?: boolean; title: string }>(), {
  loading: false,
})
</script>

<template>
  <section
    class="s3-panel flex min-h-55 flex-col items-center justify-center gap-3 p-8 text-center"
    :aria-busy="loading"
  >
    <span
      class="flex size-12 items-center justify-center rounded-full bg-canvas font-display text-xl"
      aria-hidden="true"
      >{{ loading ? '···' : '—' }}</span
    >
    <h2 class="font-display text-xl font-bold">{{ title }}</h2>
    <p class="text-sm text-ink-muted">{{ description }}</p>
    <div class="min-h-11"><slot /></div>
  </section>
</template>
