<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const accessibleLabel = computed(() => (isDark.value ? '라이트 테마로 전환' : '다크 테마로 전환'))
</script>

<template>
  <button
    type="button"
    :aria-label="accessibleLabel"
    :aria-pressed="isDark"
    class="type-mono-sm inline-flex cursor-pointer items-center rounded-full px-3 py-2 whitespace-pre transition-colors duration-150"
    :class="isDark ? 'bg-inverse text-ink-inverse' : 'bg-surface text-ink'"
    @click="toggleTheme"
  >
    {{ isDark ? 'DARK  ☾' : 'LIGHT  ☼' }}
  </button>
</template>
