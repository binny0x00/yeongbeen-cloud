<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    label: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="label"
    class="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-surface text-ink transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:text-ink-muted"
  >
    <slot />
  </button>
</template>
