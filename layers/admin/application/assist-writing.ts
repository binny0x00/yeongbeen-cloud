import { AI_PROMPT_VERSION, type AiAssistInput } from '../domain/ai-assistance'
import type {
  AiProvider,
  AiProviderResponse,
  AiRateLimitPort,
  AiUsageRepository,
} from '../ports/ai-provider'
import { AiProviderError } from '../ports/ai-provider'

export class AiAssistanceError extends Error {
  constructor(
    readonly code: 'invalid_output' | 'rate_limited' | 'refused' | 'unavailable',
    message: string,
    readonly retryAfterMs?: number,
  ) {
    super(message)
  }
}

export class AssistWriting {
  constructor(
    private readonly provider: AiProvider,
    private readonly usage: AiUsageRepository,
    private readonly rateLimit: AiRateLimitPort,
  ) {}

  async execute(input: AiAssistInput): Promise<AiProviderResponse> {
    const rate = await this.rateLimit.consume(input.userId)
    if (!rate.allowed) {
      throw new AiAssistanceError(
        'rate_limited',
        'AI assistance rate limit exceeded',
        rate.retryAfterMs,
      )
    }

    try {
      const response = await this.provider.assist(input)
      await this.usage.record({
        action: input.action,
        actorId: input.userId,
        documentId: input.documentId,
        estimatedCostMicroUsd: response.estimatedCostMicroUsd,
        inputTokens: response.usage.inputTokens,
        locale: input.locale,
        model: response.model,
        outputTokens: response.usage.outputTokens,
        promptVersion: AI_PROMPT_VERSION,
        providerRequestId: response.requestId,
        status: 'SUCCEEDED',
        totalTokens: response.usage.totalTokens,
      })
      return response
    } catch (error) {
      const providerError =
        error instanceof AiProviderError
          ? error
          : new AiProviderError('unavailable', 'AI provider unavailable')
      await this.usage.record({
        action: input.action,
        actorId: input.userId,
        documentId: input.documentId,
        errorCode: providerError.code,
        estimatedCostMicroUsd: null,
        inputTokens: 0,
        locale: input.locale,
        model: this.provider.model,
        outputTokens: 0,
        promptVersion: AI_PROMPT_VERSION,
        status: 'FAILED',
        totalTokens: 0,
      })
      throw new AiAssistanceError(providerError.code, providerError.message)
    }
  }
}
