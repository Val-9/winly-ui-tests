import { BasePage } from './BasePage.js';
import { TopBar } from './components/TopBar.js';
import { Modal } from './components/Modal.js';

export class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.topBar = new TopBar(page);
    this.modal = new Modal(page);
  }

  async register(username, password) {
    await this.topBar.openSignUp();
    await this.modal.register(username, password);
    await this.topBar.expectAuthorized();
  }

  async login(username, password) {
    await this.topBar.openLogin();
    await this.modal.login(username, password);
    await this.topBar.expectAuthorized();
  }
}
