import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173'

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  projects: [
    {
      name: 'mobile-390',
      use: {
        browserName: 'chromium',
        viewport: { height: 844, width: 390 },
      },
    },
    {
      name: 'tablet-768',
      use: {
        browserName: 'chromium',
        viewport: { height: 1024, width: 768 },
      },
    },
    {
      name: 'desktop-1200',
      use: {
        browserName: 'chromium',
        viewport: { height: 900, width: 1200 },
      },
    },
    {
      name: 'desktop-1440',
      use: {
        browserName: 'chromium',
        viewport: { height: 1000, width: 1440 },
      },
    },
  ],
  reporter: process.env.CI ? 'github' : 'list',
  retries: process.env.CI ? 2 : 0,
  testDir: './test/e2e',
  timeout: 45_000,
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm build && HOST=127.0.0.1 PORT=4173 pnpm preview',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    url: baseURL,
  },
})
