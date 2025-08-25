import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/AuthPage.js';

const unique = () => Date.now().toString();
const genUsername = () => `ui_autotest_${unique()}`;
const genPassword = () => `12341234!`;

test.describe('Auth - Register', () => {
  test('Successfully register', async ({ page }) => {
    const auth = new AuthPage(page);

    await auth.goto(process.env.BASE_URL);
    await auth.topBar.expectGuest();

    const username = genUsername();
    const password = genPassword();

    await auth.register(username, password);

    // Минимальная проверка: Rewards доступен
    await expect(page.getByRole('button', { name: /Rewards/i })).toBeVisible();

    // Сессия сохраняется после reload
    await page.reload();
    await auth.topBar.expectAuthorized();
  });
});