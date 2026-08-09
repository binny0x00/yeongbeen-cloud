import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  new URL('../../drizzle/0000_mean_proemial_gods.sql', import.meta.url),
  'utf8',
)

describe('Sprint 3 initial migration', () => {
  it('인증과 locale별 콘텐츠 테이블을 생성한다', () => {
    expect(migration).toContain('CREATE TABLE "user"')
    expect(migration).toContain('CREATE TABLE "account"')
    expect(migration).toContain('CREATE TABLE "document_localization"')
    expect(migration).toContain('"locale" "locale" NOT NULL')
  })

  it('중복 slug와 revision version을 DB 제약으로 차단한다', () => {
    expect(migration).toContain('document_localization_locale_slug_unique')
    expect(migration).toContain('revision_localization_version_unique')
    expect(migration).toContain('document_localization_version_positive')
  })
})
