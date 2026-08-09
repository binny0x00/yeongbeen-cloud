import { describe, expect, it } from 'vitest'

import {
  contentChecksum,
  legacyCareers,
  loadLegacyProjects,
  markdownToTiptap,
} from '../../layers/content/infrastructure/migration/legacy-content'

describe('legacy content migration', () => {
  it('loads every legacy project with deterministic checksums', async () => {
    const first = await loadLegacyProjects()
    const second = await loadLegacyProjects()

    expect(first).toHaveLength(6)
    expect(first.map(project => project.slug)).toEqual(second.map(project => project.slug))
    expect(first.map(project => project.checksum)).toEqual(second.map(project => project.checksum))
    expect(new Set(first.map(project => project.checksum)).size).toBe(first.length)
  })

  it('converts headings, lists, and paragraphs to Tiptap JSON', () => {
    const document = markdownToTiptap('# 제목\n\n본문\n\n- 첫째\n- 둘째')
    expect(document).toMatchObject({ type: 'doc' })
    expect(document.content).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'heading' }),
        expect.objectContaining({ type: 'paragraph' }),
        expect.objectContaining({ type: 'bulletList' }),
      ]),
    )
  })

  it('tracks every hardcoded career with a stable checksum', () => {
    expect(legacyCareers).toHaveLength(5)
    expect(new Set(legacyCareers.map(contentChecksum)).size).toBe(legacyCareers.length)
  })
})
