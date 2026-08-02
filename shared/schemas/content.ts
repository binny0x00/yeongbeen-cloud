import { z } from 'zod/v4'

const requiredText = z.string().min(1)
const tags = z.array(requiredText).min(1)

export const projectContentSchema = z.object({
  category: requiredText,
  description: requiredText,
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative(),
  period: requiredText,
  publishedAt: z.date(),
  repository: z.string().url().optional(),
  role: requiredText,
  status: z.enum(['completed', 'in-progress', 'maintained']),
  tags,
  title: requiredText,
  updatedAt: z.date().optional(),
  website: z.string().url().optional(),
})

export const writingContentSchema = z.object({
  category: requiredText,
  description: requiredText,
  order: z.number().int().nonnegative(),
  publishedAt: z.date().optional(),
  readingMinutes: z.number().int().positive().optional(),
  series: requiredText.optional(),
  status: z.enum(['draft', 'planned', 'published']).default('draft'),
  tags,
  title: requiredText,
  updatedAt: z.date().optional(),
})
