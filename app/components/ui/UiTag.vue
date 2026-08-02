<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'neutral' | 'accent'
  }>(),
  {
    tone: 'neutral',
  },
)
</script>

<template>
  <span
    class="type-mono-sm inline-flex items-center rounded-full px-3 py-2 whitespace-nowrap"
    :class="
      tone === 'accent' ? 'bg-accent text-[var(--color-text-on-accent)]' : 'bg-surface text-ink'
    "
  >
    <slot />
  </span>
</template>
