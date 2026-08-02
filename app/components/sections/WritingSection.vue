<script setup lang="ts">
const { data: articles } = await useAsyncData('recent-writing', () =>
  queryCollection('writing').order('order', 'ASC').limit(3).all(),
)

function formatYear(date?: Date | string) {
  if (!date) return 'SOON'
  return String(new Date(date).getUTCFullYear())
}
</script>

<template>
  <section
    id="writing"
    aria-labelledby="writing-title"
    class="flex w-full scroll-mt-8 flex-col items-start gap-5"
  >
    <SectionEyebrow label="ENGINEERING NOTES" mobile-label="NOTES" class="-ml-4" />

    <h2 id="writing-title" class="type-display-lg">
      <span class="block">NOTES FROM</span>
      <span class="block">THE BUILD.</span>
    </h2>

    <ol v-if="articles?.length" class="mt-2 w-full border-t border-border">
      <li v-for="article in articles" :key="article.path">
        <ArticleRow
          :category="article.category"
          :date="formatYear(article.publishedAt)"
          :description="article.description"
          :title="article.title"
          :to="article.path"
        />
      </li>
    </ol>

    <p v-else class="type-body-sm border-t border-border py-6 text-ink-muted">
      준비 중인 기술 기록이 곧 공개됩니다.
    </p>
  </section>
</template>
