import type { HumanVerificationPort } from '../ports/moderation'

export class TurnstileAdapter implements HumanVerificationPort {
  async verify(token: string | undefined, ipAddress: string | undefined): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) return process.env.NODE_ENV !== 'production'
    if (!token) return false
    try {
      const body = new URLSearchParams({ secret, response: token })
      if (ipAddress) body.set('remoteip', ipAddress)
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body,
        method: 'POST',
      })
      if (!response.ok) return false
      const result = (await response.json()) as { success?: boolean }
      return result.success === true
    } catch {
      return false
    }
  }
}
