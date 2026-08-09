import { createHmac, randomUUID } from 'node:crypto'

import { expect, test } from '@playwright/test'

const secret = process.env.BETTER_AUTH_SECRET ?? 'e2e-better-auth-secret-at-least-32'
const token = 'sprint3-e2e-session-token'

test('OWNER가 KO 게시물을 작성·발행하고 댓글·좋아요를 남긴다', async ({
  context,
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1200', 'Mutation flow runs once per E2E suite.')
  const signature = createHmac('sha256', secret).update(token).digest('base64')
  await context.addCookies([
    {
      domain: '127.0.0.1',
      httpOnly: true,
      name: 'better-auth.session_token',
      path: '/',
      sameSite: 'Lax',
      secure: false,
      value: `${token}.${signature}`,
    },
  ])

  const slug = `e2e-${randomUUID()}`
  await page.goto('/ko/admin', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: '콘텐츠 스튜디오' })).toBeVisible()
  await page.locator('input[name="title"]').fill('E2E 발행 검증')
  await page.locator('input[name="slug"]').fill(slug)
  await page.locator('input[name="summary"]').fill('편집부터 상호작용까지 검증하는 게시물')
  await page.getByRole('button', { name: '초안 만들기' }).click()
  await expect(page).toHaveURL(/\/ko\/admin\/documents\/[0-9a-f-]+$/)

  const koreanEditor = page.getByRole('region', { name: 'ko editor' })
  await koreanEditor.locator('.editor-surface').fill('웹툰처럼 이어지는 Sprint 3 서사입니다.')
  await page.locator('textarea[name="summary-ko"]').fill('수정된 E2E 게시물 요약')
  await page.getByRole('button', { name: '지금 저장' }).first().click()
  await expect(page.getByText(/저장됨 v\d+/).first()).toBeVisible()
  await page.getByRole('button', { name: '발행' }).first().click()
  await expect(page.getByText('발행됨').first()).toBeVisible()

  await page.goto(`/ko/posts/${slug}`, { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { level: 1, name: 'E2E 발행 검증' })).toBeVisible()
  await page.locator('textarea[name="comment"]').fill('Sprint 3 댓글 흐름 검증')
  await page.getByRole('button', { name: '댓글 남기기' }).click()
  await expect(page.getByText('Sprint 3 댓글 흐름 검증')).toBeVisible()
  await expect(page.getByText('검토 후 공개됩니다.')).toBeVisible()
  await page.getByRole('button', { name: '♡ 0' }).click()
  await expect(page.getByRole('button', { name: '♥ 1' })).toBeVisible()
})
