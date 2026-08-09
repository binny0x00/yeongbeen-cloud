<script setup lang="ts">
const model = defineModel<string>({ required: true })
defineProps<{ label: string; name: string; value: string }>()
</script>

<template>
  <label class="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink"
    ><input
      v-model="model"
      :name="name"
      :value="value"
      type="radio"
      class="size-5 accent-[var(--s3-color-accent-primary)]"
    /><span>{{ label }}</span></label
  >
</template>
