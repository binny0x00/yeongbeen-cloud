import { getDatabase } from '@content-domain/infrastructure/drizzle/database'
import * as databaseSchema from '@content-domain/infrastructure/drizzle/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

function ownerEmails(): Set<string> {
  return new Set(
    (process.env.OWNER_EMAILS ?? '')
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET
  const baseURL = process.env.BETTER_AUTH_URL
  if (!secret || !baseURL) {
    throw new Error('BETTER_AUTH_SECRET and BETTER_AUTH_URL are required to use authentication')
  }

  return betterAuth({
    account: {
      accountLinking: {
        allowDifferentEmails: false,
        enabled: true,
      },
    },
    baseURL,
    database: drizzleAdapter(getDatabase(), {
      provider: 'pg',
      schema: databaseSchema,
    }),
    databaseHooks: {
      user: {
        create: {
          before: async user => ({
            data: {
              ...user,
              role:
                user.emailVerified && ownerEmails().has(user.email.toLowerCase())
                  ? 'OWNER'
                  : 'MEMBER',
            },
          }),
        },
      },
    },
    secret,
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID ?? '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        scope: ['user:email'],
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        prompt: 'select_account',
      },
    },
    trustedOrigins: [baseURL],
    user: {
      additionalFields: {
        role: {
          defaultValue: 'MEMBER',
          input: false,
          required: true,
          type: ['OWNER', 'EDITOR', 'MEMBER'],
        },
      },
    },
  })
}

let authInstance: ReturnType<typeof createAuth> | undefined

export function getAuth(): ReturnType<typeof createAuth> {
  if (authInstance) return authInstance
  const auth = createAuth()
  authInstance = auth
  return auth
}
