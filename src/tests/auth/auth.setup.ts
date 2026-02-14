import { test as setup } from '@playwright/test';
import 'dotenv/config';
import { AUTH_STORAGE_STATE_PATH } from '../../fixtures/auth-session';
import { getAuthCredentials, getRequiredEnv } from '../../fixtures/env';
import { bootstrapAuthenticatedSession } from '../../fixtures/session-bootstrap';

setup('authenticate user', async ({ page }) => {
  const { username, password } = getAuthCredentials();
  const baseUrl = getRequiredEnv('BASE_URL');

  await bootstrapAuthenticatedSession(page, {
    username,
    password,
    baseUrl,
  });

  await page.context().storageState({
    path: AUTH_STORAGE_STATE_PATH,
  });
});
