<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    external?: boolean
    showArrow?: boolean
    to: string
  }>(),
  {
    external: false,
    showArrow: undefined,
  },
)

const displaysArrow = computed(() => props.showArrow ?? props.external)
</script>

<template>
  <NuxtLink
    :to="to"
    :external="external"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
    class="type-mono-sm inline-flex items-center gap-2 whitespace-nowrap underline-offset-4 transition-colors duration-150 hover:text-ink-accent hover:underline"
  >
    <slot />
    <span v-if="displaysArrow" aria-hidden="true">↗</span>
  </NuxtLink>
</template>
