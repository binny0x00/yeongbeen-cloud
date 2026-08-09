import type { DocumentKind, PublicationState } from '../domain/document'

export interface StoredDocument {
  allowComments: boolean
  allowLikes: boolean
  id: string
  kind: DocumentKind
  localizations: Array<{
    locale: 'ko' | 'en'
    slug: string
    state: PublicationState
    summary: string
    title: string
    version: number
  }>
}

export interface DocumentRepository {
  findById(id: string): Promise<StoredDocument | null>
}
