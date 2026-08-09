import { eq } from 'drizzle-orm'

import type { DocumentRepository, StoredDocument } from '../../ports/document-repository'
import type { Database } from './database'
import { document } from './schema'

export class DrizzleDocumentRepository implements DocumentRepository {
  constructor(private readonly database: Database) {}

  async findById(id: string): Promise<StoredDocument | null> {
    const result = await this.database.query.document.findFirst({
      where: eq(document.id, id),
      with: { localizations: true },
    })

    if (!result) return null
    return {
      allowComments: result.allowComments,
      allowLikes: result.allowLikes,
      id: result.id,
      kind: result.kind,
      localizations: result.localizations.map(localization => ({
        locale: localization.locale,
        slug: localization.slug,
        state: localization.state,
        summary: localization.summary,
        title: localization.title,
        version: localization.version,
      })),
    }
  }
}
