import {
  PublishScheduledContent,
  CleanupOrphanMedia,
} from '../layers/content/application/content-operations'
import { closeDatabase } from '../layers/content/infrastructure/drizzle/database'
import { DrizzleContentOperationsRepository } from '../layers/content/infrastructure/drizzle/drizzle-content-operations'
import { R2MediaStorage } from '../layers/content/infrastructure/r2-media-storage'
import { RedisPublicContentCache } from '../layers/content/infrastructure/redis-public-content-cache'
import { SystemClock } from '../layers/content/infrastructure/system-clock'
import { closeRedis } from '../layers/engagement/infrastructure/redis-adapter'

const repository = new DrizzleContentOperationsRepository()
const clock = new SystemClock()

try {
  const publication = await new PublishScheduledContent(
    repository,
    new RedisPublicContentCache(),
    clock,
  ).execute()
  console.log(`Published ${publication.published} scheduled localization(s)`)

  const r2Keys = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET',
    'R2_PUBLIC_BASE_URL',
  ] as const
  if (r2Keys.every(key => process.env[key])) {
    const cleanup = await new CleanupOrphanMedia(repository, new R2MediaStorage(), clock).execute()
    console.log(
      `Scanned ${cleanup.scanned}, deleted ${cleanup.deleted.length}, failed ${cleanup.failed.length} orphan media object(s)`,
    )
    if (cleanup.failed.length > 0) process.exitCode = 1
  } else {
    console.log('R2 is not configured; orphan media cleanup was skipped')
  }
} finally {
  await Promise.all([closeDatabase(), closeRedis()])
}
