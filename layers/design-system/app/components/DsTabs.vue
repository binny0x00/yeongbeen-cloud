<script setup lang="ts">
const model = defineModel<string>({ required: true })
defineProps<{ label: string; tabs: Array<{ label: string; value: string }> }>()
</script>

<template>
  <div class="flex border-b border-border" role="tablist" :aria-label="label">
    <button
      v-for="tab in tabs"
      :id="`${tab.value}-tab`"
      :key="tab.value"
      type="button"
      role="tab"
      :aria-selected="model === tab.value"
      class="relative min-h-12 min-w-24 cursor-pointer px-4 text-sm after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[3px] after:bg-transparent"
      :class="
        model === tab.value ? 'font-semibold after:bg-accent' : 'text-ink-muted hover:text-ink'
      "
      @click="model = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
