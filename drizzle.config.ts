import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:5432/yeongbeen',
  },
  dialect: 'postgresql',
  migrations: {
    schema: 'drizzle',
    table: '__drizzle_migrations',
  },
  out: './drizzle',
  schema: './layers/content/infrastructure/drizzle/schema/index.ts',
  strict: true,
  verbose: true,
})
