import { defineCollection, defineContentConfig } from '@nuxt/content'
import { projectContentSchema, writingContentSchema } from './shared/schemas/content'

const projects = defineCollection({
  type: 'page',
  source: 'projects/**/*.md',
  schema: projectContentSchema,
})

const writing = defineCollection({
  type: 'page',
  source: 'writing/**/*.md',
  schema: writingContentSchema,
})

export default defineContentConfig({
  collections: {
    projects,
    writing,
  },
})
