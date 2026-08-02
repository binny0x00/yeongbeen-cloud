import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ProjectMediaActions from '../../app/components/projects/ProjectMediaActions.vue'

describe('ProjectMediaActions', () => {
  it('GitHub 저장소와 배포 사이트를 접근 가능한 아이콘 링크로 제공한다', async () => {
    const wrapper = await mountSuspended(ProjectMediaActions, {
      props: {
        repository: 'https://github.com/binny0x00/yeongbeen-cloud',
        title: 'Yeongbeen Cloud',
        website: 'https://yeongbeen.cloud',
      },
    })

    const repositoryLink = wrapper.get(
      'a[aria-label="Yeongbeen Cloud GitHub 저장소 새 창에서 열기"]',
    )
    expect(repositoryLink.attributes('href')).toBe('https://github.com/binny0x00/yeongbeen-cloud')
    expect(repositoryLink.attributes('target')).toBe('_blank')
    expect(wrapper.get('a[aria-label="Yeongbeen Cloud 배포 사이트 새 창에서 열기"]')).toBeTruthy()
  })

  it('YouTube URL을 페이지 안에서 재생 가능한 iframe으로 렌더링한다', async () => {
    const wrapper = await mountSuspended(ProjectMediaActions, {
      props: {
        title: 'Orbit',
        youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    const player = wrapper.get('iframe[title="Orbit YouTube 영상"]')
    expect(player.attributes('src')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0',
    )
    expect(player.attributes()).toHaveProperty('allowfullscreen')
  })

  it('외부 자료가 없으면 빈 컨테이너를 렌더링하지 않는다', async () => {
    const wrapper = await mountSuspended(ProjectMediaActions, {
      props: { title: 'Empty project' },
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })
})
