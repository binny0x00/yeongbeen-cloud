export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()
  const localePath = useLocalePath()
  const session = await auth.getSession()
  const role = (session.data?.user as { role?: string } | undefined)?.role
  if (!session.data?.user) return navigateTo(localePath('/login'))
  if (role !== 'OWNER' && role !== 'EDITOR') return navigateTo(localePath('/'))
})
