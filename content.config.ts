import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod/v4'

const requiredText = z.string().min(1)
const tags = z.array(requiredText).min(1)

const projects = defineCollection({
  type: 'page',
  source: 'projects/**/*.md',
  schema: z.object({
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
  }),
})

const writing = defineCollection({
  type: 'page',
  source: 'writing/**/*.md',
  schema: z.object({
    description: requiredText,
    order: z.number().int().nonnegative(),
    publishedAt: z.date().optional(),
    readingMinutes: z.number().int().positive().optional(),
    series: requiredText.optional(),
    status: z.enum(['draft', 'planned', 'published']).default('draft'),
    tags,
    title: requiredText,
    updatedAt: z.date().optional(),
  }),
})

export default defineContentConfig({
  collections: {
    projects,
    writing,
  },
})
