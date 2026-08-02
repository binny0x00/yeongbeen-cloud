import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ExperienceRow from '~/components/cards/ExperienceRow.vue'

const experience = {
  description: '실제 운영 흐름을 연결했습니다.',
  period: '2026',
  technologies: ['NUXT', 'TYPESCRIPT'],
  title: 'Builder · Yeongbeen Cloud',
}

describe('ExperienceRow', () => {
  it('링크가 있으면 전체 행을 탐색 가능한 링크로 렌더링한다', async () => {
    const wrapper = await mountSuspended(ExperienceRow, {
      props: { ...experience, to: '/projects/yeongbeen-cloud' },
    })

    expect(wrapper.get('a').attributes('href')).toBe('/projects/yeongbeen-cloud')
    expect(wrapper.get('h3').text()).toContain('Yeongbeen Cloud')
  })

  it('링크가 없으면 일반 콘텐츠 행으로 렌더링한다', async () => {
    const wrapper = await mountSuspended(ExperienceRow, {
      props: experience,
    })

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('li').text()).toContain('NUXT   TYPESCRIPT')
  })
})
