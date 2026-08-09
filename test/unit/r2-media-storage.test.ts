import { afterEach, describe, expect, it, vi } from 'vitest'

import { R2MediaStorage } from '../../layers/content/infrastructure/r2-media-storage'

describe('R2 media storage', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('fails closed when upload credentials are incomplete', async () => {
    for (const key of [
      'R2_ACCOUNT_ID',
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_BUCKET',
      'R2_PUBLIC_BASE_URL',
    ])
      vi.stubEnv(key, '')

    await expect(
      new R2MediaStorage().signUpload({
        mimeType: 'image/png',
        objectKey: 'media/test.png',
        size: 1024,
      }),
    ).rejects.toThrow('R2 configuration is incomplete')
  })
})
