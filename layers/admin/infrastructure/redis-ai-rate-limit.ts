import { RedisAdapter } from '../../engagement/infrastructure/redis-adapter'
import type { AiRateLimitPort } from '../ports/ai-provider'

export class RedisAiRateLimit implements AiRateLimitPort {
  private readonly redis = new RedisAdapter()

  async consume(userId: string): Promise<{ allowed: boolean; retryAfterMs: number }> {
    const result = await this.redis.consume(`ai-assist:${userId}`, 20, 60 * 60 * 1000)
    return { allowed: result.allowed, retryAfterMs: result.retryAfterMs }
  }
}
