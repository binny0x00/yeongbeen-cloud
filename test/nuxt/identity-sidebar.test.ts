import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import IdentitySidebar from '~/components/layout/IdentitySidebar.vue'

describe('IdentitySidebar', () => {
  beforeEach(() => {
    useCookie('theme').value = 'light'
  })

  it('정체성, 섹션 탐색, 외부 링크를 하나의 보조 영역에 제공한다', async () => {
    const wrapper = await mountSuspended(IdentitySidebar)
    const navLinks = wrapper.findAll('nav[aria-label="페이지 섹션"] a')

    expect(wrapper.get('aside').attributes('aria-label')).toBe('개발자 정보 및 섹션 탐색')
    expect(navLinks.map(link => link.text())).toEqual([
      'OVERVIEW',
      'EXPERIENCE',
      'PROJECTS',
      'NOTES',
      'CONTACT',
    ])
    expect(navLinks[0]?.attributes('aria-current')).toBe('location')
    expect(wrapper.get('a[href="https://github.com/binny0x00"]').attributes('target')).toBe(
      '_blank',
    )
  })
})
