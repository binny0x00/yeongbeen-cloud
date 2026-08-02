<script setup lang="ts">
const route = useRoute()
const { data: article } = await useAsyncData(`writing-${route.path}`, () =>
  queryCollection('writing').path(route.path).first(),
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useSeoMeta({
  title: () => `${article.value?.title} · Yeongbeen Cloud`,
  description: () => article.value?.description,
})
</script>

<template>
  <article v-if="article" class="flex w-full max-w-[856px] flex-col gap-8">
    <NuxtLink to="/#writing" class="type-label text-ink-muted hover:text-ink">
      ← ENGINEERING NOTES
    </NuxtLink>

    <header class="flex flex-col gap-5 border-b border-border pb-8">
      <SectionEyebrow :label="article.category.toUpperCase()" class="-ml-4" />
      <h1 class="type-display-lg">{{ article.title }}</h1>
      <p class="type-body-lg max-w-[720px] text-ink-muted">{{ article.description }}</p>
      <p class="type-label text-ink-accent">{{ article.tags.join(' · ') }}</p>
    </header>

    <ContentRenderer :value="article" class="content-body" />
  </article>
</template>

<style scoped>
.content-body :deep(p),
.content-body :deep(li) {
  margin-top: 12px;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
}
</style>
