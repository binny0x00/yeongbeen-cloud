type Locale = 'ko' | 'en'

export function useAdminDocumentLifecycle(input: {
  documentId: string
  refresh: () => Promise<unknown>
  saveDraft: (locale: Locale) => Promise<boolean>
  scheduleAt: Record<Locale, string>
  status: Record<Locale, string>
  translate: (key: string) => string
}) {
  async function publish(locale: Locale): Promise<void> {
    if (!(await input.saveDraft(locale))) return
    await $fetch(`/api/v1/admin/documents/${input.documentId}/publish`, {
      body: { locale },
      method: 'POST',
    })
    input.status[locale] = input.translate('admin.published')
    await input.refresh()
  }

  async function schedule(locale: Locale): Promise<void> {
    if (!(await input.saveDraft(locale))) return
    await $fetch(`/api/v1/admin/documents/${input.documentId}/schedule`, {
      body: { locale, scheduledAt: new Date(input.scheduleAt[locale]).toISOString() },
      method: 'POST',
    })
    input.status[locale] = input.translate('admin.scheduled')
    await input.refresh()
  }

  async function restore(revisionId: string): Promise<void> {
    await $fetch(`/api/v1/admin/documents/${input.documentId}/restore`, {
      body: { revisionId },
      method: 'POST',
    })
    await input.refresh()
    location.reload()
  }

  return { publish, restore, schedule }
}
