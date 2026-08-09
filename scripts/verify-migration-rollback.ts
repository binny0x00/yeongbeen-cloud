import { randomBytes } from 'node:crypto'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const sourceUrl = process.env.DATABASE_URL
if (!sourceUrl) throw new Error('DATABASE_URL is required')

const databaseName = `yb_migration_${randomBytes(8).toString('hex')}`
if (!/^yb_migration_[a-f0-9]{16}$/.test(databaseName)) {
  throw new Error('Generated database name failed the safety check')
}
const adminUrl = new URL(sourceUrl)
adminUrl.pathname = '/postgres'
const temporaryUrl = new URL(sourceUrl)
temporaryUrl.pathname = `/${databaseName}`
const admin = postgres(adminUrl.toString(), { max: 1 })
let temporary: ReturnType<typeof postgres> | undefined

try {
  await admin.unsafe(`CREATE DATABASE "${databaseName}"`)
  temporary = postgres(temporaryUrl.toString(), { max: 1 })
  await migrate(drizzle(temporary), { migrationsFolder: 'drizzle' })
  const [{ aiUsage }] = await temporary<{ aiUsage: string | null }[]>`
    SELECT to_regclass('public.ai_usage')::text AS "aiUsage"
  `
  if (aiUsage !== 'ai_usage')
    throw new Error('Latest migration was not applied to the temporary DB')
  console.log(`Migration dry-run succeeded in isolated database ${databaseName}`)
} finally {
  await temporary?.end({ timeout: 5 })
  await admin`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = ${databaseName} AND pid <> pg_backend_pid()
  `
  await admin.unsafe(`DROP DATABASE IF EXISTS "${databaseName}"`)
  const [{ exists }] = await admin<{ exists: boolean }[]>`
    SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = ${databaseName}) AS exists
  `
  await admin.end({ timeout: 5 })
  if (exists) {
    console.error('Temporary migration database rollback failed')
    process.exitCode = 1
  } else {
    console.log('Migration rollback verification removed the isolated database')
  }
}
