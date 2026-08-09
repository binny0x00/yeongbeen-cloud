<script setup lang="ts">
import type { PublicContentItem } from '../../../shared/schemas/api/content'

const props = withDefaults(
  defineProps<{
    compact?: boolean
    description?: string
    kind: 'PORTFOLIO' | 'POST'
    title?: string
  }>(),
  { compact: false, description: '', title: '' },
)
const { locale, t } = useI18n()
const endpoint = computed(() =>
  props.kind === 'PORTFOLIO' ? '/api/v1/portfolio' : '/api/v1/posts',
)
const query = reactive({ q: '', sort: 'recent' as 'recent' | 'oldest' | 'title' })
const items = ref<PublicContentItem[]>([])
const nextCursor = ref<string | null>(null)
const pendingMore = ref(false)

const { data, status } = await useFetch(endpoint, {
  query: computed(() => ({ limit: props.compact ? 3 : 12, locale: locale.value })),
  watch: [locale],
})

watchEffect(() => {
  items.value = (data.value?.items ?? []) as PublicContentItem[]
  nextCursor.value = data.value?.nextCursor ?? null
})

async function search(): Promise<void> {
  const page = await $fetch<{ items: PublicContentItem[]; nextCursor: string | null }>(
    endpoint.value,
    { query: { ...query, locale: locale.value, limit: props.compact ? 3 : 12 } },
  )
  items.value = page.items
  nextCursor.value = page.nextCursor
}

async function loadMore(): Promise<void> {
  if (!nextCursor.value || pendingMore.value) return
  pendingMore.value = true
  try {
    const page = await $fetch<{ items: PublicContentItem[]; nextCursor: string | null }>(
      endpoint.value,
      { query: { ...query, cursor: nextCursor.value, locale: locale.value, limit: 12 } },
    )
    items.value.push(...page.items)
    nextCursor.value = page.nextCursor
  } finally {
    pendingMore.value = false
  }
}
</script>

<template>
  <section class="flex w-full flex-col gap-6">
    <header v-if="title || description" class="flex flex-col gap-3">
      <h1 v-if="!compact" class="type-display-lg">{{ title }}</h1>
      <h2 v-else class="type-heading-lg">{{ title }}</h2>
      <p v-if="description" class="type-body-lg max-w-[700px] text-ink-muted">{{ description }}</p>
    </header>

    <form
      v-if="!compact"
      class="grid gap-3 tablet:grid-cols-[1fr_180px_auto]"
      @submit.prevent="search"
    >
      <DsTextField v-model="query.q" :label="t('common.search')" name="search" />
      <DsSelect
        v-model="query.sort"
        label="Sort"
        name="sort"
        :options="[
          { label: 'Recent', value: 'recent' },
          { label: 'Oldest', value: 'oldest' },
          { label: 'A–Z', value: 'title' },
        ]"
      />
      <DsButton class="self-end" type="submit">{{ t('common.search') }}</DsButton>
    </form>

    <p v-if="status === 'pending'" class="type-body-md text-ink-muted" aria-live="polite">
      Loading…
    </p>
    <div v-else-if="items.length" aria-live="polite">
      <PublicContentCard v-for="item in items" :key="item.id" :item="item" />
    </div>
    <DsEmptyState v-else :title="t('common.empty')" description="" />

    <DsButton
      v-if="nextCursor && !compact"
      :disabled="pendingMore"
      variant="secondary"
      @click="loadMore"
    >
      {{ t('common.loadMore') }}
    </DsButton>
  </section>
</template>
