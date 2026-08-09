export const documentKinds = ['PORTFOLIO', 'CAREER', 'POST'] as const
export type DocumentKind = (typeof documentKinds)[number]

export const publicationStates = ['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const
export type PublicationState = (typeof publicationStates)[number]

export class DocumentPublication {
  constructor(
    readonly locale: 'ko' | 'en',
    readonly state: PublicationState,
  ) {}

  canTransitionTo(next: PublicationState): boolean {
    const transitions: Record<PublicationState, PublicationState[]> = {
      ARCHIVED: ['DRAFT'],
      DRAFT: ['REVIEW', 'PUBLISHED', 'SCHEDULED'],
      PUBLISHED: ['ARCHIVED', 'DRAFT'],
      REVIEW: ['DRAFT', 'PUBLISHED', 'SCHEDULED'],
      SCHEDULED: ['DRAFT', 'PUBLISHED'],
    }

    return transitions[this.state].includes(next)
  }
}
