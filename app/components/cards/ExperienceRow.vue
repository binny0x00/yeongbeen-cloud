<script setup lang="ts">
defineProps<{
  description: string
  period: string
  technologies: string[]
  title: string
  to?: string
}>()
</script>

<template>
  <li class="border-t border-border">
    <NuxtLink
      v-if="to"
      :to="to"
      class="group grid w-full gap-3 py-7 transition-colors hover:bg-surface focus-visible:bg-surface desktop:grid-cols-[180px_minmax(0,1fr)] desktop:gap-7 desktop:px-3 desktop:py-8"
    >
      <p class="type-mono-sm text-ink-muted">{{ period }}</p>
      <div class="flex min-w-0 flex-col gap-3.5">
        <h3 class="type-heading-sm text-ink group-hover:text-ink-accent-primary">
          {{ title }} <span aria-hidden="true">↗</span>
        </h3>
        <p class="type-body-md text-ink-muted">{{ description }}</p>
        <p class="type-mono-sm text-ink-accent">
          {{ technologies.join('   ') }}
        </p>
      </div>
    </NuxtLink>

    <div
      v-else
      class="grid w-full gap-3 py-7 desktop:grid-cols-[180px_minmax(0,1fr)] desktop:gap-7 desktop:px-3 desktop:py-8"
    >
      <p class="type-mono-sm text-ink-muted">{{ period }}</p>
      <div class="flex min-w-0 flex-col gap-3.5">
        <h3 class="type-heading-sm text-ink">{{ title }}</h3>
        <p class="type-body-md text-ink-muted">{{ description }}</p>
        <p class="type-mono-sm text-ink-accent">
          {{ technologies.join('   ') }}
        </p>
      </div>
    </div>
  </li>
</template>
