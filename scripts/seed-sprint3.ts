import { closeDatabase } from '../layers/content/infrastructure/drizzle/database'
import { seedSprint3 } from './lib/seed-sprint3'

try {
  await seedSprint3()
  console.log('Sprint 3 seed data is ready')
} finally {
  await closeDatabase()
}
