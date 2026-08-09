export interface CommentView {
  author: { id: string; image: string | null; name: string } | null
  body: string | null
  createdAt: string
  id: string
  locale: 'ko' | 'en'
  parentId: string | null
  status: 'ACTIVE' | 'PENDING' | 'HIDDEN' | 'DELETED'
  updatedAt: string
}

export interface EngagementRepository {
  approveComment(input: { actorId: string; commentId: string }): Promise<boolean>
  blockUser(input: { blockedBy: string; reason: string; userId: string }): Promise<void>
  createComment(input: {
    authorId: string
    body: string
    documentId: string
    locale: 'ko' | 'en'
    moderationReason?: string
    parentId?: string
    status: 'ACTIVE' | 'PENDING'
  }): Promise<CommentView>
  deleteComment(input: {
    actorId: string
    canModerate: boolean
    commentId: string
  }): Promise<boolean>
  editComment(input: {
    actorId: string
    body: string
    commentId: string
    moderationReason?: string
    status: 'ACTIVE' | 'PENDING'
  }): Promise<CommentView | null>
  getLike(documentId: string, userId?: string): Promise<{ count: number; liked: boolean }>
  getComment(id: string): Promise<{
    authorId: string
    documentId: string
    locale: 'ko' | 'en'
    parentId: string | null
  } | null>
  hideComment(input: { actorId: string; commentId: string; reason: string }): Promise<boolean>
  listComments(documentId: string, locale: 'ko' | 'en', viewerId?: string): Promise<CommentView[]>
  listModerationQueue(): Promise<
    Array<{
      authorId: string
      authorName: string
      body: string
      commentId: string
      createdAt: string
      moderationReason: string | null
      reportReason: string | null
      status: 'ACTIVE' | 'PENDING' | 'HIDDEN' | 'DELETED'
    }>
  >
  listNotifications(userId: string): Promise<
    Array<{
      createdAt: string
      id: string
      message: string
      readAt: string | null
      resourceId: string
      type: 'REPLY' | 'MODERATION'
    }>
  >
  markNotificationsRead(userId: string, ids?: string[]): Promise<number>
  reportComment(input: { commentId: string; reason: string; reporterId: string }): Promise<void>
  setLike(input: {
    documentId: string
    liked: boolean
    userId: string
  }): Promise<{ count: number; liked: boolean }>
}
