import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ContactFooter from '~/components/sections/ContactFooter.vue'

describe('ContactFooter', () => {
  it('큰 accent 면 없이 Figma V3의 editorial contact를 제공한다', async () => {
    const wrapper = await mountSuspended(ContactFooter)

    const contact = wrapper.get('#contact')
    expect(contact.classes()).not.toContain('bg-accent')
    expect(wrapper.get('h2').text()).toContain('SOMETHING CLEAR')
    expect(wrapper.get('a[href="mailto:hello@yeongbeen.cloud"]')).toBeTruthy()
    expect(wrapper.text()).toContain('PROTECTED BY CLOUDFLARE')
  })
})
