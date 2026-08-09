<script setup lang="ts">
const model = defineModel<string>({ default: '' })
withDefaults(
  defineProps<{
    error?: string
    helper?: string
    label: string
    name: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'search'
  }>(),
  { error: undefined, helper: undefined, placeholder: undefined, type: 'text' },
)
</script>

<template>
  <label class="flex w-full flex-col gap-1 font-sans text-sm text-ink"
    ><span class="font-mono text-[11px] font-semibold uppercase">{{ label }}</span
    ><input
      v-model="model"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error || helper ? `${name}-help` : undefined"
      class="s3-control w-full border bg-surface px-4 outline-none placeholder:text-ink-muted focus:border-stroke-strong"
      :class="error ? 'border-red-600' : 'border-border'"
    /><span
      v-if="error || helper"
      :id="`${name}-help`"
      class="text-xs"
      :class="error ? 'text-red-600' : 'text-ink-muted'"
      >{{ error || helper }}</span
    ></label
  >
</template>
