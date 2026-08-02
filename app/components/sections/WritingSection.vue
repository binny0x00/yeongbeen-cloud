<script setup lang="ts">
const { data: articles } = await useAsyncData('recent-writing', () =>
  queryCollection('writing').order('order', 'ASC').limit(3).all(),
)

function formatYear(date?: Date | string) {
  if (!date) return ''
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

    <div
      v-else
      class="flex w-full flex-col items-start gap-3 border-y border-border py-7"
      data-writing-empty
    >
      <p class="type-label text-ink-accent-primary">PUBLISHING SOON</p>
      <p class="type-heading-sm text-ink">첫 기술 기록을 준비하고 있습니다.</p>
      <p class="type-body-sm max-w-[620px] text-ink-muted">
        프로젝트에서 내린 기술적 판단과 운영 과정은 정리되는 순서대로 공개합니다. 지금은 완료된
        프로젝트의 문제 해결 과정을 먼저 확인할 수 있습니다.
      </p>
      <UiTextLink to="#projects" :show-arrow="true">PROJECTS 먼저 보기</UiTextLink>
    </div>
  </section>
</template>
