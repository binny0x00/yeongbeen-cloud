import { closeDatabase, getDatabase } from '../layers/content/infrastructure/drizzle/database'
import { session } from '../layers/content/infrastructure/drizzle/schema'
import { seedSprint3, SPRINT3_OWNER_ID } from './lib/seed-sprint3'

export const E2E_SESSION_TOKEN = 'sprint3-e2e-session-token'

if (process.env.E2E_TESTING !== '1') {
  throw new Error('Refusing to create an E2E session without E2E_TESTING=1')
}

try {
  await seedSprint3()
  await getDatabase()
    .insert(session)
    .values({
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      id: 'sprint3-e2e-session',
      token: E2E_SESSION_TOKEN,
      userId: SPRINT3_OWNER_ID,
    })
    .onConflictDoUpdate({
      set: { expiresAt: new Date('2099-01-01T00:00:00.000Z'), updatedAt: new Date() },
      target: session.id,
    })
  console.log('Deterministic E2E owner session is ready')
} finally {
  await closeDatabase()
}
