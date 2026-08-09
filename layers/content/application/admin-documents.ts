import type {
  AdminDocument,
  AdminDocumentRepository,
  AdminLocalization,
  SaveLocalizationInput,
  SaveLocalizationResult,
} from '../ports/admin-document-repository'

export class CreateDocument {
  constructor(private readonly repository: AdminDocumentRepository) {}
  execute(input: {
    authorId: string
    kind: AdminDocument['kind']
    locale: 'ko' | 'en'
    slug: string
    summary: string
    title: string
  }) {
    return this.repository.create(input)
  }
}

export class SaveLocalization {
  constructor(private readonly repository: AdminDocumentRepository) {}
  execute(input: SaveLocalizationInput): Promise<SaveLocalizationResult> {
    return this.repository.save(input)
  }
}

export class TransitionDocument {
  constructor(private readonly repository: AdminDocumentRepository) {}
  execute(input: {
    documentId: string
    locale: 'ko' | 'en'
    scheduledAt?: Date
    state: AdminLocalization['state']
  }) {
    return this.repository.transition(input)
  }
}
