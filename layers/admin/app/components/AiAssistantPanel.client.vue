<script setup lang="ts">
import type { AiAction, AiAssistResult } from '../../domain/ai-assistance'

const props = defineProps<{
  documentId: string
  locale: 'ko' | 'en'
  originalSeoDescription: string
  originalSeoTitle: string
  originalSummary: string
  source: string
}>()
const emit = defineEmits<{
  apply: [payload: { action: AiAction; result: AiAssistResult }]
}>()
const { t } = useI18n()
const action = ref<AiAction>('outline')
const instruction = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<AiAssistResult | null>(null)

const actions = computed(() =>
  (['outline', 'continue', 'rewrite', 'summarize', 'tags', 'seo', 'alt', 'translate'] as const).map(
    value => ({ label: t(`admin.ai.actions.${value}`), value }),
  ),
)

function beforeText(): string {
  if (action.value === 'summarize') return props.originalSummary
  if (action.value === 'seo')
    return `${props.originalSeoTitle}\n${props.originalSeoDescription}`.trim()
  return props.source
}

function afterText(): string {
  if (!result.value) return ''
  if (action.value === 'summarize') return result.value.summary
  if (action.value === 'tags') return result.value.tags.join(', ')
  if (action.value === 'seo') {
    return `${result.value.seoTitle}\n${result.value.seoDescription}`.trim()
  }
  if (action.value === 'alt') return result.value.altText
  if (action.value === 'translate') {
    return [
      `TITLE:\n${result.value.title}`,
      `SUMMARY:\n${result.value.summary}`,
      `SEO TITLE:\n${result.value.seoTitle}`,
      `SEO DESCRIPTION:\n${result.value.seoDescription}`,
      `CONTENT:\n${result.value.content}`,
    ].join('\n\n')
  }
  if (action.value === 'continue') return `${props.source}\n\n${result.value.content}`.trim()
  return result.value.content
}

async function requestAssistance(): Promise<void> {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const response = await $fetch<{ result: AiAssistResult }>('/api/v1/admin/ai/assist', {
      body: {
        action: action.value,
        documentId: props.documentId,
        instruction: instruction.value || undefined,
        locale: props.locale,
        source: props.source,
      },
      method: 'POST',
    })
    result.value = response.result
  } catch {
    error.value = t('admin.ai.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <details class="s3-panel p-4">
    <summary class="type-label cursor-pointer">{{ t('admin.ai.title') }}</summary>
    <div class="mt-4 grid gap-4">
      <DsSelect
        v-model="action"
        :label="t('admin.ai.action')"
        :name="`ai-action-${locale}`"
        :options="actions"
      />
      <DsTextarea
        v-model="instruction"
        :label="t('admin.ai.instruction')"
        :name="`ai-instruction-${locale}`"
        :rows="2"
      />
      <DsAlert
        :title="t('admin.ai.privacyTitle')"
        kind="info"
        :message="t('admin.ai.privacyMessage')"
      />
      <DsButton :disabled="loading || !source.trim()" @click="requestAssistance">
        {{ loading ? t('admin.ai.generating') : t('admin.ai.generate') }}
      </DsButton>
      <DsAlert v-if="error" :title="t('admin.ai.errorTitle')" kind="error" :message="error" />
      <div v-if="result" class="grid gap-3">
        <div class="grid gap-3 lg:grid-cols-2">
          <section class="border border-border bg-paper p-3">
            <h3 class="type-label mb-2">{{ t('admin.ai.before') }}</h3>
            <pre class="max-h-72 overflow-auto whitespace-pre-wrap text-sm">{{ beforeText() }}</pre>
          </section>
          <section class="border border-accent bg-surface p-3">
            <h3 class="type-label mb-2">{{ t('admin.ai.after') }}</h3>
            <pre class="max-h-72 overflow-auto whitespace-pre-wrap text-sm">{{ afterText() }}</pre>
          </section>
        </div>
        <p class="text-sm text-ink-muted">{{ result.rationale }}</p>
        <DsButton @click="emit('apply', { action, result })">{{ t('admin.ai.apply') }}</DsButton>
      </div>
    </div>
  </details>
</template>
