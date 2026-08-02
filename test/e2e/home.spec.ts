import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

  expect(response?.status()).toBe(200)
  await page.evaluate(() => document.fonts.ready)
})

test('390px부터 1440px까지 핵심 콘텐츠가 겹치거나 가로로 넘치지 않는다', async ({
  page,
  viewport,
}) => {
  await expect(page).toHaveTitle(/Yeongbeen Cloud/)
  await expect(page.getByRole('heading', { level: 1, name: /I BUILD INTERFACES/ })).toBeVisible()
  await expect(page.locator('#about')).toBeVisible()
  await expect(page.locator('#experience')).toBeVisible()
  await expect(page.locator('#projects')).toBeVisible()
  await expect(page.locator('#writing')).toBeVisible()
  await expect(page.locator('#contact')).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )

  expect(hasHorizontalOverflow).toBe(false)

  const sidebar = page.getByRole('complementary', { name: '개발자 정보 및 섹션 탐색' })
  if ((viewport?.width ?? 0) >= 1200) await expect(sidebar).toBeVisible()
  else await expect(sidebar).toBeHidden()
})

test('프로젝트 탐색과 이메일 연락 핵심 흐름이 동작한다', async ({ page }) => {
  await page.getByRole('link', { name: 'VIEW PROJECTS' }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.locator('#projects')).toBeInViewport()
  const orbitLink = page.getByRole('link', { name: /ORBIT 프로젝트 보기/ })
  await expect(orbitLink).toBeVisible()
  await orbitLink.click()
  await expect(page).toHaveURL(/\/projects\/orbit$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Orbit' })).toBeVisible()
  await page.getByRole('link', { name: /SELECTED PROJECTS/ }).click()
  await expect(page).toHaveURL(/\/#projects$/)
  await expect(page.getByRole('link', { name: /이메일 보내기/ })).toHaveAttribute(
    'href',
    'mailto:hello@yeongbeen.cloud',
  )
})

test('키보드로 본문 건너뛰기와 주요 링크를 탐색할 수 있다', async ({ page }) => {
  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: '본문으로 이동' })
  await expect(skipLink).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'VIEW PROJECTS' })).toBeFocused()
})

test('reduced motion에서는 companion을 정적으로 표시한다', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1200, 'Pet Companion은 desktop sidebar에만 표시합니다.')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload({ waitUntil: 'domcontentloaded' })

  const companion = page.locator('.pet-companion')
  await expect(companion).toHaveAttribute('data-state', 'idle')
  await expect(companion).toHaveAttribute('aria-hidden', 'false')
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
