import { createClient } from 'redis'

import type { CachePort, RateLimitPort, RateLimitResult } from '../ports/cache'

type RedisClient = ReturnType<typeof createClient>

let client: RedisClient | undefined
let connection: Promise<RedisClient> | undefined

export async function getRedis(): Promise<RedisClient> {
  if (client?.isReady) return client
  if (connection) return connection

  const url = process.env.REDIS_URL
  if (!url) throw new Error('REDIS_URL is required to use cache and rate limiting')

  client = createClient({
    socket: {
      connectTimeout: 10_000,
      reconnectStrategy: retries => Math.min(50 * 2 ** retries + Math.random() * 100, 3_000),
    },
    url,
  })
  client.on('error', error => console.error('Redis client error', error))
  connection = client.connect().then(() => client as RedisClient)

  try {
    return await connection
  } finally {
    connection = undefined
  }
}

export async function closeRedis(): Promise<void> {
  if (client?.isOpen) await client.close()
  client = undefined
  connection = undefined
}

export class RedisAdapter implements CachePort, RateLimitPort {
  async delete(key: string): Promise<void> {
    await (await getRedis()).del(key)
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const redis = await getRedis()
    for await (const keys of redis.scanIterator({ COUNT: 100, MATCH: `${prefix}*` })) {
      if (keys.length > 0) await redis.del(keys)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await (await getRedis()).get(key)
    return value === null ? null : (JSON.parse(value) as T)
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await (await getRedis()).set(key, JSON.stringify(value), { EX: ttlSeconds })
  }

  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const result = (await (
      await getRedis()
    ).eval(
      `local current = redis.call('INCR', KEYS[1])
       if current == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
       local ttl = redis.call('PTTL', KEYS[1])
       return { current, ttl }`,
      { arguments: [String(windowMs)], keys: [`rate:${key}`] },
    )) as [number, number]

    const [current, ttl] = result
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      retryAfterMs: current <= limit ? 0 : Math.max(0, ttl),
    }
  }
}
