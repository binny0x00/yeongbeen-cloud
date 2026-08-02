import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ArticleRow from '~/components/cards/ArticleRow.vue'

describe('ArticleRow', () => {
  it('날짜와 카테고리, 제목, 요약을 접근 가능한 링크로 렌더링한다', async () => {
    const wrapper = await mountSuspended(ArticleRow, {
      props: {
        category: 'Component Design',
        date: '2026',
        description: '역할과 변형 지점을 분리해 복잡도를 낮춘 기록',
        title: '재사용 가능한 리포트 카드 컴포넌트를 설계한 과정',
        to: '/writing/reusable-report-card',
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/writing/reusable-report-card')
    expect(link.attributes('aria-label')).toContain('글 읽기')
    expect(wrapper.text()).toContain('2026 · Component Design')
    expect(wrapper.get('h3').text()).toContain('리포트 카드')
  })
})
