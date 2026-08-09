import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

export type Database = PostgresJsDatabase<typeof schema>

let database: Database | undefined
let client: ReturnType<typeof postgres> | undefined

export function getDatabase(): Database {
  if (database) return database

  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is required to use persistence')

  client = postgres(url, {
    connect_timeout: 10,
    idle_timeout: 20,
    max: Number(process.env.DATABASE_POOL_SIZE ?? 10),
    onnotice: () => undefined,
  })
  database = drizzle({ client, schema })
  return database
}

export async function closeDatabase(): Promise<void> {
  await client?.end({ timeout: 5 })
  client = undefined
  database = undefined
}
