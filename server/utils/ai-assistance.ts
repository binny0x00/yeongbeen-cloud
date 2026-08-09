import { createHash } from 'node:crypto'

import { AssistWriting, AiAssistanceError } from '@admin/application/assist-writing'
import { DrizzleAiUsageRepository } from '@admin/infrastructure/drizzle-ai-usage-repository'
import { OpenAiResponsesProvider } from '@admin/infrastructure/openai-responses-provider'
import { RedisAiRateLimit } from '@admin/infrastructure/redis-ai-rate-limit'

export const assistWriting = new AssistWriting(
  new OpenAiResponsesProvider(),
  new DrizzleAiUsageRepository(),
  new RedisAiRateLimit(),
)

export function safetyIdentifier(userId: string): string {
  return createHash('sha256').update(userId).digest('hex')
}

export function throwAiAssistanceError(error: unknown): never {
  if (!(error instanceof AiAssistanceError)) throw error
  const statusCode = {
    invalid_output: 502,
    rate_limited: 429,
    refused: 422,
    unavailable: 503,
  }[error.code]
  throw createError({
    data: error.retryAfterMs ? { retryAfterMs: error.retryAfterMs } : undefined,
    statusCode,
    statusMessage: error.message,
  })
}
