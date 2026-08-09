export class CommentPolicy {
  assertCanReply(
    parent: { documentId: string; locale: 'ko' | 'en'; parentId: string | null },
    documentId: string,
    locale: 'ko' | 'en',
  ): void {
    if (parent.documentId !== documentId || parent.locale !== locale)
      throw new Error('Reply target must belong to the same localized document')
    if (parent.parentId) throw new Error('Only one reply level is allowed')
  }

  assertCanMutate(actorId: string, authorId: string, canModerate: boolean): void {
    if (actorId !== authorId && !canModerate) throw new Error('Comment permission denied')
  }
}
