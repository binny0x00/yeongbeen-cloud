<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
defineProps<{ label: string; name: string }>()
</script>

<template>
  <label class="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"
    ><input
      v-model="model"
      :name="name"
      type="checkbox"
      class="size-5 accent-[var(--s3-color-accent-primary)]"
    /><span>{{ label }}</span></label
  >
</template>
