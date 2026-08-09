import type { Database } from '@content-domain/infrastructure/drizzle/database'
import { auditLog } from '@content-domain/infrastructure/drizzle/schema'

import type { AuditEvent, AuditLogPort } from '../ports/audit-log'

export class DrizzleAuditLog implements AuditLogPort {
  constructor(private readonly database: Database) {}

  async record(event: AuditEvent): Promise<void> {
    await this.database.insert(auditLog).values({
      action: event.action,
      actorId: event.actorId,
      ipHash: event.ipHash,
      metadata: event.metadata ?? {},
      resourceId: event.resourceId,
      resourceType: event.resourceType,
    })
  }
}
