<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'surface' | 'accent'
  }>(),
  { type: 'button', variant: 'surface' },
)
</script>

<template>
  <button
    :type="type"
    :aria-label="label"
    class="s3-control inline-flex min-w-11 cursor-pointer items-center justify-center border text-lg"
    :class="
      variant === 'accent'
        ? 'border-transparent bg-accent text-[var(--s3-color-text-on-accent)]'
        : 'border-border bg-surface text-ink hover:border-stroke-strong'
    "
  >
    <slot>↗</slot>
  </button>
</template>
