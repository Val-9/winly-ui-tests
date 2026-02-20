import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

type Currency = 'GC' | 'SC';

interface WheelSpinResponse {
  result: {
    value: number;
    type: Currency;
  };
}

export class WheelModal extends BasePage {

  readonly openWheelIcon: Locator;
  readonly spinButton: Locator;
  readonly closeRewardButton: Locator;
  readonly nextSpinLabel: Locator;
  readonly timerValue: Locator;
  readonly congratulationsText: Locator;

  constructor(page: Page) {
    super(page);

    this.openWheelIcon = page.locator('img[alt="Mini Wheel"]:visible');
    this.spinButton = page.locator('img[role="button"]'); 
    this.closeRewardButton = page.getByRole('button', { name: 'Close' });
    this.nextSpinLabel = page.getByText(/Next\s*spin\s*in/i);
    this.timerValue = page.locator('text=/\\d{2}:\\d{2}/');
    this.congratulationsText = page.getByText(/Congratulations/i);
  }

  async open(): Promise<void> {
    await this.clickElement(this.openWheelIcon);
  }

  async spin(): Promise<void> {
    await this.clickElement(this.spinButton);
  }

  async waitForReward(): Promise<void> {
    await expect(this.congratulationsText).toBeVisible();
  }

  async closeReward(): Promise<void> {
    await this.clickElement(this.closeRewardButton);
  }

  async expectCooldownActive(): Promise<void> {
    await expect(this.spinButton).toHaveClass(/pointer-events-none/);
    await expect(this.nextSpinLabel).toBeVisible();
    await expect(this.timerValue).toBeVisible();
  }

  private async waitForSpinResponse(): Promise<WheelSpinResponse> {
    const response = await this.page.waitForResponse(r =>
      r.url().endsWith('/gateway/wheel/spin') &&
      r.request().method() === 'POST'
    );

    return (await response.json()) as WheelSpinResponse;
  }

  async spinUntilExhausted(): Promise<Record<Currency, number>> {

    const totalWon: Record<Currency, number> = {
      GC: 0,
      SC: 0,
    };
  
    let safetyCounter = 0;
    const MAX_SPINS = 50;
  
    while (true) {
  
      if (await this.spinButton.evaluate(el =>
        el.classList.contains('pointer-events-none')
      )) {
        break;
      }
  
      if (safetyCounter++ > MAX_SPINS) {
        throw new Error('Spin loop exceeded safety limit');
      }

      await expect(this.spinButton).not.toHaveClass(/pointer-events-none/);
  
      const spinResponsePromise = this.waitForSpinResponse();
  
      await this.spin();
  
      const data = await spinResponsePromise;
  
      totalWon[data.result.type] += data.result.value;
  
      await this.waitForReward();
      await this.closeReward();
  
      await expect(this.congratulationsText).toBeHidden();
    }
  
    return totalWon;
  }
  
}
