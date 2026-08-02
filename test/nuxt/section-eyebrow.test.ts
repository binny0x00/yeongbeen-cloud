import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SectionEyebrow from '~/components/ui/SectionEyebrow.vue'

describe('SectionEyebrow', () => {
  it('숫자 접두사 없이 제품 지향 라벨을 표시한다', async () => {
    const wrapper = await mountSuspended(SectionEyebrow, {
      props: { label: 'PROJECTS' },
    })

    expect(wrapper.text()).toBe('PROJECTS')
    expect(wrapper.text()).not.toMatch(/^\d/)
    expect(wrapper.attributes('data-tone')).toBe('default')
  })

  it('강조 섹션에 primary tone을 제공한다', async () => {
    const wrapper = await mountSuspended(SectionEyebrow, {
      props: { label: 'OVERVIEW', tone: 'primary' },
    })

    expect(wrapper.attributes('data-tone')).toBe('primary')
    expect(wrapper.get('span').classes()).toContain('bg-accent')
  })
})
