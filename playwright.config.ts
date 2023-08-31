import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  maxFailures: 1,
  workers: 1,
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on',
    headless: false,
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
