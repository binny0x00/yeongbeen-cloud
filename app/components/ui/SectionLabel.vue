<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    index?: number | string
    label?: string
  }>(),
  {
    index: 1,
    label: 'ABOUT',
  },
)

const normalizedIndex = computed(() => String(props.index).padStart(2, '0'))
</script>

<template>
  <div class="flex h-5 w-full items-center gap-4">
    <p class="type-mono-sm shrink-0 text-ink uppercase">{{ normalizedIndex }} / {{ label }}</p>
    <span aria-hidden="true" class="h-1 min-w-px flex-1 bg-accent-secondary" />
  </div>
</template>
