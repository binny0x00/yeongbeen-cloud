<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'neutral' | 'accent' | 'inverse' }>(), { tone: 'neutral' })
</script>

<template>
  <span
    class="inline-flex min-h-7 items-center rounded-full px-3 font-mono text-[11px] font-semibold whitespace-nowrap"
    :class="{
      'bg-accent text-[var(--s3-color-text-on-accent)]': tone === 'accent',
      'bg-inverse text-ink-inverse': tone === 'inverse',
      'border border-border bg-surface text-ink': tone === 'neutral',
    }"
    ><slot
  /></span>
</template>
