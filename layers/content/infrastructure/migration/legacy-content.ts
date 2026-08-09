import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

import matter from 'gray-matter'
import { marked } from 'marked'
import { z } from 'zod/v4'

const projectFrontmatterSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative(),
  period: z.string().min(1),
  publishedAt: z.coerce.date(),
  repository: z.string().url().optional(),
  role: z.string().min(1),
  status: z.enum(['completed', 'in-progress', 'maintained']),
  tags: z.array(z.string().min(1)).min(1),
  title: z.string().min(1),
  updatedAt: z.coerce.date().optional(),
  website: z.string().url().optional(),
  youtube: z.string().url().optional(),
})

export interface LegacyProject {
  body: string
  checksum: string
  filePath: string
  frontmatter: z.infer<typeof projectFrontmatterSchema>
  html: string
  searchText: string
  slug: string
  tiptap: Record<string, unknown>
}

export const legacyProjectMetadata: Record<string, Record<string, unknown>> = {
  anb: { outcome: '교내 2025 하계 NCCCOSS 경진대회 우수상', outcomeLabel: 'AWARD' },
  'dark-tourism-guide': { outcome: '호남 ICT 지원사업 선정', outcomeLabel: 'SELECTION' },
  'finance-simulator': { outcome: '시즌톤 본선 진출 · Figma 특별상', outcomeLabel: 'AWARD' },
  'lost-pet-service': {
    outcome: '카카오테크캠퍼스 2기 팀 프로젝트 최우수상',
    outcomeLabel: 'AWARD',
  },
  orbit: { outcome: '버전 검증 lock으로 편집 데이터 충돌 방지', outcomeLabel: 'ENGINEERING' },
  'yeongbeen-cloud': {
    outcome: 'CI/CD · Railway · Cloudflare production 운영',
    outcomeLabel: 'OPERATIONS',
  },
}

export const legacyCareers = [
  {
    description:
      '5개월 합숙형 CS 기반 AI-Native 교육과정을 수료하고 5인 팀으로 AI 프레젠테이션 플랫폼을 개발했습니다.',
    organization: 'KRAFTON JUNGLE',
    period: '2026.03 — 2026.07',
    role: 'SW-AI Lab 12기',
    slug: 'krafton-jungle-sw-ai-lab-12',
    technologies: ['TypeScript', 'React', 'NestJS', 'PostgreSQL', 'Redis', 'FastAPI'],
    title: 'SW-AI Lab 12기 · KRAFTON JUNGLE',
  },
  {
    description:
      'Android 앱 개발 교육을 이수하고 위치 기반 실종 동물 정보 공유 서비스를 개발해 팀 프로젝트 최우수상을 수상했습니다.',
    organization: 'KAKAO TECH CAMPUS',
    period: '2024.04 — 2024.11',
    role: 'Android Track 2기',
    slug: 'kakao-tech-campus-android-2',
    technologies: ['Android', 'Kotlin', 'Coroutine', 'Hilt', 'Room', 'Retrofit'],
    title: 'Android Track 2기 · KAKAO TECH CAMPUS',
  },
  {
    description:
      '의공학을 주전공, 컴퓨터정보통신공학을 복수전공하고 블록체인 기반 부동산 계약 시스템을 졸업논문으로 개발했습니다.',
    organization: '전남대학교',
    period: '2019.03 — 2025.08',
    role: '의공학 · 컴퓨터정보통신공학',
    slug: 'chonnam-national-university',
    technologies: ['TypeScript', 'Express', 'TypeORM', 'PostgreSQL', 'ethers'],
    title: '의공학과 · 컴퓨터정보통신공학과 · 전남대학교',
  },
  {
    description:
      '금융 멀티 시뮬레이션 플랫폼 프론트엔드를 개발해 시즌톤 본선에 진출하고 Figma 특별상을 수상했습니다.',
    organization: '9oormthonUNIV',
    period: '2025.08 — 2025.09',
    role: 'Frontend · 4기',
    slug: '9oormthonuniv-4',
    technologies: ['Flutter', 'Dart', 'Riverpod', 'Freezed', 'GoRouter'],
    title: 'Frontend · 9oormthonUNIV 4기',
  },
  {
    description:
      'AI 기반 다크투어리즘 가이드 앱을 개발해 APAC Solution Challenge에 출품하고 호남 ICT 지원사업에 선정됐습니다.',
    organization: 'GDG on Campus',
    period: '2025.04 — 2025.05',
    role: 'Frontend',
    slug: 'gdg-on-campus-dark-tourism',
    technologies: ['Flutter', 'Dart', 'Firebase Auth', 'Crashlytics'],
    title: 'Frontend · GDG on Campus',
  },
] as const

function paragraph(content: string): Record<string, unknown> {
  return { content: [{ text: content, type: 'text' }], type: 'paragraph' }
}

export function markdownToTiptap(markdown: string): Record<string, unknown> {
  const content: Record<string, unknown>[] = []
  let listItems: Record<string, unknown>[] = []

  const flushList = () => {
    if (listItems.length === 0) return
    content.push({ content: listItems, type: 'bulletList' })
    listItems = []
  }

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) {
      flushList()
      continue
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line)
    if (heading) {
      flushList()
      content.push({
        attrs: { level: heading[1]?.length ?? 2 },
        content: [{ text: heading[2] ?? '', type: 'text' }],
        type: 'heading',
      })
      continue
    }

    const list = /^[-*]\s+(.+)$/.exec(line)
    if (list) {
      listItems.push({ content: [paragraph(list[1] ?? '')], type: 'listItem' })
      continue
    }

    flushList()
    content.push(paragraph(line))
  }
  flushList()

  return { content, type: 'doc' }
}

export function contentChecksum(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

export async function loadLegacyProjects(root = process.cwd()): Promise<LegacyProject[]> {
  const directory = resolve(root, 'content/projects')
  const filenames = (await readdir(directory)).filter(file => file.endsWith('.md')).sort()

  return Promise.all(
    filenames.map(async filename => {
      const filePath = resolve(directory, filename)
      const source = await readFile(filePath, 'utf8')
      const parsed = matter(source)
      const frontmatter = projectFrontmatterSchema.parse(parsed.data)
      const slug = basename(filename, '.md')
      const metadata = legacyProjectMetadata[slug] ?? {}

      return {
        body: parsed.content.trim(),
        checksum: contentChecksum({ body: parsed.content.trim(), frontmatter, metadata }),
        filePath,
        frontmatter,
        html: marked.parse(parsed.content, { async: false }) as string,
        searchText: `${frontmatter.title} ${frontmatter.description} ${parsed.content}`
          .replace(/[`#*_()]/g, ' ')
          .replaceAll('[', ' ')
          .replaceAll(']', ' ')
          .replace(/\s+/g, ' ')
          .trim(),
        slug,
        tiptap: markdownToTiptap(parsed.content),
      }
    }),
  )
}
