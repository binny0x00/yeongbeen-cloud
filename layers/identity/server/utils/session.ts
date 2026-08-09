import type { H3Event } from 'h3'

import type { Permission, Role } from '../../domain/role-policy'
import { RolePolicy } from '../../domain/role-policy'
import { getAuth } from '../../infrastructure/auth'

const rolePolicy = new RolePolicy()

export async function requireSession(event: H3Event) {
  const session = await getAuth().api.getSession({ headers: event.headers })
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  return session
}

export async function requirePermission(event: H3Event, permission: Permission) {
  const session = await requireSession(event)
  const role = session.user.role as Role
  if (!rolePolicy.allows(role, permission)) {
    throw createError({ statusCode: 403, statusMessage: 'Permission denied' })
  }
  return session
}
