import { describe, expect, it } from 'vitest'

import { CommentPolicy } from '../../layers/engagement/domain/comment-policy'

describe('comment policy', () => {
  const policy = new CommentPolicy()

  it('allows only one reply level in the same locale and document', () => {
    expect(() =>
      policy.assertCanReply({ documentId: 'd1', locale: 'ko', parentId: null }, 'd1', 'ko'),
    ).not.toThrow()
    expect(() =>
      policy.assertCanReply({ documentId: 'd1', locale: 'ko', parentId: 'p1' }, 'd1', 'ko'),
    ).toThrow('Only one reply level')
    expect(() =>
      policy.assertCanReply({ documentId: 'd1', locale: 'en', parentId: null }, 'd1', 'ko'),
    ).toThrow('same localized document')
  })

  it('allows authors or moderators to mutate a comment', () => {
    expect(() => policy.assertCanMutate('author', 'author', false)).not.toThrow()
    expect(() => policy.assertCanMutate('owner', 'author', true)).not.toThrow()
    expect(() => policy.assertCanMutate('member', 'author', false)).toThrow('permission denied')
  })
})
