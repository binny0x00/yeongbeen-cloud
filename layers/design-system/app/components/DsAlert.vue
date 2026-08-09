<script setup lang="ts">
const emit = defineEmits<{ dismiss: [] }>()
withDefaults(
  defineProps<{
    dismissible?: boolean
    kind?: 'info' | 'success' | 'warning' | 'error'
    message: string
    title: string
  }>(),
  { dismissible: false, kind: 'info' },
)
</script>

<template>
  <div
    role="status"
    class="flex min-h-24 items-center gap-4 rounded-[var(--s3-radius-control)] border bg-surface px-5 py-4"
    :class="kind === 'error' ? 'border-red-600' : 'border-accent'"
  >
    <span
      class="size-3 shrink-0 rounded-full"
      :class="kind === 'error' ? 'bg-red-600' : 'bg-accent'"
      aria-hidden="true"
    />
    <div class="min-w-0 flex-1">
      <strong class="block font-display text-base">{{ title }}</strong>
      <p class="mt-1 text-sm">{{ message }}</p>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="size-11 text-xl"
      aria-label="알림 닫기"
      @click="emit('dismiss')"
    >
      ×
    </button>
  </div>
</template>
