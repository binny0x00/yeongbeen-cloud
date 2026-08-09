<script setup lang="ts">
import type { AdminDocument } from '@content-domain/ports/admin-document-repository'

definePageMeta({ middleware: 'admin' })
const { t } = useI18n()
const localePath = useLocalePath()
const { data: documents, refresh } = await useFetch<AdminDocument[]>('/api/v1/admin/documents')
const createForm = reactive({
  kind: 'POST' as AdminDocument['kind'],
  locale: 'ko' as const,
  slug: '',
  summary: '',
  title: '',
})
const creating = ref(false)

async function createDocument(): Promise<void> {
  creating.value = true
  try {
    const created = await $fetch<AdminDocument>('/api/v1/admin/documents', {
      body: createForm,
      method: 'POST',
    })
    await refresh()
    await navigateTo(localePath(`/admin/documents/${created.id}`))
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="flex w-full max-w-[980px] flex-col gap-10">
    <header class="flex flex-col gap-3">
      <SectionEyebrow label="ADMIN" class="-ml-4" />
      <h1 class="type-display-lg">{{ t('admin.studio') }}</h1>
    </header>
    <form class="s3-panel grid gap-4 p-6 tablet:grid-cols-2" @submit.prevent="createDocument">
      <DsTextField v-model="createForm.title" :label="t('admin.title')" name="title" />
      <DsTextField v-model="createForm.slug" :label="t('admin.slug')" name="slug" />
      <DsSelect
        v-model="createForm.kind"
        :label="t('admin.kind')"
        name="kind"
        :options="[
          { label: t('admin.post'), value: 'POST' },
          { label: t('admin.portfolio'), value: 'PORTFOLIO' },
          { label: t('admin.career'), value: 'CAREER' },
        ]"
      />
      <DsTextField v-model="createForm.summary" :label="t('admin.summary')" name="summary" />
      <DsButton type="submit" :disabled="creating || !createForm.title || !createForm.slug">{{
        t('admin.createDraft')
      }}</DsButton>
    </form>
    <section class="flex flex-col gap-3" aria-label="Documents">
      <article
        v-for="document in documents ?? []"
        :key="document.id"
        class="s3-panel flex flex-wrap items-center justify-between gap-4 p-5"
      >
        <div>
          <p class="type-label text-ink-muted">{{ document.kind }}</p>
          <h2 class="type-heading-lg">{{ document.localizations[0]?.title }}</h2>
          <p class="type-mono-sm text-ink-muted">
            KO {{ document.localizations.find(item => item.locale === 'ko')?.state }} · EN
            {{ document.localizations.find(item => item.locale === 'en')?.state }}
          </p>
        </div>
        <DsButton :to="localePath(`/admin/documents/${document.id}`)" variant="secondary"
          >Edit</DsButton
        >
      </article>
    </section>
  </div>
</template>
