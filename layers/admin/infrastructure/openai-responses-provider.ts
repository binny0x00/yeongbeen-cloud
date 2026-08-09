import { buildAiMessages, type AiAssistInput } from '../domain/ai-assistance'
import type { AiProvider, AiProviderResponse, AiTokenUsage } from '../ports/ai-provider'
import { AiProviderError } from '../ports/ai-provider'
import { aiAssistResultSchema } from '../../../shared/schemas/api/ai-assistance'

interface OpenAiResponse {
  error?: { message?: string }
  id?: string
  model?: string
  output?: Array<{
    content?: Array<{ refusal?: string; text?: string; type?: string }>
    type?: string
  }>
  output_text?: string
  status?: string
  usage?: Partial<{
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }>
}

const resultJsonSchema = {
  additionalProperties: false,
  properties: {
    altText: { type: 'string' },
    content: { type: 'string' },
    rationale: { type: 'string' },
    seoDescription: { type: 'string' },
    seoTitle: { type: 'string' },
    summary: { type: 'string' },
    tags: { items: { type: 'string' }, type: 'array' },
    title: { type: 'string' },
  },
  required: [
    'altText',
    'content',
    'rationale',
    'seoDescription',
    'seoTitle',
    'summary',
    'tags',
    'title',
  ],
  type: 'object',
} as const

function tokenUsage(response: OpenAiResponse): AiTokenUsage {
  return {
    inputTokens: response.usage?.input_tokens ?? 0,
    outputTokens: response.usage?.output_tokens ?? 0,
    totalTokens: response.usage?.total_tokens ?? 0,
  }
}

function estimateCost(usage: AiTokenUsage): number | null {
  const inputPrice = process.env.OPENAI_INPUT_COST_USD_PER_MILLION
  const outputPrice = process.env.OPENAI_OUTPUT_COST_USD_PER_MILLION
  if (!inputPrice?.trim() || !outputPrice?.trim()) return null
  const inputRate = Number(inputPrice)
  const outputRate = Number(outputPrice)
  if (!Number.isFinite(inputRate) || !Number.isFinite(outputRate)) return null
  return Math.round(usage.inputTokens * inputRate + usage.outputTokens * outputRate)
}

function outputText(response: OpenAiResponse): string {
  if (response.output_text) return response.output_text
  const parts = response.output?.flatMap(item => item.content ?? []) ?? []
  if (parts.some(part => part.type === 'refusal' || part.refusal)) {
    throw new AiProviderError('refused', 'The AI request was refused')
  }
  return parts
    .filter(part => part.type === 'output_text' && part.text)
    .map(part => part.text)
    .join('')
}

export class OpenAiResponsesProvider implements AiProvider {
  readonly model: string

  constructor(
    private readonly apiKey = process.env.OPENAI_API_KEY,
    model = process.env.OPENAI_MODEL ?? 'gpt-5.6-terra',
    private readonly request: typeof globalThis.fetch = globalThis.fetch,
  ) {
    this.model = model
  }

  async assist(input: AiAssistInput): Promise<AiProviderResponse> {
    if (!this.apiKey) throw new AiProviderError('unavailable', 'OPENAI_API_KEY is not configured')
    const messages = buildAiMessages(input)

    let response: Response
    try {
      response = await this.request('https://api.openai.com/v1/responses', {
        body: JSON.stringify({
          input: messages.user,
          instructions: messages.system,
          max_output_tokens: 4096,
          model: this.model,
          reasoning: { effort: 'low' },
          safety_identifier: input.safetyIdentifier,
          store: false,
          text: {
            format: {
              name: 'writing_assistance',
              schema: resultJsonSchema,
              strict: true,
              type: 'json_schema',
            },
          },
        }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        signal: AbortSignal.timeout(60_000),
      })
    } catch {
      throw new AiProviderError('unavailable', 'OpenAI request failed')
    }

    if (!response.ok) throw new AiProviderError('unavailable', 'OpenAI request was not successful')
    const payload = (await response.json()) as OpenAiResponse
    if (payload.error || payload.status === 'failed') {
      throw new AiProviderError('unavailable', 'OpenAI response failed')
    }

    let decoded: unknown
    try {
      decoded = JSON.parse(outputText(payload))
    } catch (error) {
      if (error instanceof AiProviderError) throw error
      throw new AiProviderError('invalid_output', 'OpenAI returned invalid JSON')
    }
    const parsed = aiAssistResultSchema.safeParse(decoded)
    if (!parsed.success) {
      throw new AiProviderError('invalid_output', 'OpenAI output did not match the schema')
    }
    const usage = tokenUsage(payload)
    return {
      estimatedCostMicroUsd: estimateCost(usage),
      model: payload.model ?? this.model,
      requestId: payload.id ?? 'unknown',
      result: parsed.data,
      usage,
    }
  }
}
