<script setup lang="ts">
import type { PublicContentItem } from '../../shared/schemas/api/content'

const { locale, t } = useI18n()
const { data } = await useFetch<{ items: PublicContentItem[] }>('/api/v1/career', {
  query: computed(() => ({ limit: 50, locale: locale.value, sort: 'oldest' })),
})
useSeoMeta({ title: () => t('nav.about'), description: () => t('home.description') })
</script>

<template>
  <article class="flex w-full max-w-[856px] flex-col gap-12">
    <header class="flex flex-col gap-5">
      <SectionEyebrow :label="t('nav.about')" class="-ml-4" />
      <h1 class="type-display-lg">YEONGBEEN CHOI</h1>
      <p class="type-body-lg max-w-[700px] text-ink-muted">{{ t('home.description') }}</p>
    </header>
    <section class="flex flex-col gap-2" aria-label="Career timeline">
      <article v-for="item in data?.items ?? []" :key="item.id" class="border-t border-border py-5">
        <p class="type-label text-ink-muted">{{ item.metadata.organization }}</p>
        <h2 class="type-heading-lg mt-2">{{ item.title }}</h2>
        <p class="type-body-md mt-2 text-ink-muted">{{ item.summary }}</p>
      </article>
    </section>
  </article>
</template>
