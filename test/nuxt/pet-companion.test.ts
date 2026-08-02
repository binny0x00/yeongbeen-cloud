import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import PetCompanion from '~/components/ui/PetCompanion.vue'

describe('PetCompanion', () => {
  it('첫 화면에서는 숨겨진 상태와 고정된 stage를 제공한다', async () => {
    const wrapper = await mountSuspended(PetCompanion)

    expect(wrapper.attributes('data-state')).toBe('hidden')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.pet-companion__stage').exists()).toBe(true)
    expect(wrapper.get('img').attributes('src')).toBe('/pet-companion.png')
    expect(wrapper.get('img').attributes('alt')).toBe('')
  })
})
