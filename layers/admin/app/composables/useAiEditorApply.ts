import type { AiAction, AiAssistResult } from '../../domain/ai-assistance'
import { withFirstImageAlt } from '../../../content/editor/ai-apply'
import { editorJsonToMarkdown, markdownToEditorJson } from '../../../content/editor/markdown'

type Locale = 'ko' | 'en'
type Draft = { contentJson: Record<string, unknown>; summary: string; title: string }

export function useAiEditorApply(input: {
  drafts: Record<Locale, Draft>
  manualSaveOnly: Set<Locale>
  saveTimers: Partial<Record<Locale, ReturnType<typeof setTimeout>>>
  seoDrafts: Record<Locale, { description: string; title: string }>
  status: Record<Locale, string>
  translate: (key: string) => string
}) {
  function source(locale: Locale): string {
    return [
      `TITLE:\n${input.drafts[locale].title}`,
      `SUMMARY:\n${input.drafts[locale].summary}`,
      `SEO TITLE:\n${input.seoDrafts[locale].title}`,
      `SEO DESCRIPTION:\n${input.seoDrafts[locale].description}`,
      `CONTENT:\n${editorJsonToMarkdown(input.drafts[locale].contentJson)}`,
    ].join('\n\n')
  }

  function requireManualSave(locale: Locale): void {
    input.manualSaveOnly.add(locale)
    if (input.saveTimers[locale]) clearTimeout(input.saveTimers[locale])
    input.status[locale] = input.translate('admin.ai.appliedUnsaved')
  }

  async function apply(
    sourceLocale: Locale,
    payload: { action: AiAction; result: AiAssistResult },
  ): Promise<void> {
    const { action, result } = payload
    const targetLocale =
      action === 'translate' ? (sourceLocale === 'ko' ? 'en' : 'ko') : sourceLocale

    if (action === 'tags') {
      await navigator.clipboard.writeText(result.tags.join(', '))
      input.status[sourceLocale] = input.translate('admin.ai.copied')
      return
    }
    if (action === 'alt') {
      const applied = withFirstImageAlt(input.drafts[sourceLocale].contentJson, result.altText)
      if (!applied.updated) {
        await navigator.clipboard.writeText(result.altText)
        input.status[sourceLocale] = input.translate('admin.ai.copied')
        return
      }
      requireManualSave(sourceLocale)
      input.drafts[sourceLocale].contentJson = applied.document
      return
    }

    requireManualSave(targetLocale)
    if (action === 'summarize') input.drafts[targetLocale].summary = result.summary
    else if (action === 'seo') {
      input.seoDrafts[targetLocale].title = result.seoTitle
      input.seoDrafts[targetLocale].description = result.seoDescription
    } else if (action === 'translate') {
      input.drafts[targetLocale].title = result.title
      input.drafts[targetLocale].summary = result.summary
      input.drafts[targetLocale].contentJson = markdownToEditorJson(result.content)
      if (result.seoTitle) input.seoDrafts[targetLocale].title = result.seoTitle
      if (result.seoDescription) input.seoDrafts[targetLocale].description = result.seoDescription
    } else {
      const current = editorJsonToMarkdown(input.drafts[targetLocale].contentJson)
      const markdown =
        action === 'continue' ? `${current}\n\n${result.content}`.trim() : result.content
      input.drafts[targetLocale].contentJson = markdownToEditorJson(markdown)
    }
  }

  return { apply, source }
}
