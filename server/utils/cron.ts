import { timingSafeEqual } from 'node:crypto'

import type { H3Event } from 'h3'

function equalSecret(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)
  return (
    actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

export function requireCronSecret(event: H3Event): void {
  const expected = process.env.CRON_SECRET
  const authorization = getHeader(event, 'authorization')
  const supplied = getHeader(event, 'x-cron-secret') ?? authorization?.replace(/^Bearer\s+/i, '')
  if (!expected || !supplied || !equalSecret(supplied, expected)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid cron credential' })
  }
}
