import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { LobbyPage } from '../pages/lobby/LobbyPage';
import { ShopModal } from '../pages/shop/ShopModal';
import { PurchaseModal } from '../pages/shop/PurchaseModal';
import { PaymentFrame } from '../pages/payment/PaymentFrame';

type Fixtures = {
  loginPage: LoginPage;
  lobbyPage: LobbyPage;
  shopModal: ShopModal;
  purchaseModal: PurchaseModal;
  paymentFrame: PaymentFrame;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  lobbyPage: async ({ page }, use) => {
    await use(new LobbyPage(page));
  },
  shopModal: async ({ page }, use) => {
    await use(new ShopModal(page));
  },
  purchaseModal: async ({ page }, use) => {
    await use(new PurchaseModal(page));
  },
  paymentFrame: async ({ page }, use) => {
    await use(new PaymentFrame(page));
  },
});

export { expect } from '@playwright/test';
