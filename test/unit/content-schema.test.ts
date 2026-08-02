import { describe, expect, it } from 'vitest'
import { projectContentSchema, writingContentSchema } from '../../shared/schemas/content'

const validProject = {
  category: 'PERSONAL PLATFORM',
  description: '개인 개발 공간',
  order: 0,
  period: '2026.08 —',
  publishedAt: new Date('2026-08-01'),
  role: 'Frontend Developer',
  status: 'in-progress' as const,
  tags: ['NUXT', 'TYPESCRIPT'],
  title: 'Yeongbeen Cloud',
}

const validWriting = {
  description: '공통 컴포넌트 설계 기록',
  order: 1,
  readingMinutes: 5,
  status: 'published' as const,
  tags: ['VUE'],
  title: '재사용 가능한 컴포넌트 설계',
}

describe('projectContentSchema', () => {
  it('기본값을 포함한 유효한 프로젝트 데이터를 반환한다', () => {
    expect(projectContentSchema.parse(validProject)).toMatchObject({
      featured: false,
      title: validProject.title,
    })
  })

  it('빈 태그와 잘못된 저장소 URL을 거부한다', () => {
    const result = projectContentSchema.safeParse({
      ...validProject,
      repository: 'not-a-url',
      tags: [],
    })

    expect(result.success).toBe(false)
  })
})

describe('writingContentSchema', () => {
  it('유효한 글 메타데이터를 허용한다', () => {
    expect(writingContentSchema.safeParse(validWriting).success).toBe(true)
  })

  it('0분 읽기 시간과 지원하지 않는 상태를 거부한다', () => {
    const result = writingContentSchema.safeParse({
      ...validWriting,
      readingMinutes: 0,
      status: 'archived',
    })

    expect(result.success).toBe(false)
  })
})
