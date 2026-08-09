export interface CachePort {
  delete(key: string): Promise<void>
  deleteByPrefix(prefix: string): Promise<void>
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

export interface RateLimitPort {
  consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult>
}
