import { describe, expect, it, vi } from 'vitest'

import {
  SaveLocalization,
  TransitionDocument,
} from '../../layers/content/application/admin-documents'
import type { AdminDocumentRepository } from '../../layers/content/ports/admin-document-repository'

describe('admin document use cases', () => {
  it('forwards versioned saves through the repository port', async () => {
    const save = vi.fn().mockResolvedValue({ currentVersion: 4, status: 'conflict' })
    const repository = { save } as unknown as AdminDocumentRepository
    const input = {
      contentJson: { content: [], type: 'doc' },
      documentId: 'd1',
      locale: 'ko' as const,
      seo: {},
      slug: 'sprint-3',
      summary: '',
      title: 'Sprint 3',
      userId: 'u1',
      version: 3,
    }
    await expect(new SaveLocalization(repository).execute(input)).resolves.toEqual({
      currentVersion: 4,
      status: 'conflict',
    })
    expect(save).toHaveBeenCalledWith(input)
  })

  it('keeps publishing as an explicit transition', async () => {
    const transition = vi.fn().mockResolvedValue(null)
    const repository = { transition } as unknown as AdminDocumentRepository
    await new TransitionDocument(repository).execute({
      documentId: 'd1',
      locale: 'en',
      state: 'PUBLISHED',
    })
    expect(transition).toHaveBeenCalledWith({ documentId: 'd1', locale: 'en', state: 'PUBLISHED' })
  })
})
