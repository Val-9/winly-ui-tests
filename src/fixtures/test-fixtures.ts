import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { LobbyPage } from '../pages/lobby/LobbyPage';
import { ShopModal } from '../pages/shop/ShopModal';
import { PurchaseModal } from '../pages/shop/PurchaseModal';
import { PaymentFrame } from '../pages/payment/PaymentFrame';
import { CoinPacksAPI } from '../api/CoinPacksAPI';
import { BalanceAPIClient } from '../api/BalanceAPIClient';
import { DepositAPIClient } from '../api/DepositAPIClient';
import { WheelModal } from '../pages/wheel/WheelModal';
import { WheelAPIClient } from '../api/WheelAPIClient';


type Fixtures = {
  loginPage: LoginPage;
  lobbyPage: LobbyPage;
  shopModal: ShopModal;
  purchaseModal: PurchaseModal;
  paymentFrame: PaymentFrame;
  wheelModal: WheelModal;
  wheelAPI: WheelAPIClient;
  coinPacksAPI: CoinPacksAPI;
  balanceAPI: BalanceAPIClient;
  depositAPI: DepositAPIClient;
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
  coinPacksAPI: async ({ request }, use) => {
    await use(new CoinPacksAPI(request));
  },
  balanceAPI: async ({ request }, use) => {
    await use(new BalanceAPIClient(request));
  },
  depositAPI: async ({ request }, use) => {
    await use(new DepositAPIClient(request));
  },
  wheelModal: async ({ page }, use) => {
    await use(new WheelModal(page));
  },
  wheelAPI: async ({ request }, use) => {
    await use(new WheelAPIClient(request));
  },
});

export { expect } from '@playwright/test';
