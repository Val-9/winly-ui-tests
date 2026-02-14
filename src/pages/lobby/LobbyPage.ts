import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LobbyPage extends BasePage {
  readonly shopButton: Locator;
  readonly gcBalance: Locator;
  readonly scBalance: Locator;
  readonly shopCloseButton: Locator;

  constructor(page: Page) {
    super(page);

    this.shopButton = page
      .getByRole('navigation', { name: 'Side navigation' })
      .locator('[data-test-type="button"]')
      .filter({ hasText: 'Shop' });

    this.gcBalance = page
      .locator('[role="tab"][data-value="GC"]')
      .locator('div')
      .first();

    this.scBalance = page
      .locator('[role="tab"][data-value="SC"]')
      .locator('div')
      .first();

    this.shopCloseButton = page.getByRole('button', { name: 'Close' });
  }

  async openShop(): Promise<void> {
    await this.clickElement(this.shopButton);
  }

  async closeShopIfOpened(): Promise<void> {
    if (await this.shopCloseButton.isVisible()) {
      await this.clickElement(this.shopCloseButton);
    }
  }

  


  async getUiBalance(currency: 'GC' | 'SC'): Promise<number> {
    const locator = currency === 'GC'
      ? this.gcBalance
      : this.scBalance;
  
    const text = await locator.textContent();
  
    if (!text) {
      throw new Error(`${currency} balance text not found`);
    }
  
    return Number(text.replace(/[^\d.]/g, ''));
}
}
