<script setup lang="ts">
defineProps<{ current: number; total: number }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav aria-label="페이지 탐색" class="flex min-h-11 items-center gap-2">
    <button
      type="button"
      class="s3-control min-w-23 bg-surface px-4 text-sm disabled:opacity-40"
      :disabled="current <= 1"
      @click="emit('change', current - 1)"
    >
      ‹ 이전</button
    ><span
      class="inline-flex size-11 items-center justify-center rounded-[var(--s3-radius-control)] bg-accent font-mono text-sm"
      :aria-label="`${total}페이지 중 ${current}페이지`"
      >{{ current }}</span
    ><span aria-hidden="true" class="font-mono text-xs text-ink-muted">/ {{ total }}</span
    ><button
      type="button"
      class="s3-control min-w-23 bg-surface px-4 text-sm disabled:opacity-40"
      :disabled="current >= total"
      @click="emit('change', current + 1)"
    >
      다음 ›
    </button>
  </nav>
</template>
