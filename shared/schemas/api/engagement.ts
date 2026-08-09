import { z } from 'zod/v4'

export const commentQuerySchema = z.object({ locale: z.enum(['ko', 'en']).default('ko') })
export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  locale: z.enum(['ko', 'en']),
  parentId: z.string().uuid().optional(),
  turnstileToken: z.string().max(2048).optional(),
})
export const editCommentSchema = z.object({ body: z.string().trim().min(1).max(4000) })
export const likeSchema = z.object({ liked: z.boolean() })
export const reportCommentSchema = z.object({ reason: z.string().trim().min(3).max(500) })
export const notificationReadSchema = z.object({
  ids: z.array(z.string().uuid()).max(100).optional(),
})
export const moderationActionSchema = z.object({ reason: z.string().trim().min(3).max(500) })
