import postgres from 'postgres'

import { closeRedis, RedisAdapter } from '../layers/engagement/infrastructure/redis-adapter'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required')

const sql = postgres(databaseUrl, { max: 1 })

try {
  const [{ tableCount }] = await sql<{ tableCount: number }[]>`
    SELECT count(*)::integer AS "tableCount"
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('user', 'session', 'account', 'document', 'document_localization')
  `

  if (tableCount !== 5) {
    throw new Error(`Expected 5 core tables after migration, found ${tableCount}`)
  }

  const redis = new RedisAdapter()
  const verificationKey = `sprint3:verify:${Date.now()}`
  await redis.set(verificationKey, { ready: true }, 30)

  const cached = await redis.get<{ ready: boolean }>(verificationKey)
  if (!cached?.ready) throw new Error('Redis cache round trip failed')

  const first = await redis.consume(verificationKey, 1, 30_000)
  const second = await redis.consume(verificationKey, 1, 30_000)
  if (!first.allowed || second.allowed || second.retryAfterMs <= 0) {
    throw new Error('Redis atomic rate limit verification failed')
  }

  await redis.delete(verificationKey)
  await redis.delete(`rate:${verificationKey}`)
  console.log('PostgreSQL migrations and Redis adapters are ready')
} finally {
  await Promise.all([sql.end(), closeRedis()])
}
