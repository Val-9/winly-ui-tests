import { BasePage } from './BasePage.js';
import { home } from './components/selectors.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  async expectAllGamesVisible() {
    const heading = home.allGamesHeading(this.page);
    await heading.scrollIntoViewIfNeeded();
    await heading.waitFor({ state: 'visible' });

    const grid = home.allGamesGrid(this.page);
    await grid.waitFor({ state: 'visible' });

    // хотя бы одна карточка реально отрендерилась
    await grid.locator('div[title]').first().waitFor({ state: 'visible' });
  }

  // «Кликнуть Play у первой карточки All Games»
  async clickPlayOnFirstGame() {
    await this.expectAllGamesVisible();
    const firstCard = home.firstCard(this.page);
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.hover();
    await home.playBtnInsideCard(firstCard).click();
  }

  // alias под старое имя из теста (если он его использует)
  async openFirstGame() {
    await this.clickPlayOnFirstGame();
    await this.page.waitForURL(/\/play\/\d+$/, { timeout: 30_000 });
  }
}
