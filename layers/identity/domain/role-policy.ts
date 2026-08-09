export const roles = ['OWNER', 'EDITOR', 'MEMBER'] as const
export type Role = (typeof roles)[number]

export type Permission =
  | 'content:write'
  | 'content:publish'
  | 'content:delete'
  | 'comment:write'
  | 'comment:moderate'
  | 'role:manage'
  | 'settings:manage'

const permissions: Record<Role, ReadonlySet<Permission>> = {
  EDITOR: new Set(['content:write']),
  MEMBER: new Set(['comment:write']),
  OWNER: new Set([
    'comment:moderate',
    'comment:write',
    'content:delete',
    'content:publish',
    'content:write',
    'role:manage',
    'settings:manage',
  ]),
}

export class RolePolicy {
  allows(role: Role, permission: Permission): boolean {
    return permissions[role].has(permission)
  }
}
