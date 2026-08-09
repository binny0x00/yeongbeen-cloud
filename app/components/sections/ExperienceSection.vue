<script setup lang="ts">
import type { PublicContentItem } from '../../../shared/schemas/api/content'

const { locale } = useI18n()
const { data } = await useFetch<{ items: PublicContentItem[] }>('/api/v1/career', {
  query: computed(() => ({ limit: 50, locale: locale.value, sort: 'oldest' })),
})
</script>
<template>
  <section id="experience" class="flex w-full flex-col gap-5">
    <SectionEyebrow label="EXPERIENCE" class="-ml-4" />
    <ExperienceRow
      v-for="item in data?.items ?? []"
      :key="item.id"
      :description="item.summary"
      :period="String(item.metadata.startedAt ?? '')"
      :technologies="item.tags"
      :title="item.title"
    />
  </section>
</template>
