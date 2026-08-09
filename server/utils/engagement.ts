import type { H3Event } from 'h3'

import { EngagementError } from '@engagement/application/engagement'
import { DrizzleEngagementRepository } from '@engagement/infrastructure/drizzle-engagement-repository'
import { OpenAiModerationAdapter } from '@engagement/infrastructure/openai-moderation-adapter'
import { RedisAdapter } from '@engagement/infrastructure/redis-adapter'
import { TurnstileAdapter } from '@engagement/infrastructure/turnstile-adapter'
import { getAuth } from '@identity/infrastructure/auth'

export const engagementRepository = new DrizzleEngagementRepository()
export const engagementRateLimit = new RedisAdapter()
export const engagementModeration = new OpenAiModerationAdapter()
export const engagementVerification = new TurnstileAdapter()

export async function optionalSession(event: H3Event) {
  try {
    return await getAuth().api.getSession({ headers: event.headers })
  } catch {
    return null
  }
}

export function throwEngagementError(error: unknown): never {
  if (!(error instanceof EngagementError)) throw error
  const statusCode = {
    blocked: 403,
    invalid: 400,
    not_found: 404,
    rate_limited: 429,
    verification_failed: 400,
  }[error.code]
  throw createError({
    data: error.retryAfterMs ? { retryAfterMs: error.retryAfterMs } : undefined,
    statusCode,
    statusMessage: error.message,
  })
}
