export interface OrphanMedia {
  id: string
  objectKey: string
}

export interface ContentOperationsRepository {
  deleteMedia(id: string): Promise<void>
  findOrphanMedia(before: Date, limit: number): Promise<OrphanMedia[]>
  publishScheduled(now: Date, limit: number): Promise<string[]>
}

export interface ObjectStorageCleanupPort {
  deleteObject(objectKey: string): Promise<void>
}

export interface PublicContentCachePort {
  get<T>(key: string): Promise<T | null>
  invalidate(): Promise<void>
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
}
