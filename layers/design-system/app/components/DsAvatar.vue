<script setup lang="ts">
withDefaults(defineProps<{ label: string; online?: boolean; size?: 'sm' | 'md' | 'lg' }>(), {
  online: false,
  size: 'md',
})
</script>

<template>
  <span
    class="relative inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-canvas font-mono font-semibold text-ink"
    :class="{
      'size-8 text-[10px]': size === 'sm',
      'size-10 text-xs': size === 'md',
      'size-12 text-sm': size === 'lg',
    }"
    :aria-label="label"
  >
    <slot>{{ label.slice(0, 2).toUpperCase() }}</slot>
    <span
      v-if="online"
      class="absolute right-0 bottom-0 size-2.5 rounded-full bg-accent ring-2 ring-surface"
      aria-label="온라인"
    />
  </span>
</template>
