<script setup lang="ts">
import type { PublicContentItem } from '../../../shared/schemas/api/content'

interface Detail extends PublicContentItem {
  contentJson: Record<string, unknown>
  renderedHtml: string
  seo: Record<string, unknown>
}

const props = defineProps<{ kind: 'PORTFOLIO' | 'POST' }>()
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const slug = computed(() => String(route.params.slug))
const endpoint = computed(() =>
  props.kind === 'PORTFOLIO' ? `/api/v1/portfolio/${slug.value}` : `/api/v1/posts/${slug.value}`,
)
const { data: item } = await useFetch<Detail>(endpoint, {
  query: computed(() => ({ locale: locale.value })),
})
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Content not found' })

const progress = ref(0)
const article = useTemplateRef<HTMLElement>('article')
const backPath = computed(() => localePath(props.kind === 'POST' ? '/posts' : '/portfolio'))

useSeoMeta({
  description: () => item.value?.summary,
  ogDescription: () => item.value?.summary,
  ogTitle: () => item.value?.title,
  title: () => item.value?.title,
})

useHead(() => ({
  script: item.value
    ? [
        {
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': props.kind === 'POST' ? 'BlogPosting' : 'CreativeWork',
            datePublished: item.value.publishedAt,
            description: item.value.summary,
            headline: item.value.title,
            inLanguage: item.value.locale,
          }),
          type: 'application/ld+json',
        },
      ]
    : [],
}))

onMounted(() => {
  const updateProgress = () => {
    const root = article.value
    if (!root) return
    const rect = root.getBoundingClientRect()
    const total = Math.max(1, root.offsetHeight - window.innerHeight)
    progress.value = Math.min(100, Math.max(0, ((-rect.top + 80) / total) * 100))
  }
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
  onBeforeUnmount(() => window.removeEventListener('scroll', updateProgress))
})

async function share(): Promise<void> {
  if (navigator.share) await navigator.share({ title: item.value?.title, url: location.href })
  else await navigator.clipboard.writeText(location.href)
}
</script>

<template>
  <article v-if="item" ref="article" class="flex w-full max-w-[856px] flex-col gap-8">
    <div class="fixed top-0 right-0 left-0 z-40 h-1 bg-border" aria-hidden="true">
      <div class="h-full bg-accent" :style="{ width: `${progress}%` }" />
    </div>
    <NuxtLink :to="backPath" class="type-label inline-flex min-h-11 items-center text-ink-muted"
      >← {{ t('common.back') }}</NuxtLink
    >
    <DsPostHeader
      author="Yeongbeen Choi"
      :date="
        item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(item.locale) : 'Draft'
      "
      :description="item.summary"
      :eyebrow="kind"
      reading-time="—"
      :title="item.title"
    />
    <div class="flex flex-wrap gap-2">
      <DsBadge v-for="tag in item.tags" :key="tag">{{ tag }}</DsBadge>
    </div>
    <!-- HTML is rendered and sanitized by the trusted content persistence pipeline. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="content-prose" v-html="item.renderedHtml" />
    <div class="border-t border-border pt-6">
      <DsButton variant="secondary" @click="share">Share</DsButton>
    </div>
  </article>
</template>

<style scoped>
.content-prose :deep(h2) {
  margin-top: 2.5rem;
  font-size: 1.75rem;
  font-weight: 700;
}
.content-prose :deep(p),
.content-prose :deep(li) {
  margin-top: 1rem;
  font-size: 1.0625rem;
  line-height: 1.9;
}
.content-prose :deep(ul) {
  padding-left: 1.5rem;
  list-style: disc;
}
.content-prose :deep(a) {
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-decoration-thickness: 3px;
}
</style>
