<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
defineProps<{ label: string }>()
</script>

<template>
  <label class="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"
    ><input v-model="model" type="checkbox" class="peer sr-only" role="switch" /><span
      class="relative h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-accent after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-ink after:transition-transform peer-checked:after:translate-x-5"
      aria-hidden="true"
    /><span>{{ label }}</span></label
  >
</template>
