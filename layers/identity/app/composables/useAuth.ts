import { createAuthClient } from 'better-auth/vue'

export function useAuth() {
  const requestURL = useRequestURL()
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  return createAuthClient({
    baseURL: requestURL.origin,
    fetchOptions: { headers },
  })
}
