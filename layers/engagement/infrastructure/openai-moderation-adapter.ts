import type { ModerationPort, ModerationResult } from '../ports/moderation'

export class OpenAiModerationAdapter implements ModerationPort {
  async check(text: string, _safetyIdentifier: string): Promise<ModerationResult> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return { reason: 'moderation_unconfigured', verdict: 'review' }
    try {
      const response = await fetch('https://api.openai.com/v1/moderations', {
        body: JSON.stringify({
          input: text,
          model: 'omni-moderation-latest',
        }),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!response.ok) return { reason: 'moderation_unavailable', verdict: 'review' }
      const result = (await response.json()) as { results?: Array<{ flagged?: boolean }> }
      return result.results?.[0]?.flagged
        ? { reason: 'moderation_flagged', verdict: 'review' }
        : { verdict: 'allow' }
    } catch {
      return { reason: 'moderation_unavailable', verdict: 'review' }
    }
  }
}
