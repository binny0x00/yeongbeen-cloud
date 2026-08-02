<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    to?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'inverse' | 'primary' | 'secondary'
  }>(),
  {
    disabled: false,
    to: undefined,
    type: 'button',
    variant: 'primary',
  },
)

const buttonClasses = computed(() => [
  'type-label inline-flex min-h-8 cursor-pointer items-center justify-center rounded-sm border px-4 py-2 transition-[color,background-color,border-color,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5',
  props.disabled
    ? [
        'pointer-events-none cursor-not-allowed bg-surface text-ink-muted',
        props.variant === 'secondary' ? 'border-stroke-strong' : 'border-transparent',
      ]
    : props.variant === 'primary'
      ? 'border-transparent bg-accent text-[var(--color-text-on-accent)] hover:bg-inverse hover:text-ink-inverse'
      : props.variant === 'inverse'
        ? 'border-transparent bg-inverse text-ink-inverse hover:bg-canvas hover:text-ink'
        : 'border-stroke-strong bg-canvas text-ink hover:bg-accent',
])
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    :class="buttonClasses"
  >
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="buttonClasses">
    <slot />
  </button>
</template>
