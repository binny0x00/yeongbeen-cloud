import {
  CleanupOrphanMedia,
  PublishScheduledContent,
} from '@content-domain/application/content-operations'
import { DrizzleContentOperationsRepository } from '@content-domain/infrastructure/drizzle/drizzle-content-operations'
import { R2MediaStorage } from '@content-domain/infrastructure/r2-media-storage'
import { RedisPublicContentCache } from '@content-domain/infrastructure/redis-public-content-cache'
import { SystemClock } from '@content-domain/infrastructure/system-clock'

const repository = new DrizzleContentOperationsRepository()
const cache = new RedisPublicContentCache()
const clock = new SystemClock()

export const publishScheduledContent = new PublishScheduledContent(repository, cache, clock)
export const cleanupOrphanMedia = new CleanupOrphanMedia(repository, new R2MediaStorage(), clock)

export async function invalidatePublicContentCache(): Promise<void> {
  if (!process.env.REDIS_URL) return
  try {
    await cache.invalidate()
  } catch (error) {
    console.error('Public content cache invalidation failed', error)
  }
}
