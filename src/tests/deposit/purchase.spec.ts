import { test, expect } from '../../fixtures/test-fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

test('Should successfully purchase coin pack', async ({ page, loginPage, lobbyPage, shopModal, purchaseModal, paymentFrame }) => {
  const username = process.env.LOGIN_USERNAME!;
  const password = process.env.LOGIN_PASSWORD!;
  const baseUrl = process.env.BASE_URL!;

  const indexRaw = process.env.COIN_PACK_INDEX ?? '0';
  const packIndex = Number.parseInt(indexRaw, 10);
  if (Number.isNaN(packIndex)) {
    throw new Error(`COIN_PACK_INDEX must be an integer. Got: ${indexRaw}`);
  }

  // 1) Login
  await loginPage.navigate(baseUrl);
  await loginPage.openLoginModal();

  const loginResponsePromise = page.waitForResponse(r =>
    r.url().includes('/gateway/login.data') && r.request().method() === 'POST'
  );

  await loginPage.login(username, password);
  const loginResp = await loginResponsePromise;
  expect(loginResp.status()).toBe(202);

  await loginPage.waitForElement(loginPage.sideNavigation);
  await expect(page).toHaveURL(/.*\/lobby/);

  // 2) Open Shop modal
  await lobbyPage.openShop();

  // 3) Wait /coin-packs and select pack by index
  const selected = await shopModal.selectCoinPackByIndex(packIndex);

  // 4) Purchase modal should appear
  await purchaseModal.waitForOpen();

  // 5) Select payment method "Credit Card" (safe if already selected)
  await purchaseModal.selectCreditCardIfNeeded();

  // 6) Click "Complete Purchase" and validate deposit request
  await purchaseModal.clickCompletePurchaseAndWaitDeposit(selected.packId);

  // 7) Fill card data in provider iframe and pay
  await paymentFrame.fillCardDetails({
    number: '4000020951595032',
    expiry: '11/30',
    cvv: '777',
    holder: 'Test Test',
  });
  await paymentFrame.submit();

  // 8) Wait for success modal and click Thanks!
  await purchaseModal.waitForSuccess();
  await purchaseModal.clickThanks();
});
