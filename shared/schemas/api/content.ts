import { z } from 'zod/v4'

export const contentLocaleSchema = z.enum(['ko', 'en'])
export const contentKindSchema = z.enum(['PORTFOLIO', 'CAREER', 'POST'])

export const publicContentQuerySchema = z.object({
  cursor: z.string().max(256).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  locale: contentLocaleSchema.default('ko'),
  q: z.string().trim().max(120).optional(),
  sort: z.enum(['recent', 'oldest', 'title']).default('recent'),
  tag: z.string().trim().max(60).optional(),
})

export const publicContentItemSchema = z.object({
  id: z.string().uuid(),
  kind: contentKindSchema,
  locale: contentLocaleSchema,
  metadata: z.record(z.string(), z.unknown()),
  publishedAt: z.string().datetime().nullable(),
  slug: z.string().min(1),
  summary: z.string(),
  tags: z.array(z.string()),
  title: z.string().min(1),
})

export const publicContentPageSchema = z.object({
  items: z.array(publicContentItemSchema),
  nextCursor: z.string().nullable(),
})

export type PublicContentQuery = z.infer<typeof publicContentQuerySchema>
export type PublicContentItem = z.infer<typeof publicContentItemSchema>
