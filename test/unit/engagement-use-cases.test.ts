import { describe, expect, it, vi } from 'vitest'

import type { EngagementError } from '../../layers/engagement/application/engagement'
import { CreateComment, SetDocumentLike } from '../../layers/engagement/application/engagement'
import type { RateLimitPort } from '../../layers/engagement/ports/cache'
import type { EngagementRepository } from '../../layers/engagement/ports/engagement-repository'
import type {
  HumanVerificationPort,
  ModerationPort,
} from '../../layers/engagement/ports/moderation'

function rateLimit(allowed = true): RateLimitPort {
  return {
    consume: vi.fn().mockResolvedValue({ allowed, remaining: allowed ? 4 : 0, retryAfterMs: 500 }),
  }
}

describe('engagement use cases', () => {
  it('stores flagged or unavailable moderation results as pending', async () => {
    const createComment = vi.fn().mockResolvedValue({ id: 'comment' })
    const repository = { createComment } as unknown as EngagementRepository
    const verification = { verify: vi.fn().mockResolvedValue(true) } as HumanVerificationPort
    const moderation = {
      check: vi.fn().mockResolvedValue({ reason: 'moderation_flagged', verdict: 'review' }),
    } as ModerationPort
    await new CreateComment(repository, rateLimit(), verification, moderation).execute({
      authorId: 'member',
      body: 'review me',
      documentId: 'document',
      locale: 'ko',
    })
    expect(createComment).toHaveBeenCalledWith(
      expect.objectContaining({ moderationReason: 'moderation_flagged', status: 'PENDING' }),
    )
  })

  it('fails before moderation when human verification fails', async () => {
    const repository = {} as EngagementRepository
    const verification = { verify: vi.fn().mockResolvedValue(false) } as HumanVerificationPort
    const moderation = { check: vi.fn() } as unknown as ModerationPort
    await expect(
      new CreateComment(repository, rateLimit(), verification, moderation).execute({
        authorId: 'member',
        body: 'hello',
        documentId: 'document',
        locale: 'en',
      }),
    ).rejects.toMatchObject({ code: 'verification_failed' })
    expect(moderation.check).not.toHaveBeenCalled()
  })

  it('returns retry metadata when the like rate limit is exceeded', async () => {
    const repository = {} as EngagementRepository
    await expect(
      new SetDocumentLike(repository, rateLimit(false)).execute({
        documentId: 'document',
        liked: true,
        userId: 'member',
      }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<EngagementError>>({
        code: 'rate_limited',
        retryAfterMs: 500,
      }),
    )
  })
})
