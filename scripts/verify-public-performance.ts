import { performance } from 'node:perf_hooks'

import { ListPublicContent } from '../layers/content/application/public-content'
import { closeDatabase } from '../layers/content/infrastructure/drizzle/database'
import {
  DrizzlePublicContentRepository,
  PostgresSearchAdapter,
} from '../layers/content/infrastructure/drizzle/postgres-public-content'
import { seedSprint3 } from './lib/seed-sprint3'

try {
  await seedSprint3()
  const useCase = new ListPublicContent(
    new DrizzlePublicContentRepository(),
    new PostgresSearchAdapter(),
  )
  const durations: number[] = []
  for (let index = 0; index < 30; index += 1) {
    const started = performance.now()
    const result = await useCase.execute({ kind: 'POST', limit: 20, locale: 'ko', sort: 'latest' })
    durations.push(performance.now() - started)
    if (result.items.length === 0) throw new Error('Performance fixture is missing')
  }
  const sorted = durations.slice().sort((left, right) => left - right)
  const p95 = sorted[Math.ceil(sorted.length * 0.95) - 1] ?? Number.POSITIVE_INFINITY
  if (p95 >= 400) throw new Error(`Public read p95 ${p95.toFixed(1)}ms exceeds 400ms`)
  console.log(`Public read p95 ${p95.toFixed(1)}ms (${durations.length} samples)`)
} finally {
  await closeDatabase()
}
