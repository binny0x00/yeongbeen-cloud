const groups = {
  ai: ['OPENAI_API_KEY', 'OPENAI_MODEL'],
  auth: [
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'OWNER_EMAILS',
  ],
  core: ['DATABASE_URL', 'REDIS_URL', 'NUXT_PUBLIC_SITE_URL'],
  media: [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET',
    'R2_PUBLIC_BASE_URL',
  ],
  operations: ['NUXT_PUBLIC_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY', 'CRON_SECRET'],
} as const

let hasMissing = false
for (const [group, names] of Object.entries(groups)) {
  const missing = names.filter(name => !process.env[name]?.trim())
  if (missing.length) {
    hasMissing = true
    console.error(`${group}: missing ${missing.join(', ')}`)
  } else {
    console.log(`${group}: configured`)
  }
}

if (hasMissing) process.exitCode = 1
