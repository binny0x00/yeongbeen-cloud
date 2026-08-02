import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

  expect(response?.status()).toBe(200)
  await page.evaluate(() => document.fonts.ready)
})

test('핵심 콘텐츠를 표시하고 가로로 넘치지 않는다', async ({ page }) => {
  await expect(page).toHaveTitle(/Yeongbeen Cloud/)
  await expect(page.getByRole('heading', { level: 1, name: /I BUILD INTERFACES/ })).toBeVisible()
  await expect(page.locator('#about')).toBeVisible()
  await expect(page.locator('#projects')).toBeVisible()
  await expect(page.locator('#contact')).toBeVisible()
  await expect(page.getByRole('link', { name: '이메일 보내기' })).toHaveAttribute(
    'href',
    'mailto:hello@yeongbeen.cloud',
  )

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )

  expect(hasHorizontalOverflow).toBe(false)
})

test('자동 검사 가능한 WCAG A와 AA 위반이 없다', async ({ page }, testInfo) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  await testInfo.attach('axe-results', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  })

  expect(results.violations).toEqual([])
})
