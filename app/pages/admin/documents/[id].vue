<script setup lang="ts">
import { del, get, set } from 'idb-keyval'

import { useAdminDocumentLifecycle } from '@admin/app/composables/useAdminDocumentLifecycle'
import { useAiEditorApply } from '@admin/app/composables/useAiEditorApply'
import type {
  AdminDocument,
  AdminLocalization,
  AdminRevision,
} from '@content-domain/ports/admin-document-repository'

definePageMeta({ middleware: 'admin' })
const { t } = useI18n()
const route = useRoute()
const id = String(route.params.id)
const { data, refresh } = await useFetch<
  AdminDocument & {
    revisions: AdminRevision[]
  }
>(`/api/v1/admin/documents/${id}`)
if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

interface Draft extends AdminLocalization {
  dirty: boolean
}
const drafts = reactive<Record<'ko' | 'en', Draft>>({
  ko: {
    ...(data.value.localizations.find(item => item.locale === 'ko') as AdminLocalization),
    dirty: false,
  },
  en: {
    ...(data.value.localizations.find(item => item.locale === 'en') as AdminLocalization),
    dirty: false,
  },
})
const seoDrafts = reactive<
  Record<'ko' | 'en', { description: string; image: string; title: string }>
>({
  ko: {
    description: String(drafts.ko.seo.description ?? ''),
    image: String(drafts.ko.seo.image ?? ''),
    title: String(drafts.ko.seo.title ?? ''),
  },
  en: {
    description: String(drafts.en.seo.description ?? ''),
    image: String(drafts.en.seo.image ?? ''),
    title: String(drafts.en.seo.title ?? ''),
  },
})
const status = reactive<Record<'ko' | 'en', string>>({
  ko: t('admin.saved'),
  en: t('admin.saved'),
})
const recovery = reactive<Partial<Record<'ko' | 'en', Draft>>>({})
const scheduleAt = reactive<Record<'ko' | 'en', string>>({ ko: '', en: '' })
const preview = ref<'390' | '768' | '1200'>('1200')
const previewTheme = ref<'light' | 'night'>('light')
const saveTimers: Partial<Record<'ko' | 'en', ReturnType<typeof setTimeout>>> = {}
const saveQueues: Partial<Record<'ko' | 'en', Promise<boolean>>> = {}
const manualSaveOnly = new Set<'ko' | 'en'>()
let initialized = false
const { apply: applyAi, source: aiSource } = useAiEditorApply({
  drafts,
  manualSaveOnly,
  saveTimers,
  seoDrafts,
  status,
  translate: key => t(key),
})

function recoveryKey(locale: 'ko' | 'en'): string {
  return `editor-recovery:${id}:${locale}`
}

function editableSnapshot(locale: 'ko' | 'en') {
  const draft = drafts[locale]
  const seo = Object.fromEntries(
    Object.entries(seoDrafts[locale]).filter(([, value]) => value.trim().length > 0),
  )
  return {
    contentJson: JSON.parse(JSON.stringify(draft.contentJson)) as Record<string, unknown>,
    locale,
    seo,
    slug: draft.slug,
    summary: draft.summary,
    title: draft.title,
    version: draft.version,
  }
}

function hasChangedSince(locale: 'ko' | 'en', snapshot: ReturnType<typeof editableSnapshot>) {
  const current = editableSnapshot(locale)
  return JSON.stringify({ ...current, version: snapshot.version }) !== JSON.stringify(snapshot)
}

async function persistDraft(locale: 'ko' | 'en'): Promise<boolean> {
  const draft = drafts[locale]
  const snapshot = editableSnapshot(locale)
  status[locale] = t('admin.saving')
  try {
    const saved = await $fetch<AdminLocalization>(`/api/v1/admin/documents/${id}`, {
      body: snapshot,
      method: 'PATCH',
    })
    draft.version = saved.version
    draft.state = saved.state
    draft.scheduledAt = saved.scheduledAt
    if (hasChangedSince(locale, snapshot)) {
      draft.dirty = true
      status[locale] = `${t('admin.unsaved')} · server v${saved.version}`
      return true
    }
    draft.dirty = false
    manualSaveOnly.delete(locale)
    status[locale] = `${t('admin.saved')} v${saved.version}`
    await del(recoveryKey(locale))
    return true
  } catch (error: unknown) {
    const conflict = error as { statusCode?: number }
    status[locale] = conflict.statusCode === 409 ? t('admin.conflict') : t('admin.offline')
    return false
  }
}

function saveDraft(locale: 'ko' | 'en'): Promise<boolean> {
  const queued = (saveQueues[locale] ?? Promise.resolve(true)).then(() => persistDraft(locale))
  saveQueues[locale] = queued
  return queued
}
const { publish, restore, schedule } = useAdminDocumentLifecycle({
  documentId: id,
  refresh,
  saveDraft,
  scheduleAt,
  status,
  translate: key => t(key),
})

