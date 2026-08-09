export interface ModerationResult {
  reason?: string
  verdict: 'allow' | 'review'
}

export interface ModerationPort {
  check(text: string, safetyIdentifier: string): Promise<ModerationResult>
}

export interface HumanVerificationPort {
  verify(token: string | undefined, ipAddress: string | undefined): Promise<boolean>
}
