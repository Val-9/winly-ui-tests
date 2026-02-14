import { test } from '../../fixtures/test-fixtures';
import 'dotenv/config';
import { getAuthCredentials, getRequiredEnv } from '../../fixtures/env';
import { bootstrapAuthenticatedSession } from '../../fixtures/session-bootstrap';

test('Successful Login', async ({ page }) => {
  const { username, password } = getAuthCredentials();
  const baseUrl = getRequiredEnv('BASE_URL');

  await bootstrapAuthenticatedSession(page, {
    username,
    password,
    baseUrl,
  });
});
