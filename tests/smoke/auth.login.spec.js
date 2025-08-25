import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/AuthPage.js';
import { users } from '../../fixtures/users.js';

test.describe('Auth - Login', () => {
  test('Successfully login', async ({ page }) => {
    const auth = new AuthPage(page);


    await auth.goto(process.env.BASE_URL);
    // Ensure we are a guest
    await auth.topBar.expectGuest();
    await auth.login(users.valid.username, users.valid.password);
    // Minimal post-condition: some header items for authorized users become visible.
    await expect(page.getByRole('button', { name: /Rewards/i })).toBeVisible();
  });
});