for (const locale of ['ko', 'en'] as const) {
  watch(
    () => ({
      contentJson: drafts[locale].contentJson,
      seo: seoDrafts[locale],
      slug: drafts[locale].slug,
      summary: drafts[locale].summary,
      title: drafts[locale].title,
    }),
    () => {
      if (!initialized) return
      drafts[locale].dirty = true
      status[locale] = manualSaveOnly.has(locale)
        ? t('admin.ai.appliedUnsaved')
        : t('admin.unsaved')
      void set(
        recoveryKey(locale),
        JSON.parse(JSON.stringify({ ...drafts[locale], seo: seoDrafts[locale] })),
      )
      if (saveTimers[locale]) clearTimeout(saveTimers[locale])
      if (manualSaveOnly.has(locale)) return
      saveTimers[locale] = setTimeout(() => void saveDraft(locale), 1000)
    },
    { deep: true },
  )
}

onMounted(async () => {
  for (const locale of ['ko', 'en'] as const) {
    const local = await get<Draft>(recoveryKey(locale))
    if (local && local.version === drafts[locale].version) recovery[locale] = local
  }
  initialized = true
})

onBeforeUnmount(() => Object.values(saveTimers).forEach(timer => timer && clearTimeout(timer)))

function applyRecovery(locale: 'ko' | 'en'): void {
  if (recovery[locale]) {
    Object.assign(drafts[locale], recovery[locale])
    Object.assign(seoDrafts[locale], recovery[locale].seo)
  }
  Reflect.deleteProperty(recovery, locale)
}
</script>

<template>
  <div class="flex w-full max-w-[1200px] flex-col gap-8">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <SectionEyebrow :label="data?.kind ?? 'DOCUMENT'" class="-ml-4" />
        <h1 class="type-display-lg">{{ t('admin.editor') }}</h1>
      </div>
      <div class="flex flex-wrap gap-2">
        <DsSelect
          v-model="preview"
          :label="t('admin.viewport')"
          name="preview"
          :options="[
            { label: '390', value: '390' },
            { label: '768', value: '768' },
            { label: '1200', value: '1200' },
          ]"
        /><DsSelect
          v-model="previewTheme"
          :label="t('admin.theme')"
          name="theme"
          :options="[
            { label: t('admin.light'), value: 'light' },
            { label: t('admin.night'), value: 'night' },
          ]"
        />
      </div>
    </header>
    <div class="grid gap-8 2xl:grid-cols-2">
      <section
        v-for="locale in ['ko', 'en'] as const"
        :key="locale"
        class="flex min-w-0 flex-col gap-4"
        :data-theme="previewTheme"
      >
        <div class="flex items-center justify-between">
          <h2 class="type-heading-lg">{{ locale.toUpperCase() }}</h2>
          <DsBadge>{{ status[locale] }}</DsBadge>
        </div>
        <div v-if="recovery[locale]" class="flex flex-col gap-2">
          <DsAlert
            :title="t('admin.recoveryTitle')"
            kind="warning"
            :message="t('admin.recoveryMessage')"
          />
          <DsButton variant="secondary" @click="applyRecovery(locale)">{{
            t('admin.recover')
          }}</DsButton>
        </div>
        <div class="grid gap-3">
          <DsTextField
            v-model="drafts[locale].title"
            :label="t('admin.title')"
            :name="`title-${locale}`"
          />
          <DsTextField
            v-model="drafts[locale].slug"
            :label="t('admin.slug')"
            :name="`slug-${locale}`"
          />
          <DsTextarea
            v-model="drafts[locale].summary"
            :label="t('admin.summary')"
            :name="`summary-${locale}`"
            :rows="3"
          />
          <details class="s3-panel p-4">
            <summary class="type-label cursor-pointer">SEO</summary>
            <div class="mt-4 grid gap-3">
              <DsTextField
                v-model="seoDrafts[locale].title"
                :label="t('admin.seoTitle')"
                :name="`seo-title-${locale}`"
              />
              <DsTextarea
                v-model="seoDrafts[locale].description"
                :label="t('admin.seoDescription')"
                :name="`seo-description-${locale}`"
                :rows="3"
              />
              <DsTextField
                v-model="seoDrafts[locale].image"
                :label="t('admin.seoImage')"
                :name="`seo-image-${locale}`"
              />
            </div>
          </details>
        </div>
        <AiAssistantPanel
          :document-id="id"
          :locale="locale"
          :original-seo-description="seoDrafts[locale].description"
          :original-seo-title="seoDrafts[locale].title"
          :original-summary="drafts[locale].summary"
          :source="aiSource(locale)"
          @apply="applyAi(locale, $event)"
        />
        <div class="mx-auto w-full transition-[max-width]" :style="{ maxWidth: `${preview}px` }">
          <RichTextEditor v-model="drafts[locale].contentJson" :locale="locale" />
        </div>
        <div class="flex flex-wrap gap-2">
          <DsButton variant="secondary" @click="saveDraft(locale)">{{
            t('admin.saveNow')
          }}</DsButton
          ><DsButton @click="publish(locale)">{{ t('admin.publish') }}</DsButton
          ><input
            v-model="scheduleAt[locale]"
            class="s3-control border border-border bg-surface px-3"
            type="datetime-local"
          /><DsButton
            variant="secondary"
            :disabled="!scheduleAt[locale]"
            @click="schedule(locale)"
            >{{ t('admin.schedule') }}</DsButton
          >
        </div>
      </section>
    </div>
    <DocumentRevisions
      :localizations="drafts"
      :revisions="data?.revisions ?? []"
      @restore="restore"
    />
  </div>
</template>
