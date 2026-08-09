<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    to?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'inverse'
  }>(),
  { disabled: false, to: undefined, type: 'button', variant: 'primary' },
)
const classes = computed(() => [
  's3-control inline-flex cursor-pointer items-center justify-center border px-5 font-sans text-sm font-semibold transition-colors',
  props.disabled ? 'pointer-events-none opacity-40' : '',
  props.variant === 'primary'
    ? 'border-transparent bg-accent text-[var(--s3-color-text-on-accent)] hover:bg-inverse hover:text-ink-inverse'
    : props.variant === 'inverse'
      ? 'border-transparent bg-inverse text-ink-inverse hover:bg-accent hover:text-[var(--s3-color-text-on-accent)]'
      : 'border-border bg-surface text-ink hover:border-stroke-strong',
])
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :to="props.to"
    :class="classes"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    ><slot
  /></NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="classes"><slot /></button>
</template>
