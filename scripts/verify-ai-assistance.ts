import { randomUUID } from 'node:crypto'

import { eq } from 'drizzle-orm'

import { AssistWriting } from '../layers/admin/application/assist-writing'
import { DrizzleAiUsageRepository } from '../layers/admin/infrastructure/drizzle-ai-usage-repository'
import type { AiProvider, AiRateLimitPort } from '../layers/admin/ports/ai-provider'
import { closeDatabase, getDatabase } from '../layers/content/infrastructure/drizzle/database'
import { aiUsage, user } from '../layers/content/infrastructure/drizzle/schema'

const actorId = `ai-verify-${randomUUID()}`
const database = getDatabase()
const provider: AiProvider = {
  model: 'gpt-5.6-terra',
  async assist() {
    return {
      estimatedCostMicroUsd: 42,
      model: this.model,
      requestId: 'resp_local_verification',
      result: {
        altText: '',
        content: '검증된 제안',
        rationale: '통합 검증',
        seoDescription: '',
        seoTitle: '',
        summary: '',
        tags: [],
        title: '',
      },
      usage: { inputTokens: 20, outputTokens: 10, totalTokens: 30 },
    }
  },
}
const rateLimit: AiRateLimitPort = {
  async consume() {
    return { allowed: true, retryAfterMs: 0 }
  },
}

try {
  await database.insert(user).values({
    email: `${actorId}@example.test`,
    emailVerified: true,
    id: actorId,
    name: 'AI verification user',
    role: 'EDITOR',
  })
  await new AssistWriting(provider, new DrizzleAiUsageRepository(), rateLimit).execute({
    action: 'rewrite',
    documentId: randomUUID(),
    locale: 'ko',
    safetyIdentifier: 'b'.repeat(64),
    source: 'This content must never be stored in usage logs.',
    userId: actorId,
  })
  const rows = await database.select().from(aiUsage).where(eq(aiUsage.actorId, actorId))
  const record = rows[0]
  if (!record || record.totalTokens !== 30 || record.promptVersion.length === 0) {
    throw new Error('AI usage record was not persisted correctly')
  }
  if (JSON.stringify(record).includes('This content must never be stored')) {
    throw new Error('AI source content leaked into usage logging')
  }
  console.log('AI usage, prompt version, token accounting, and privacy logging are ready')
} finally {
  await database.delete(user).where(eq(user.id, actorId))
  await closeDatabase()
}
