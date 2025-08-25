import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/AuthPage.js';
import { HomePage } from '../../pages/HomePage.js';
import { users } from '../../fixtures/users.js';

test.describe('Games - Spin basic flow', () => {
  test('open first game from All Games and wait for game page', async ({ page }) => {
    const auth = new AuthPage(page);
    const home = new HomePage(page);

    await auth.goto(process.env.BASE_URL);
    await auth.login(users.valid.username, users.valid.password);

    await home.expectAllGamesVisible();

    await home.clickPlayOnFirstGame();
    await expect(page).toHaveURL(/\/play\/\d+$/, { timeout: 30_000 });
  });
});
