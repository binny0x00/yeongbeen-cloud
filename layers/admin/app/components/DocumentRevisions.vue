<script setup lang="ts">
import type {
  AdminLocalization,
  AdminRevision,
} from '@content-domain/ports/admin-document-repository'

const props = defineProps<{
  localizations: Record<'ko' | 'en', AdminLocalization>
  revisions: AdminRevision[]
}>()
defineEmits<{ restore: [revisionId: string] }>()
const { t } = useI18n()
const selectedRevisionId = ref('')
const selectedRevision = computed(() =>
  props.revisions.find(revision => revision.id === selectedRevisionId.value),
)
</script>

<template>
  <section class="s3-panel p-6">
    <h2 class="type-heading-lg">{{ t('admin.revisions') }}</h2>
    <ul class="mt-4 flex flex-col gap-2">
      <li
        v-for="revision in revisions"
        :key="revision.id"
        class="flex items-center justify-between border-t border-border py-3"
      >
        <span class="type-mono-sm"
          >{{ revision.locale.toUpperCase() }} · v{{ revision.version }} ·
          {{ new Date(revision.createdAt).toLocaleString() }}</span
        >
        <span class="flex gap-2">
          <DsButton variant="secondary" @click="selectedRevisionId = revision.id">{{
            t('admin.compare')
          }}</DsButton>
          <DsButton variant="secondary" @click="$emit('restore', revision.id)">{{
            t('admin.restore')
          }}</DsButton>
        </span>
      </li>
    </ul>
    <div
      v-if="selectedRevision"
      class="mt-6 grid gap-4 border-t border-border pt-6 tablet:grid-cols-2"
    >
      <article>
        <p class="type-label">
          {{ t('admin.current') }} · {{ selectedRevision.locale.toUpperCase() }}
        </p>
        <h3 class="type-heading-lg">{{ localizations[selectedRevision.locale].title }}</h3>
        <p class="mt-2 text-ink-muted">{{ localizations[selectedRevision.locale].summary }}</p>
        <pre class="mt-4 max-h-72 overflow-auto bg-canvas p-4 text-xs">{{
          JSON.stringify(localizations[selectedRevision.locale].contentJson, null, 2)
        }}</pre>
      </article>
      <article>
        <p class="type-label">{{ t('admin.revision') }} v{{ selectedRevision.version }}</p>
        <h3 class="type-heading-lg">{{ selectedRevision.title }}</h3>
        <p class="mt-2 text-ink-muted">{{ selectedRevision.summary }}</p>
        <pre class="mt-4 max-h-72 overflow-auto bg-canvas p-4 text-xs">{{
          JSON.stringify(selectedRevision.contentJson, null, 2)
        }}</pre>
      </article>
    </div>
  </section>
</template>
