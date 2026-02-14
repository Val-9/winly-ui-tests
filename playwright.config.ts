import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './src/tests',

  timeout: 60000,
  expect: { timeout: 10000 },

  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure',
    headless: true
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'auth-tests',
      testMatch: /auth\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, 'storage/auth.json')
      },
      dependencies: ['setup']
    }
  ],

  outputDir: 'test-results'
});
