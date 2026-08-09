import { sql } from 'drizzle-orm'

import { getDatabase } from '@content-domain/infrastructure/drizzle/database'
import { getRedis } from '@engagement/infrastructure/redis-adapter'

export default defineEventHandler(async event => {
  const checks = { database: false, redis: false }

  const [databaseResult, redisResult] = await Promise.allSettled([
    getDatabase().execute(sql`select 1`),
    getRedis().then(client => client.ping()),
  ])
  checks.database = databaseResult.status === 'fulfilled'
  checks.redis = redisResult.status === 'fulfilled'

  if (!checks.database || !checks.redis) setResponseStatus(event, 503)
  return {
    checks,
    status: checks.database && checks.redis ? 'ready' : 'not-ready',
    timestamp: new Date().toISOString(),
  }
})
