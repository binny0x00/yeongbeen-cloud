<script setup lang="ts">
defineProps<{
  description: string
  mobileDescription: string
  mobileTitle: string
  status: string
  title: string
  to: string
}>()
</script>

<template>
  <article class="w-full border-t border-border">
    <NuxtLink
      :to="to"
      class="group flex w-full flex-col items-start gap-2 py-6 transition-colors duration-150 hover:text-ink-accent desktop:flex-row desktop:items-center desktop:gap-8"
    >
      <p class="type-mono-sm w-full shrink-0 text-ink-muted desktop:w-40">
        {{ status }}
      </p>

      <div class="flex min-w-0 flex-1 flex-col items-start gap-2">
        <h3 class="type-heading-sm w-full">
          <span class="desktop:hidden">{{ mobileTitle }}</span>
          <span class="hidden desktop:inline">{{ title }}</span>
        </h3>
        <p class="type-body-sm w-full text-ink-muted">
          <span class="desktop:hidden">{{ mobileDescription }}</span>
          <span class="hidden desktop:inline">{{ description }}</span>
        </p>
      </div>

      <span class="type-label desktop:hidden" aria-hidden="true">READ NOTE&nbsp; ↗</span>
      <span
        class="hidden w-8 shrink-0 font-sans text-[28px] leading-9 font-semibold tracking-[-0.4px] desktop:block"
        aria-hidden="true"
      >
        ↗
      </span>
    </NuxtLink>
  </article>
</template>
