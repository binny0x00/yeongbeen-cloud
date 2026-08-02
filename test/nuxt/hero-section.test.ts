import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import HeroSection from '~/components/sections/HeroSection.vue'

describe('HeroSection', () => {
  it('아이보리 canvas 위 editorial statement와 CTA를 제공한다', async () => {
    const wrapper = await mountSuspended(HeroSection)

    expect(wrapper.get('h1').text()).toContain('I BUILD INTERFACES')
    expect(wrapper.text()).not.toContain('01 /')
    expect(wrapper.get('section').classes()).not.toContain('bg-inverse')
    expect(wrapper.get('a[href="#projects"]').text()).toContain('VIEW PROJECTS')
    expect(wrapper.get('dl[aria-label="핵심 경험"]').text()).toContain('100K+')
    expect(wrapper.get('dl[aria-label="핵심 경험"]').text()).toContain('CI/CD · RAILWAY')
    expect(wrapper.findAll('[data-hero-item]').length).toBeGreaterThanOrEqual(8)
  })
})
