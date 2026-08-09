import { describe, expect, it, vi } from 'vitest'

import {
  GetPublicContent,
  ListPublicContent,
} from '../../layers/content/application/public-content'
import type {
  PublicContentRepository,
  SearchPort,
} from '../../layers/content/ports/public-content-repository'

const page = { items: [], nextCursor: null }

describe('public content use cases', () => {
  it('delegates ordinary lists without invoking search', async () => {
    const repository = {
      list: vi.fn().mockResolvedValue(page),
    } as unknown as PublicContentRepository
    const search = { findDocumentIds: vi.fn() } as SearchPort
    const useCase = new ListPublicContent(repository, search)

    await expect(
      useCase.execute({ kind: 'PORTFOLIO', limit: 12, locale: 'ko', sort: 'recent' }),
    ).resolves.toEqual(page)
    expect(search.findDocumentIds).not.toHaveBeenCalled()
    expect(repository.list).toHaveBeenCalledOnce()
  })

  it('short-circuits when a search has no matches', async () => {
    const repository = { list: vi.fn() } as unknown as PublicContentRepository
    const search = { findDocumentIds: vi.fn().mockResolvedValue([]) } as SearchPort
    const useCase = new ListPublicContent(repository, search)

    await expect(
      useCase.execute({ kind: 'POST', limit: 12, locale: 'en', q: 'nuxt', sort: 'recent' }),
    ).resolves.toEqual(page)
    expect(repository.list).not.toHaveBeenCalled()
  })

  it('loads a published detail through the repository port', async () => {
    const findBySlug = vi.fn().mockResolvedValue(null)
    const repository = { findBySlug } as unknown as PublicContentRepository
    const useCase = new GetPublicContent(repository)

    await expect(useCase.execute('PORTFOLIO', 'ko', 'orbit')).resolves.toBeNull()
    expect(findBySlug).toHaveBeenCalledWith('PORTFOLIO', 'ko', 'orbit')
  })
})
