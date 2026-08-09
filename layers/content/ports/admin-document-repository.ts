export interface AdminLocalization {
  contentJson: Record<string, unknown>
  id: string
  locale: 'ko' | 'en'
  scheduledAt: string | null
  seo: Record<string, unknown>
  slug: string
  state: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  summary: string
  title: string
  version: number
}

export interface AdminDocument {
  id: string
  kind: 'PORTFOLIO' | 'CAREER' | 'POST'
  localizations: AdminLocalization[]
  updatedAt: string
}

export interface AdminRevision {
  contentJson: Record<string, unknown>
  createdAt: string
  id: string
  locale: 'ko' | 'en'
  summary: string
  title: string
  version: number
}

export interface SaveLocalizationInput {
  contentJson: Record<string, unknown>
  documentId: string
  locale: 'ko' | 'en'
  seo: Record<string, unknown>
  slug: string
  summary: string
  title: string
  userId: string
  version: number
}

export type SaveLocalizationResult =
  | { localization: AdminLocalization; status: 'saved' }
  | { currentVersion: number; status: 'conflict' }

export interface AdminDocumentRepository {
  create(input: {
    authorId: string
    kind: AdminDocument['kind']
    locale: 'ko' | 'en'
    slug: string
    summary: string
    title: string
  }): Promise<AdminDocument>
  findById(id: string): Promise<(AdminDocument & { revisions: AdminRevision[] }) | null>
  list(): Promise<AdminDocument[]>
  restore(input: {
    documentId: string
    revisionId: string
    userId: string
  }): Promise<AdminLocalization | null>
  save(input: SaveLocalizationInput): Promise<SaveLocalizationResult>
  transition(input: {
    documentId: string
    locale: 'ko' | 'en'
    scheduledAt?: Date
    state: AdminLocalization['state']
  }): Promise<AdminLocalization | null>
}

export interface MediaStoragePort {
  signUpload(input: {
    mimeType: string
    objectKey: string
    size: number
  }): Promise<{ method: 'PUT'; publicUrl: string; uploadUrl: string }>
}
