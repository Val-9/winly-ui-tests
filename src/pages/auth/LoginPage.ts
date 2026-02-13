import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
  readonly headerLoginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly sideNavigation: Locator;

  constructor(page: Page) {
    super(page);

    this.headerLoginButton = page.getByRole('button', { name: 'Log in' });
    this.usernameInput = page.getByPlaceholder('Enter username');
    this.passwordInput = page.getByPlaceholder('Enter password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
    this.sideNavigation = page.getByRole('navigation', { name: 'Side navigation' });
  }

  async openLoginModal(): Promise<void> {
    await this.clickElement(this.headerLoginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }
}
