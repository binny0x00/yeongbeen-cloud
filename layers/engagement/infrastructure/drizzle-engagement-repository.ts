import type { EngagementRepository } from '../ports/engagement-repository'
import { DrizzleCommentRepository } from './drizzle-comment-repository'
import { DrizzleModerationRepository } from './drizzle-moderation-repository'
import { DrizzleReactionRepository } from './drizzle-reaction-repository'

export class DrizzleEngagementRepository implements EngagementRepository {
  private readonly comments = new DrizzleCommentRepository()
  private readonly moderation = new DrizzleModerationRepository()
  private readonly reactions = new DrizzleReactionRepository()

  approveComment: EngagementRepository['approveComment'] = input =>
    this.moderation.approveComment(input)
  blockUser: EngagementRepository['blockUser'] = input => this.moderation.blockUser(input)
  createComment: EngagementRepository['createComment'] = input => this.comments.createComment(input)
  deleteComment: EngagementRepository['deleteComment'] = input => this.comments.deleteComment(input)
  editComment: EngagementRepository['editComment'] = input => this.comments.editComment(input)
  getComment: EngagementRepository['getComment'] = id => this.comments.getComment(id)
  getLike: EngagementRepository['getLike'] = (documentId, userId) =>
    this.reactions.getLike(documentId, userId)
  hideComment: EngagementRepository['hideComment'] = input => this.moderation.hideComment(input)
  listComments: EngagementRepository['listComments'] = (documentId, locale, viewerId) =>
    this.comments.listComments(documentId, locale, viewerId)
  listModerationQueue: EngagementRepository['listModerationQueue'] = () =>
    this.moderation.listModerationQueue()
  listNotifications: EngagementRepository['listNotifications'] = userId =>
    this.reactions.listNotifications(userId)
  markNotificationsRead: EngagementRepository['markNotificationsRead'] = (userId, ids) =>
    this.reactions.markNotificationsRead(userId, ids)
  reportComment: EngagementRepository['reportComment'] = input => this.comments.reportComment(input)
  setLike: EngagementRepository['setLike'] = input => this.reactions.setLike(input)
}
