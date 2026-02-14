import { test } from '../../fixtures/test-fixtures';
import 'dotenv/config';
import { getLoginTestCredentials, getRequiredEnv } from '../../fixtures/env';
import { bootstrapAuthenticatedSession } from '../../fixtures/session-bootstrap';

test('Successful Login', async ({ page }) => {
  const { username, password } = getLoginTestCredentials();
  const baseUrl = getRequiredEnv('BASE_URL');

  await bootstrapAuthenticatedSession(page, {
    username,
    password,
    baseUrl,
  });
});
