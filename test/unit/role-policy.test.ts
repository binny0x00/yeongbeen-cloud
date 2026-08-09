import { describe, expect, it } from 'vitest'

import { RolePolicy } from '../../layers/identity/domain/role-policy'

describe('RolePolicy', () => {
  const policy = new RolePolicy()

  it('OWNER에게 발행과 운영 권한을 부여한다', () => {
    expect(policy.allows('OWNER', 'content:publish')).toBe(true)
    expect(policy.allows('OWNER', 'settings:manage')).toBe(true)
  })

  it('EDITOR는 작성만, MEMBER는 댓글 작성만 허용한다', () => {
    expect(policy.allows('EDITOR', 'content:write')).toBe(true)
    expect(policy.allows('EDITOR', 'content:publish')).toBe(false)
    expect(policy.allows('MEMBER', 'comment:write')).toBe(true)
    expect(policy.allows('MEMBER', 'comment:moderate')).toBe(false)
  })
})
