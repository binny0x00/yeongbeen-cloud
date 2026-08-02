import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ProjectCard from '~/components/cards/ProjectCard.vue'

const project = {
  category: 'FRONTEND ENGINEERING',
  description: '복잡한 정보를 명확한 화면으로 정리했습니다.',
  index: 1,
  outcome: 'production 환경에서 안정적으로 운영 중',
  outcomeLabel: 'OPERATIONS',
  tags: ['NUXT', 'TYPESCRIPT'],
  title: 'YEONGBEEN.CLOUD',
  to: '/projects/yeongbeen-cloud',
}

describe('ProjectCard', () => {
  it('프로젝트 정보를 editorial row 링크로 렌더링한다', async () => {
    const wrapper = await mountSuspended(ProjectCard, { props: project })

    expect(wrapper.get('a').attributes('href')).toBe('/projects/yeongbeen-cloud')
    expect(wrapper.get('h3').text()).toContain('YEONGBEEN.CLOUD')
    expect(wrapper.text()).toContain('01')
    expect(wrapper.text()).toContain('NUXT · TYPESCRIPT')
    expect(wrapper.get('[data-project-outcome]').text()).toContain('OPERATIONS')
    expect(wrapper.text()).toContain('CASE STUDY')
    expect(wrapper.find('[data-project-media-slot]').exists()).toBe(true)
  })

  it('외부 프로젝트 링크에는 새 창 정보를 제공한다', async () => {
    const wrapper = await mountSuspended(ProjectCard, {
      props: { ...project, external: true, to: 'https://example.com/project' },
    })

    expect(wrapper.get('a').attributes('href')).toBe('https://example.com/project')
    expect(wrapper.get('a').attributes('target')).toBe('_blank')
    expect(wrapper.get('a').attributes('rel')).toBe('noreferrer')
    expect(wrapper.get('a').attributes('aria-label')).toContain('새 창')
  })
})
