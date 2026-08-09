import { describe, expect, it } from 'vitest'

import { DocumentPublication } from '../../layers/content/domain/document'

describe('DocumentPublication', () => {
  it('locale별 초안을 발행 상태로 전환할 수 있다', () => {
    const publication = new DocumentPublication('ko', 'DRAFT')

    expect(publication.canTransitionTo('PUBLISHED')).toBe(true)
    expect(publication.canTransitionTo('ARCHIVED')).toBe(false)
  })

  it('보관된 콘텐츠는 초안으로만 복구한다', () => {
    const publication = new DocumentPublication('en', 'ARCHIVED')

    expect(publication.canTransitionTo('DRAFT')).toBe(true)
    expect(publication.canTransitionTo('PUBLISHED')).toBe(false)
  })
})
