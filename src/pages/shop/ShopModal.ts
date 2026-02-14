import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import type { CoinPack } from '../../types/coinPack';

export type SelectedCoinPack = {
  packId: number;
  gcAmount: number;
  scAmount: number;
  shownPrice: number;
};

export class ShopModal extends BasePage {
  readonly anyPriceButton: Locator;

  constructor(page: Page) {
    super(page);


    this.anyPriceButton = page.getByRole('button', { name: /\$\s*\d+(?:\.\d+)?/ });
  }

  async waitForCoinPacksResponse(): Promise<CoinPack[]> {
    const resp = await this.page.waitForResponse(r =>
      r.url().includes('/gateway/coin-packs') && r.request().method() === 'GET'
    );
    expect(resp.status(), `Expected /gateway/coin-packs status 200, got ${resp.status()}`).toBe(200);
    return (await resp.json()) as CoinPack[];
  }

  async selectCoinPackByIndex(index: number): Promise<SelectedCoinPack> {
    this.log(`Select coin pack by index: ${index}`);

    const packsPromise = this.waitForCoinPacksResponse();

    // Ensure modal rendered (at least one price button visible)
    await this.waitForElement(this.anyPriceButton.first());

    const packs = await packsPromise;
    if (index < 0 || index >= packs.length) {
      throw new Error(`COIN_PACK_INDEX out of range. index=${index}, packs.length=${packs.length}`);
    }

    const selected = packs[index];

    // Click the matching UI button by index among price buttons.
    await this.clickElement(this.anyPriceButton.nth(index));

    return {
      packId: selected.id,
      gcAmount: selected.goldenCoins,
      scAmount: selected.sweepCoins,
      shownPrice: selected.shownPrice,
    };
  }
}
