import type {
  ListPublicContentInput,
  PublicContentDetail,
  PublicContentPage,
  PublicContentRepository,
  SearchPort,
} from '../ports/public-content-repository'

export class ListPublicContent {
  constructor(
    private readonly repository: PublicContentRepository,
    private readonly search: SearchPort,
  ) {}

  async execute(input: ListPublicContentInput): Promise<PublicContentPage> {
    const searchIds = input.q
      ? await this.search.findDocumentIds({
          kind: input.kind,
          limit: input.limit * 4,
          locale: input.locale,
          query: input.q,
        })
      : undefined
    if (input.q && searchIds?.length === 0) return { items: [], nextCursor: null }
    return this.repository.list({ ...input, searchIds })
  }
}

export class GetPublicContent {
  constructor(private readonly repository: PublicContentRepository) {}

  execute(
    kind: ListPublicContentInput['kind'],
    locale: 'ko' | 'en',
    slug: string,
  ): Promise<PublicContentDetail | null> {
    return this.repository.findBySlug(kind, locale, slug)
  }
}
