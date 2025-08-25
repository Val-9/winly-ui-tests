// pages/components/TopBar.js
import { topBar } from './selectors.js';

export class TopBar {
  constructor(page) { this.page = page; }

  loginButton()  { return topBar.loginButton(this.page); }
  signUpButton() { return topBar.signUpButton(this.page); }

  async openLogin()  { await this.loginButton().click(); }
  async openSignUp() { await this.signUpButton().click(); }

  async expectGuest() {
    await this.signUpButton().waitFor({ state: 'visible' });
    await this.loginButton().waitFor({ state: 'visible' });
  }

  async expectAuthorized() {
    // Heuristic: guest buttons disappear and Rewards in header appears.
    await this.loginButton().waitFor({ state: 'hidden' });
    await topBar.rewardsButton(this.page).waitFor({ state: 'visible' });
  }
}
