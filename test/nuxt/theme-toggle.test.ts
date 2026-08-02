import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import ThemeToggle from '~/components/ui/ThemeToggle.vue'

describe('ThemeToggle', () => {
  beforeEach(() => {
    useCookie('theme').value = 'light'
  })

  it('현재 테마와 다음 동작을 접근성 속성으로 알린다', async () => {
    const wrapper = await mountSuspended(ThemeToggle)
    const button = wrapper.get('button')

    expect(button.attributes('aria-label')).toBe('다크 테마로 전환')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.text()).toContain('LIGHT')

    await button.trigger('click')

    expect(button.attributes('aria-label')).toBe('라이트 테마로 전환')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.text()).toContain('DARK')
  })
})
