import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected log(message: string): void {
    console.log(`[${this.constructor.name}] ${message}`);
  }

  async navigate(url: string): Promise<void> {
    this.log(`Navigate to ${url}`);
    await this.page.goto(url);
  }

  async clickElement(locator: Locator): Promise<void> {
    this.log(`Click element`);
    await locator.click();
  }

  async fillField(locator: Locator, value: string): Promise<void> {
    this.log(`Fill field`);
    await locator.fill(value);
  }

  async waitForElement(locator: Locator): Promise<void> {
    this.log(`Wait for element`);
    await expect(locator).toBeVisible();
  }
}
