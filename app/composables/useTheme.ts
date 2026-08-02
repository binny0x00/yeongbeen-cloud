export type ColorTheme = 'light' | 'dark'

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function useTheme() {
  const theme = useCookie<ColorTheme>('theme', {
    default: () => 'light',
    maxAge: THEME_COOKIE_MAX_AGE,
    sameSite: 'lax',
  })

  if (theme.value !== 'light' && theme.value !== 'dark') {
    theme.value = 'light'
  }

  const isDark = computed(() => theme.value === 'dark')

  function setTheme(nextTheme: ColorTheme) {
    theme.value = nextTheme
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  useHead(() => ({
    htmlAttrs: {
      'data-theme': theme.value,
    },
  }))

  return {
    isDark: readonly(isDark),
    setTheme,
    theme: readonly(theme),
    toggleTheme,
  }
}
