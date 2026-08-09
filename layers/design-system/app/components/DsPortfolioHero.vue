<script setup lang="ts">
defineProps<{ category: string; description: string; index: number; meta: string; title: string }>()
</script>

<template>
  <section
    class="s3-panel grid gap-7 p-7 tablet:grid-cols-[minmax(0,1fr)_15rem] tablet:items-center"
  >
    <div class="flex min-w-0 flex-col gap-3">
      <p class="font-mono text-[11px] font-semibold">
        PROJECT / {{ String(index).padStart(2, '0') }}
      </p>
      <p class="font-mono text-xs">{{ category }}</p>
      <h2 class="font-display text-5xl leading-none font-bold">{{ title }}</h2>
      <p class="max-w-2xl text-sm leading-6">{{ description }}</p>
      <p class="font-mono text-[11px] text-ink-muted">{{ meta }}</p>
      <slot />
    </div>
    <div class="relative h-64 overflow-hidden rounded-xl bg-canvas" aria-hidden="true">
      <span class="absolute top-6 left-5 size-36 rotate-3 rounded-lg bg-accent" /><span
        class="absolute right-4 bottom-6 flex h-36 w-32 -rotate-3 items-center justify-center rounded-lg bg-inverse font-display text-5xl text-ink-inverse"
        >{{ String(index).padStart(2, '0') }}</span
      >
    </div>
  </section>
</template>
