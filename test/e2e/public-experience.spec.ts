import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/ko', { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(200)
  await page.evaluate(() => document.fonts.ready)
})

test('KO/EN 콘텐츠 탐색과 locale 전환이 동작한다', async ({ page }) => {
  await expect(
    page.getByRole('heading', { level: 1, name: '질문을 제품으로, 경험을 서사로 만듭니다.' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Switch to English' }).click()
  await expect(page).toHaveURL(/\/en$/)
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Turning questions into products and experience into stories.',
    }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Read posts' }).first().click()
  await expect(page).toHaveURL(/\/en\/posts$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Posts' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Sprint 3 Content Platform' })).toBeVisible()
})

test('390–1440px에서 가로 넘침 없이 핵심 UI를 시각 검증한다', async ({ page }, testInfo) => {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false)
  await expect(page.getByRole('link', { name: '포트폴리오 보기' }).first()).toBeVisible()
  const screenshot = await page.screenshot({
    animations: 'disabled',
    caret: 'hide',
  })
  await testInfo.attach(`sprint3-home-${testInfo.project.name}`, {
    body: screenshot,
    contentType: 'image/png',
  })
  expect(screenshot.byteLength).toBeGreaterThan(1_000)
})

test('자동 검사 가능한 WCAG 2.2 A/AA 위반이 없다', async ({ page }, testInfo) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  await testInfo.attach('axe-results', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  })
  expect(results.violations).toEqual([])
})

test('로그인 화면은 Google과 GitHub 진입점을 제공한다', async ({ page }) => {
  await page.goto('/ko/login')
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue with GitHub' })).toBeVisible()
})
