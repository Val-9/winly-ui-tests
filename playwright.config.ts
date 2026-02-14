import { defineConfig, devices } from '@playwright/test';
import { AUTH_STORAGE_STATE_PATH } from './src/fixtures/auth-session';

export default defineConfig({
  testDir: './src/tests',

  timeout: 60000,
  expect: { timeout: 10000 },

  // Backend supports only one active session per user.
  // Keep execution single-threaded to avoid auth/session invalidation.
  fullyParallel: false,
  workers: 1,
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
      name: 'authenticated-tests',
      testIgnore: /auth\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STORAGE_STATE_PATH
      },
      dependencies: ['setup']
    },

    {
      name: 'auth-tests',
      testMatch: /auth\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['authenticated-tests']
    }
  ],

  outputDir: 'test-results'
});
