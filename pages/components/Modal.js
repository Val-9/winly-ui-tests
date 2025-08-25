// pages/components/Modal.js
import { authModal } from './selectors.js';

export class Modal {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) { this.page = page; }

  get root() { return authModal.root(this.page); }

  // ---------- Login ----------
  async login(username, password) {
    await authModal.username(this.page).click();
    await authModal.username(this.page).fill(username);
    await authModal.password(this.page).click();
    await authModal.password(this.page).fill(password);
    await authModal.submitLogin(this.page).click();
  }

  // ---------- Registration (2 steps) ----------
  async switchToRegistration() {
    await authModal.registrationTab(this.page).click();
  }

  async fillRegistrationStep1(username) {
    await authModal.username(this.page).fill(username);
  }

  async goNext() {
    await authModal.next(this.page).click();
  }

  async fillRegistrationStep2(password) {
    await authModal.password(this.page).fill(password);
    await authModal.confirmPassword(this.page).fill(password);
  }

  async acceptAge()   { await authModal.ageCheckbox(this.page).check(); }
  async acceptTerms() { await authModal.termsCheckbox(this.page).check(); }
  async submitJoin()  { await authModal.join(this.page).click(); }

  async register(username, password) {
    await this.switchToRegistration();
    await this.fillRegistrationStep1(username);
    await this.goNext();
    await this.fillRegistrationStep2(password);
    await this.acceptAge();
    await this.acceptTerms();
    await this.submitJoin();
  }
}
