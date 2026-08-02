<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
  }>(),
  {
    disabled: false,
    type: 'button',
    variant: 'primary',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="type-label inline-flex min-h-8 cursor-pointer items-center justify-center rounded-sm border px-4 py-2 transition-colors duration-150 disabled:cursor-not-allowed"
    :class="
      variant === 'primary'
        ? 'border-transparent bg-accent text-[var(--color-text-on-accent)] enabled:hover:bg-inverse enabled:hover:text-ink-inverse disabled:bg-surface disabled:text-ink-muted'
        : 'border-stroke-strong bg-canvas text-ink enabled:hover:bg-accent disabled:bg-surface disabled:text-ink-muted'
    "
  >
    <slot />
  </button>
</template>
