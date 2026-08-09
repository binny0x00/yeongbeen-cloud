import type { AiAssistInput, AiAssistResult } from '../domain/ai-assistance'

export interface AiTokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

export interface AiProviderResponse {
  estimatedCostMicroUsd: number | null
  model: string
  requestId: string
  result: AiAssistResult
  usage: AiTokenUsage
}

export interface AiProvider {
  readonly model: string
  assist(input: AiAssistInput): Promise<AiProviderResponse>
}

export interface AiRateLimitPort {
  consume(userId: string): Promise<{ allowed: boolean; retryAfterMs: number }>
}

export interface AiUsageRecord {
  action: AiAssistInput['action']
  actorId: string
  documentId: string
  errorCode?: string
  estimatedCostMicroUsd: number | null
  inputTokens: number
  locale: AiAssistInput['locale']
  model: string
  outputTokens: number
  promptVersion: string
  providerRequestId?: string
  status: 'FAILED' | 'SUCCEEDED'
  totalTokens: number
}

export interface AiUsageRepository {
  record(input: AiUsageRecord): Promise<void>
}

export class AiProviderError extends Error {
  constructor(
    readonly code: 'invalid_output' | 'refused' | 'unavailable',
    message: string,
  ) {
    super(message)
  }
}
