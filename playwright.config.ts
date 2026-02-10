import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests',
  timeout: 30_000,
  retries: 0,
  use: {
    // trace: 'retain-on-failure',
    trace: 'on',
    actionTimeout: 0,
    baseURL: 'https://serverest.dev'
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]]
});
