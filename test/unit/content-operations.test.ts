import { describe, expect, it, vi } from 'vitest'

import {
  CleanupOrphanMedia,
  PublishScheduledContent,
} from '../../layers/content/application/content-operations'
import type { ContentOperationsRepository } from '../../layers/content/ports/content-operations'

const clock = { now: () => new Date('2026-08-09T00:00:00.000Z') }

function repository(
  overrides: Partial<ContentOperationsRepository> = {},
): ContentOperationsRepository {
  return {
    deleteMedia: vi.fn(),
    findOrphanMedia: vi.fn().mockResolvedValue([]),
    publishScheduled: vi.fn().mockResolvedValue([]),
    ...overrides,
  }
}

describe('content operations', () => {
  it('publishes due content and invalidates the public cache once', async () => {
    const cache = { get: vi.fn(), invalidate: vi.fn(), set: vi.fn() }
    const useCase = new PublishScheduledContent(
      repository({ publishScheduled: vi.fn().mockResolvedValue(['document-1']) }),
      cache,
      clock,
    )

    await expect(useCase.execute()).resolves.toEqual({
      documentIds: ['document-1'],
      published: 1,
    })
    expect(cache.invalidate).toHaveBeenCalledOnce()
  })

  it('does not invalidate the cache when nothing was published', async () => {
    const cache = { get: vi.fn(), invalidate: vi.fn(), set: vi.fn() }
    await new PublishScheduledContent(repository(), cache, clock).execute()
    expect(cache.invalidate).not.toHaveBeenCalled()
  })

  it('keeps failed media records for a later retry', async () => {
    const storage = {
      deleteObject: vi
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('R2 unavailable')),
    }
    const persistence = repository({
      findOrphanMedia: vi.fn().mockResolvedValue([
        { id: 'media-1', objectKey: 'one.png' },
        { id: 'media-2', objectKey: 'two.png' },
      ]),
    })

    const result = await new CleanupOrphanMedia(persistence, storage, clock).execute()

    expect(result).toEqual({
      deleted: ['media-1'],
      failed: [{ id: 'media-2', message: 'R2 unavailable' }],
      scanned: 2,
    })
    expect(persistence.deleteMedia).toHaveBeenCalledWith('media-1')
    expect(persistence.deleteMedia).not.toHaveBeenCalledWith('media-2')
  })
})
