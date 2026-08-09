import { afterEach, describe, expect, it, vi } from 'vitest'

import { OpenAiModerationAdapter } from '../../layers/engagement/infrastructure/openai-moderation-adapter'
import { TurnstileAdapter } from '../../layers/engagement/infrastructure/turnstile-adapter'

describe('engagement safety adapters', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('routes comments to review when moderation is not configured', async () => {
    vi.stubEnv('OPENAI_API_KEY', '')
    await expect(new OpenAiModerationAdapter().check('text', 'member')).resolves.toEqual({
      reason: 'moderation_unconfigured',
      verdict: 'review',
    })
  })

  it('requires Turnstile configuration in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    await expect(new TurnstileAdapter().verify(undefined, undefined)).resolves.toBe(false)
  })
})
