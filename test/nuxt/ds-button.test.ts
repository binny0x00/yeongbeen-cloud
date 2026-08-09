import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import DsButton from '../../layers/design-system/app/components/DsButton.vue'

describe('DsButton', () => {
  it('44px 조작 영역과 native disabled를 제공한다', async () => {
    const wrapper = await mountSuspended(DsButton, {
      props: { disabled: true },
      slots: { default: '저장' },
    })

    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBe('')
    expect(button.classes()).toContain('s3-control')
  })

  it('비활성 링크를 키보드 탐색에서 제외한다', async () => {
    const wrapper = await mountSuspended(DsButton, {
      props: { disabled: true, to: '/ko/portfolio' },
      slots: { default: '포트폴리오' },
    })

    expect(wrapper.get('a').attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('a').attributes('tabindex')).toBe('-1')
  })
})
