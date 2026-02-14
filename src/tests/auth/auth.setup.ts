import { test as setup } from '@playwright/test';
import 'dotenv/config';
import { LoginPage } from '../../pages/auth/LoginPage';

setup('authenticate user', async ({ page }) => {
  const username = process.env.SETUP_USERNAME!;
  const password = process.env.SETUP_PASSWORD!;
  const baseUrl = process.env.BASE_URL!;

  const loginPage = new LoginPage(page);

  await loginPage.navigate(baseUrl);

  await loginPage.openLoginModal();

  const loginResponsePromise = page.waitForResponse(response =>
    response.url().includes('/gateway/login.data') &&
    response.request().method() === 'POST'
  );

  await loginPage.login(username, password);

  await loginResponsePromise;

  await loginPage.waitForElement(loginPage.sideNavigation);

  await page.context().storageState({
    path: 'storage/auth.json',
  });
});
