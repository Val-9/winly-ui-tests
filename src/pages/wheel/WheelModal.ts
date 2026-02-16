import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class WheelModal extends BasePage {

  readonly openWheelIcon: Locator;
  readonly spinButton: Locator;
  readonly closeRewardButton: Locator;
  readonly nextSpinLabel: Locator;
  readonly timerValue: Locator;

  constructor(page: Page) {
    super(page);

    this.openWheelIcon = page.locator(
        'img[alt="Mini Wheel"]:visible'
      );

    this.spinButton = page.locator(
      'img[role="button"][src*="spin"]'
    );

    this.closeRewardButton = page.getByRole('button', {
      name: 'Close',
    });

    this.nextSpinLabel = page.getByText(/Next\s*spin\s*in/i);
    this.timerValue = page.getByText(/\d{2}:\d{2}/);
  }

  async open(): Promise<void> {
    await this.clickElement(this.openWheelIcon);
  }

  async spin(): Promise<void> {
    await this.clickElement(this.spinButton);
  }

  async waitForReward(): Promise<void> {
    await expect(
      this.page.getByText(/Congratulations/i)
    ).toBeVisible();
  }

  async closeReward(): Promise<void> {
    await this.clickElement(this.closeRewardButton);
  }

  async expectCooldownActive(): Promise<void> {
    await expect(this.spinButton)
      .toHaveClass(/pointer-events-none/);

    await expect(this.nextSpinLabel)
      .toBeVisible();

    await expect(this.timerValue)
      .toBeVisible();
  }
}
