import type { PublicContentItem, PublicContentQuery } from '../../../shared/schemas/api/content'

export interface PublicContentDetail extends PublicContentItem {
  contentJson: Record<string, unknown>
  renderedHtml: string
  seo: Record<string, unknown>
}

export interface PublicContentPage {
  items: PublicContentItem[]
  nextCursor: string | null
}

export interface ListPublicContentInput extends PublicContentQuery {
  kind: 'PORTFOLIO' | 'CAREER' | 'POST'
  searchIds?: string[]
}

export interface PublicContentRepository {
  findBySlug(
    kind: ListPublicContentInput['kind'],
    locale: 'ko' | 'en',
    slug: string,
  ): Promise<PublicContentDetail | null>
  list(input: ListPublicContentInput): Promise<PublicContentPage>
}

export interface SearchPort {
  findDocumentIds(input: {
    kind: ListPublicContentInput['kind']
    limit: number
    locale: 'ko' | 'en'
    query: string
  }): Promise<string[]>
}
