import type { RateLimitPort } from '../ports/cache'
import type { EngagementRepository } from '../ports/engagement-repository'
import type { HumanVerificationPort, ModerationPort } from '../ports/moderation'

export class EngagementError extends Error {
  constructor(
    readonly code: 'blocked' | 'invalid' | 'not_found' | 'rate_limited' | 'verification_failed',
    message: string,
    readonly retryAfterMs?: number,
  ) {
    super(message)
  }
}

export class CreateComment {
  constructor(
    private readonly repository: EngagementRepository,
    private readonly rateLimit: RateLimitPort,
    private readonly verification: HumanVerificationPort,
    private readonly moderation: ModerationPort,
  ) {}

  async execute(input: {
    authorId: string
    body: string
    documentId: string
    ipAddress?: string
    locale: 'ko' | 'en'
    parentId?: string
    turnstileToken?: string
  }) {
    const limit = await this.rateLimit.consume(`comment:${input.authorId}`, 5, 60_000)
    if (!limit.allowed)
      throw new EngagementError('rate_limited', 'Too many comments', limit.retryAfterMs)
    if (!(await this.verification.verify(input.turnstileToken, input.ipAddress)))
      throw new EngagementError('verification_failed', 'Human verification failed')
    const moderation = await this.moderation.check(input.body, input.authorId)
    try {
      return await this.repository.createComment({
        ...input,
        moderationReason: moderation.reason,
        status: moderation.verdict === 'allow' ? 'ACTIVE' : 'PENDING',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create comment'
      if (message.includes('blocked')) throw new EngagementError('blocked', message)
      if (message.includes('not found')) throw new EngagementError('not_found', message)
      throw new EngagementError('invalid', message)
    }
  }
}

export class SetDocumentLike {
  constructor(
    private readonly repository: EngagementRepository,
    private readonly rateLimit: RateLimitPort,
  ) {}

  async execute(input: { documentId: string; liked: boolean; userId: string }) {
    const limit = await this.rateLimit.consume(`like:${input.userId}`, 30, 60_000)
    if (!limit.allowed)
      throw new EngagementError('rate_limited', 'Too many like requests', limit.retryAfterMs)
    try {
      return await this.repository.setLike(input)
    } catch (error) {
      throw new EngagementError(
        'invalid',
        error instanceof Error ? error.message : 'Unable to update like',
      )
    }
  }
}

export class EditComment {
  constructor(
    private readonly repository: EngagementRepository,
    private readonly rateLimit: RateLimitPort,
    private readonly moderation: ModerationPort,
  ) {}

  async execute(input: { actorId: string; body: string; commentId: string }) {
    const limit = await this.rateLimit.consume(`comment-edit:${input.actorId}`, 10, 60_000)
    if (!limit.allowed)
      throw new EngagementError('rate_limited', 'Too many edits', limit.retryAfterMs)
    const moderation = await this.moderation.check(input.body, input.actorId)
    const result = await this.repository.editComment({
      ...input,
      moderationReason: moderation.reason,
      status: moderation.verdict === 'allow' ? 'ACTIVE' : 'PENDING',
    })
    if (!result) throw new EngagementError('not_found', 'Comment not found or not editable')
    return result
  }
}

export class ReportComment {
  constructor(
    private readonly repository: EngagementRepository,
    private readonly rateLimit: RateLimitPort,
  ) {}

  async execute(input: { commentId: string; reason: string; reporterId: string }) {
    const limit = await this.rateLimit.consume(`report:${input.reporterId}`, 10, 60 * 60_000)
    if (!limit.allowed)
      throw new EngagementError('rate_limited', 'Too many reports', limit.retryAfterMs)
    await this.repository.reportComment(input)
  }
}
