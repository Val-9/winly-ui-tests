import { test, expect } from '../../fixtures/test-fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

test('Successful Login', async ({ page, loginPage }) => {
  const username = process.env.LOGIN_USERNAME!;
  const password = process.env.LOGIN_PASSWORD!;
  const baseUrl = process.env.BASE_URL!;

  await loginPage.navigate(baseUrl);

  await loginPage.openLoginModal();

  const loginResponsePromise = page.waitForResponse(response =>
    response.url().includes('/gateway/login.data') &&
    response.request().method() === 'POST'
  );

  await loginPage.login(username, password);

  const loginResponse = await loginResponsePromise;

  expect(loginResponse.status()).toBe(202);

  await loginPage.waitForElement(loginPage.sideNavigation);

  await expect(page).toHaveURL(/.*\/lobby/);
});
