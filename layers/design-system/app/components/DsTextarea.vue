<script setup lang="ts">
const model = defineModel<string>({ default: '' })
withDefaults(
  defineProps<{
    label: string
    maxlength?: number
    name: string
    placeholder?: string
    rows?: number
  }>(),
  { maxlength: undefined, placeholder: undefined, rows: 4 },
)
</script>

<template>
  <label class="flex w-full flex-col gap-1 text-sm text-ink"
    ><span class="font-mono text-[11px] font-semibold uppercase">{{ label }}</span
    ><textarea
      v-model="model"
      :name="name"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
      class="w-full resize-y rounded-[var(--s3-radius-control)] border border-border bg-surface p-4 leading-6 outline-none focus:border-stroke-strong"
    /><span v-if="maxlength" class="self-end text-xs text-ink-muted"
      >{{ model.length }} / {{ maxlength }}</span
    ></label
  >
</template>
