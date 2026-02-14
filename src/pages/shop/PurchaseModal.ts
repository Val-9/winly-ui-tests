import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import type { DepositInitResponse } from '../../api/DepositAPIClient';

export class PurchaseModal extends BasePage {
  readonly title: Locator;
  readonly paymentMethodCombobox: Locator;
  readonly completePurchaseButton: Locator;
  readonly successTitle: Locator;
  readonly thanksButton: Locator;

  constructor(page: Page) {
    super(page);

    this.title = page.getByRole('heading', { name: 'Buy Coin Pack' });
    this.paymentMethodCombobox = page.getByRole('combobox');
    this.completePurchaseButton = page.getByRole('button', { name: 'Complete Purchase' });
    this.successTitle = page.getByRole('heading', { name: 'Congratulations!' });
    this.thanksButton = page.getByRole('button', { name: 'Thanks!' });
  }

  async waitForOpen(): Promise<void> {
    await this.waitForElement(this.title);
  }

  async selectCreditCardIfNeeded(): Promise<void> {
    await this.clickElement(this.paymentMethodCombobox);

    const creditCardOption = this.page
      .getByRole('option', { name: /Credit Card/i })
      .or(this.page.getByRole('menuitem', { name: /Credit Card/i }))
      .first();

    await this.clickElement(creditCardOption);
  }

  async clickCompletePurchaseAndWaitDeposit(
    packId: number
  ): Promise<DepositInitResponse> {

    const depositUrlPart = `/gateway/coin-packs/${packId}/deposit`;

    const depositRespPromise = this.page.waitForResponse(r =>
      r.url().includes(depositUrlPart) &&
      r.request().method() === 'POST'
    );

    await this.clickElement(this.completePurchaseButton);

    const depositResp = await depositRespPromise;
    expect(depositResp.status()).toBe(200);

    const body = await depositResp.json();

    return body as DepositInitResponse;
  }

  async waitForSuccess(): Promise<void> {
    await this.waitForElement(this.successTitle);
  }

  async clickThanks(): Promise<void> {
    await this.clickElement(this.thanksButton);
  }
}
