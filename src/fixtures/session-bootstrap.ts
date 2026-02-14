import { expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';

export type BootstrapSessionOptions = {
  username: string;
  password: string;
  baseUrl: string;
};

export async function bootstrapAuthenticatedSession(
  page: Page,
  options: BootstrapSessionOptions
): Promise<void> {
  const loginPage = new LoginPage(page);

  await loginPage.navigate(options.baseUrl);
  await loginPage.openLoginModal();

  const loginResponsePromise = page.waitForResponse(response =>
    response.url().includes('/gateway/login.data') &&
    response.request().method() === 'POST'
  );

  await loginPage.login(options.username, options.password);

  const loginResponse = await loginResponsePromise;
  expect(loginResponse.status(), 'Login response should be 202').toBe(202);

  await loginPage.waitForElement(loginPage.sideNavigation);
  await expect(page).toHaveURL(/.*\/lobby/);
}
