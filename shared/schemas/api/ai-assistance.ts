import { z } from 'zod/v4'

export const aiAssistRequestSchema = z.object({
  action: z.enum([
    'outline',
    'continue',
    'rewrite',
    'summarize',
    'tags',
    'seo',
    'alt',
    'translate',
  ]),
  documentId: z.string().uuid(),
  instruction: z.string().trim().max(500).optional(),
  locale: z.enum(['ko', 'en']),
  source: z.string().trim().min(1).max(50_000),
})

export const aiAssistResultSchema = z.object({
  altText: z.string().max(500),
  content: z.string().max(50_000),
  rationale: z.string().max(1_000),
  seoDescription: z.string().max(300),
  seoTitle: z.string().max(200),
  summary: z.string().max(500),
  tags: z.array(z.string().min(1).max(60)).max(8),
  title: z.string().max(200),
})
