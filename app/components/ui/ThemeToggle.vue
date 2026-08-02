<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const accessibleLabel = computed(() => (isDark.value ? '라이트 테마로 전환' : '다크 테마로 전환'))
</script>

<template>
  <button
    type="button"
    :aria-label="accessibleLabel"
    :aria-pressed="isDark"
    class="type-mono-sm inline-flex w-fit cursor-pointer items-center border-b border-border bg-transparent py-1 whitespace-pre text-ink-muted transition-colors duration-150 hover:border-stroke-strong hover:text-ink"
    @click="toggleTheme"
  >
    THEME / {{ isDark ? 'DARK' : 'LIGHT' }}
  </button>
</template>
