import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LobbyPage extends BasePage {
  readonly shopButton: Locator;

  constructor(page: Page) {
    super(page);

    this.shopButton = page
      .getByRole('navigation', { name: 'Side navigation' })
      .locator('[data-test-type="button"]')
      .filter({ hasText: 'Shop' });
  }

  async openShop(): Promise<void> {
    await this.clickElement(this.shopButton);
  }
}
