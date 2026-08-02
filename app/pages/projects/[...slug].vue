<script setup lang="ts">
const route = useRoute()
const { data: project } = await useAsyncData(`project-${route.path}`, () =>
  queryCollection('projects').path(route.path).first(),
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useSeoMeta({
  title: () => `${project.value?.title} · Yeongbeen Cloud`,
  description: () => project.value?.description,
})
</script>

<template>
  <article v-if="project" class="flex w-full max-w-[856px] flex-col gap-8">
    <NuxtLink to="/#projects" class="type-label text-ink-muted hover:text-ink">
      ← SELECTED PROJECTS
    </NuxtLink>

    <header class="flex flex-col gap-5 border-b border-border pb-8">
      <SectionEyebrow :label="project.category.toUpperCase()" class="-ml-4" />
      <h1 class="type-display-lg">{{ project.title }}</h1>
      <p class="type-body-lg max-w-[720px] text-ink-muted">{{ project.description }}</p>
      <p class="type-label text-ink-accent">{{ project.tags.join(' · ') }}</p>
    </header>

    <ContentRenderer :value="project" class="content-body" />
  </article>
</template>

<style scoped>
.content-body :deep(h2) {
  margin-top: 36px;
  font-family: var(--font-display);
  font-size: var(--font-size-heading-lg);
  font-weight: 700;
  line-height: var(--line-height-heading-lg);
}

.content-body :deep(p),
.content-body :deep(li) {
  margin-top: 12px;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: var(--font-size-body-md);
  line-height: var(--line-height-body-md);
}

.content-body :deep(ul) {
  padding-left: 20px;
  list-style: disc;
}
</style>
