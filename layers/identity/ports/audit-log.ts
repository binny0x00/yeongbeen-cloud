export interface AuditEvent {
  action: string
  actorId?: string
  ipHash?: string
  metadata?: Record<string, unknown>
  resourceId?: string
  resourceType: string
}

export interface AuditLogPort {
  record(event: AuditEvent): Promise<void>
}
