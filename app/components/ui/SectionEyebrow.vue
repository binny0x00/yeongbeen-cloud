<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    mobileLabel?: string
    tone?: 'default' | 'primary'
  }>(),
  {
    label: 'PROJECTS',
    mobileLabel: undefined,
    tone: 'default',
  },
)

const isPrimary = computed(() => props.tone === 'primary')
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-2" :data-tone="tone" :aria-label="`${label} 섹션`">
    <span
      aria-hidden="true"
      class="h-0.5 w-6 origin-left rounded-full transition-transform duration-500"
      :class="isPrimary ? 'bg-accent' : 'bg-border'"
      data-motion-line
    />
    <p
      class="type-label whitespace-nowrap"
      :class="isPrimary ? 'text-ink-accent-primary' : 'text-ink'"
    >
      <span v-if="mobileLabel" class="desktop:hidden">{{ mobileLabel }}</span>
      <span :class="{ 'hidden desktop:inline': mobileLabel }">{{ label }}</span>
    </p>
  </div>
</template>
