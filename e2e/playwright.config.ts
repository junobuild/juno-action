import {defineConfig, devices} from '@playwright/test';

const DEV = (process.env.NODE_ENV ?? 'production') === 'development';

export default defineConfig({
  testDir: './e2e',
  snapshotDir: `./${DEV ? 'tmp' : 'e2e'}/snapshots`,
  testMatch: ['**/*.e2e.ts', '**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide'
    }
  },
  use: {
    testIdAttribute: 'data-tid',
    baseURL: 'http://localhost:5866',
    trace: 'on',
    ...(DEV && {headless: false}),
    permissions: ['clipboard-read', 'clipboard-write']
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']}
    }
  ]
});
