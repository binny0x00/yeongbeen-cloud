import type { Clock } from '../ports/clock'
import type {
  ContentOperationsRepository,
  ObjectStorageCleanupPort,
  PublicContentCachePort,
} from '../ports/content-operations'

export class PublishScheduledContent {
  constructor(
    private readonly repository: ContentOperationsRepository,
    private readonly cache: PublicContentCachePort,
    private readonly clock: Clock,
  ) {}

  async execute(limit = 100): Promise<{ documentIds: string[]; published: number }> {
    const documentIds = await this.repository.publishScheduled(this.clock.now(), limit)
    if (documentIds.length > 0) await this.cache.invalidate()
    return { documentIds, published: documentIds.length }
  }
}

export class CleanupOrphanMedia {
  constructor(
    private readonly repository: ContentOperationsRepository,
    private readonly storage: ObjectStorageCleanupPort,
    private readonly clock: Clock,
  ) {}

  async execute(input: { limit?: number; minimumAgeMs?: number } = {}) {
    const limit = input.limit ?? 100
    const minimumAgeMs = input.minimumAgeMs ?? 24 * 60 * 60 * 1_000
    const before = new Date(this.clock.now().getTime() - minimumAgeMs)
    const candidates = await this.repository.findOrphanMedia(before, limit)
    const deleted: string[] = []
    const failed: Array<{ id: string; message: string }> = []

    for (const candidate of candidates) {
      try {
        await this.storage.deleteObject(candidate.objectKey)
        await this.repository.deleteMedia(candidate.id)
        deleted.push(candidate.id)
      } catch (error) {
        failed.push({
          id: candidate.id,
          message: error instanceof Error ? error.message : 'Unknown cleanup error',
        })
      }
    }
    return { deleted, failed, scanned: candidates.length }
  }
}
