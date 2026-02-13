import { Page, FrameLocator, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class PaymentFrame extends BasePage {
  readonly frame: FrameLocator;
  readonly cardNumber: Locator;
  readonly expiry: Locator;
  readonly cvv: Locator;
  readonly holder: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    super(page);

    this.frame = page.frameLocator('iframe[src*="fyntek"]');
    this.cardNumber = this.frame.locator('#cardNumber');
    this.expiry = this.frame.locator('#expiryDate');
    this.cvv = this.frame.locator('#cardSecurityCode');
    this.holder = this.frame.locator('#cardholderName');
    this.payButton = this.frame.getByRole('button', {name: /Оплатить|Pay now/i });
  }

  async fillCardDetails(details: { number: string; expiry: string; cvv: string; holder: string }): Promise<void> {
    await this.cardNumber.fill(details.number);
    await this.expiry.fill(details.expiry);
    await this.cvv.fill(details.cvv);
    await this.holder.fill(details.holder);
  }

  async submit(): Promise<void> {
    await this.payButton.click();
  }
}
