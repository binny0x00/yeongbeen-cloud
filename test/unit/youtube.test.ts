import { describe, expect, it } from 'vitest'
import { getYouTubeEmbedUrl, getYouTubeVideoId } from '../../shared/utils/youtube'

describe('getYouTubeVideoId', () => {
  it.each([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://youtube.com/shorts/dQw4w9WgXcQ',
  ])('%s에서 영상 ID를 추출한다', value => {
    expect(getYouTubeVideoId(value)).toBe('dQw4w9WgXcQ')
  })

  it.each([
    'https://example.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/channel/dQw4w9WgXcQ',
    'https://youtube.com/watch?v=invalid',
    'not-a-url',
  ])('%s는 지원하지 않는다', value => {
    expect(getYouTubeVideoId(value)).toBeNull()
  })
})

describe('getYouTubeEmbedUrl', () => {
  it('privacy-enhanced 임베드 URL을 반환한다', () => {
    expect(getYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0',
    )
  })
})
