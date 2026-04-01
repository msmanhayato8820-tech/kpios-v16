import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  outputDir: './test-output',
  reporter: [
    ['list'],
    ['html', { outputFolder: './html-report', open: 'never' }],
  ],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'off',
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
