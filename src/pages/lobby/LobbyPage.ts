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

  async getGcBalanceNumber(): Promise<number> {
    const raw = await this.gcBalance.textContent();
    if (!raw) throw new Error('GC balance text not found');
  
    return Number(raw.replace(/[^\d.]/g, ''));
  }
  
  async getScBalanceNumber(): Promise<number> {
    const raw = await this.scBalance.textContent();
    if (!raw) throw new Error('SC balance text not found');
  
    return Number(raw.replace(/[^\d.]/g, ''));
  }

  async getUiBalance(currency: 'GC' | 'SC'): Promise<number> {
    const locator = currency === 'GC' ? this.gcBalance : this.scBalance;

    await expect(locator).toBeVisible();

    const rawText = await locator.textContent();
    if (!rawText) {
      throw new Error(`${currency} balance text not found`);
    }

    const normalized = rawText.replace(/,/g, '');
    return Number(normalized);
  }
}
