<script setup lang="ts">
defineProps<{
  category: string
  date: string
  description: string
  title: string
  to: string
}>()
</script>

<template>
  <article class="w-full border-b border-border">
    <NuxtLink
      :to="to"
      :aria-label="`${title} 글 읽기`"
      class="group grid w-full grid-cols-1 gap-2 py-5 no-underline transition-colors duration-200 hover:bg-surface/60 tablet:grid-cols-[8rem_1fr_2rem] tablet:gap-x-6 tablet:py-6"
    >
      <p class="type-mono-sm text-ink-muted">{{ date }} · {{ category }}</p>

      <div class="flex min-w-0 flex-col gap-1">
        <h3
          class="type-body-md font-semibold text-ink transition-colors duration-200 group-hover:text-ink-accent-primary"
        >
          {{ title }}
        </h3>
        <p class="type-body-sm text-ink-muted">{{ description }}</p>
      </div>

      <span
        class="type-heading-sm text-ink-accent transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1"
        aria-hidden="true"
      >
        ↗
      </span>
    </NuxtLink>
  </article>
</template>
