import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const tokens = readFileSync(new URL('../../app/assets/css/tokens.css', import.meta.url), 'utf8')
const globalStyles = readFileSync(new URL('../../app/assets/css/main.css', import.meta.url), 'utf8')

describe('Figma V3 design token contract', () => {
  it('차분한 골드·아이보리 기반의 의미 토큰을 제공한다', () => {
    expect(tokens).toContain('--neutral-50: #f9f7f1')
    expect(tokens).toContain('--yellow-500: #a6842e')
    expect(tokens).toContain('--color-bg-primary: var(--neutral-50)')
    expect(tokens).toContain('--color-text-accent-primary: var(--yellow-600)')
  })

  it('편집형 디스플레이와 손글씨 보조 서체를 제공한다', () => {
    expect(tokens).toContain("--font-display: 'Archivo Narrow'")
    expect(tokens).toContain("--font-handwritten: 'Caveat Brush'")
    expect(globalStyles).toContain("@import '@fontsource/archivo-narrow/700.css'")
    expect(globalStyles).toContain("@import '@fontsource/caveat-brush/400.css'")
    expect(globalStyles).toContain('.type-display-hero')
    expect(globalStyles).toContain('.type-handwritten')
  })
})
