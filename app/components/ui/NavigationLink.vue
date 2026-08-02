<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: boolean
    to: string
  }>(),
  {
    active: false,
  },
)
</script>

<template>
  <NuxtLink
    :to="to"
    :aria-current="active ? 'location' : undefined"
    class="group flex min-w-20 flex-col items-start gap-1"
  >
    <span
      class="type-mono-sm whitespace-nowrap transition-colors duration-150"
      :class="active ? 'text-ink' : 'text-ink-muted group-hover:text-ink'"
    >
      <slot />
    </span>
    <span
      aria-hidden="true"
      class="h-1 w-20 transition-colors duration-150"
      :class="active ? 'bg-accent-secondary' : 'bg-border group-hover:bg-accent-secondary'"
    />
  </NuxtLink>
</template>
