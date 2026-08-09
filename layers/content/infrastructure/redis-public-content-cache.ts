import { RedisAdapter } from '../../engagement/infrastructure/redis-adapter'
import type { PublicContentCachePort } from '../ports/content-operations'

const PREFIX = 'content:'

export class RedisPublicContentCache implements PublicContentCachePort {
  constructor(private readonly redis = new RedisAdapter()) {}

  get<T>(key: string): Promise<T | null> {
    return this.redis.get<T>(`${PREFIX}${key}`)
  }

  invalidate(): Promise<void> {
    return this.redis.deleteByPrefix(PREFIX)
  }

  set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    return this.redis.set(`${PREFIX}${key}`, value, ttlSeconds)
  }
}
