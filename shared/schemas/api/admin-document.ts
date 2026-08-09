import { z } from 'zod/v4'

const editorJsonSchema = z
  .record(z.string(), z.unknown())
  .refine(value => value.type === 'doc', 'Tiptap doc required')

export const createDocumentSchema = z.object({
  kind: z.enum(['PORTFOLIO', 'CAREER', 'POST']),
  locale: z.enum(['ko', 'en']).default('ko'),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().max(500).default(''),
  title: z.string().min(1).max(200),
})

export const saveLocalizationSchema = z.object({
  contentJson: editorJsonSchema,
  locale: z.enum(['ko', 'en']),
  seo: z
    .object({
      description: z.string().max(300).optional(),
      image: z.string().url().optional(),
      title: z.string().max(200).optional(),
    })
    .default({}),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().max(500),
  title: z.string().min(1).max(200),
  version: z.number().int().positive(),
})

export const scheduleDocumentSchema = z.object({
  locale: z.enum(['ko', 'en']),
  scheduledAt: z.coerce
    .date()
    .refine(value => value.getTime() > Date.now(), 'Future date required'),
})

export const mediaSignSchema = z.object({
  filename: z.string().min(1).max(240),
  mimeType: z.string().min(1).max(120),
  size: z
    .number()
    .int()
    .positive()
    .max(50 * 1024 * 1024),
})
