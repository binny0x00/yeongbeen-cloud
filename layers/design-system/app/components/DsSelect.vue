<script setup lang="ts">
const model = defineModel<string>({ default: '' })
defineProps<{ label: string; name: string; options: Array<{ label: string; value: string }> }>()
</script>

<template>
  <label class="flex w-full flex-col gap-1 text-sm text-ink"
    ><span class="font-mono text-[11px] font-semibold uppercase">{{ label }}</span
    ><select
      v-model="model"
      :name="name"
      class="s3-control w-full border border-border bg-surface px-4 outline-none focus:border-stroke-strong"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select></label
  >
</template>
