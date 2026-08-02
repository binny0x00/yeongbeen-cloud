import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import UiButton from '~/components/ui/UiButton.vue'

describe('UiButton', () => {
  it('비활성 버튼에 native disabled 상태를 전달한다', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { disabled: true },
      slots: { default: '저장' },
    })

    expect(wrapper.get('button').attributes('disabled')).toBe('')
  })

  it('비활성 링크를 보조 기술과 키보드 탐색에서 제외한다', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { disabled: true, to: '/projects' },
      slots: { default: '프로젝트 보기' },
    })
    const link = wrapper.get('a')

    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('tabindex')).toBe('-1')
  })
})
