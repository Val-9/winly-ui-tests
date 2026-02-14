import { test, expect } from '../../fixtures/test-fixtures';
import 'dotenv/config';
import { CoinPack } from '../../types/coinPack';
import type { UserInfoResponse } from '../../types/userInfo';

function extractBalance(
  userInfo: UserInfoResponse,
  currency: 'GC' | 'SC'
): number {
  const balance = userInfo.user.userBalance.find(
    b => b.userCurrency === currency
  );

  if (!balance) {
    throw new Error(`${currency} balance not found`);
  }

  return balance.userBalance;
}

test.describe.parallel('Purchase flow', () => {
  test('Should successfully purchase coin pack', async ({
    page,
    lobbyPage,
    shopModal,
    purchaseModal,
    paymentFrame,
    coinPacksAPI,
    depositAPI
  }) => {

    await page.goto('/');

    const packs: CoinPack[] = await coinPacksAPI.fetchCoinPacks();
    const selectedPack = packs.find(p => p.status === 'active');

    if (!selectedPack) {
      throw new Error('No active coin pack found');
    }

    const userInfoBeforeResponse = await page.request.get('/gateway/user/info');
    expect(userInfoBeforeResponse.status()).toBe(200);
    const userInfoBefore: UserInfoResponse = await userInfoBeforeResponse.json();

    const balanceBeforeGC = extractBalance(userInfoBefore, 'GC');
    const balanceBeforeSC = extractBalance(userInfoBefore, 'SC');

    await lobbyPage.openShop();

    const selected = await shopModal.selectCoinPackByBusinessData(selectedPack);

    await purchaseModal.waitForOpen();
    await purchaseModal.selectCreditCardIfNeeded();

    const depositInit = await purchaseModal.clickCompletePurchaseAndWaitDeposit(selected.packId);

    await paymentFrame.fillCardDetails({
      number: '4000020951595032',
      expiry: '11/30',
      cvv: '777',
      holder: 'Test Test',
    });

    await paymentFrame.submit();

    await purchaseModal.waitForSuccess();

    await depositAPI.waitForDepositComplete(depositInit.paymentId);

    const userInfoAfterResponse = await page.request.get('/gateway/user/info');
    expect(userInfoAfterResponse.status()).toBe(200);
    const userInfoAfter: UserInfoResponse = await userInfoAfterResponse.json();

    const balanceAfterGC = extractBalance(userInfoAfter, 'GC');
    const balanceAfterSC = extractBalance(userInfoAfter, 'SC');

    const addedGC = balanceAfterGC - balanceBeforeGC;
    const addedSC = balanceAfterSC - balanceBeforeSC;

    await test.step(
      `API RESULT: +${addedGC} GC / +${addedSC} SC | ${balanceBeforeGC}/${balanceBeforeSC} → ${balanceAfterGC}/${balanceAfterSC}`,
      async () => {
        expect(balanceAfterGC).toBe(balanceBeforeGC + selected.gcAmount);
        expect(balanceAfterSC).toBe(balanceBeforeSC + selected.scAmount);
      }
    );

    await purchaseModal.clickThanks();
    await lobbyPage.closeShopIfOpened();

    await test.step('UI balance updated', async () => {
      await expect.poll(async () => {
        return await lobbyPage.getGcBalanceNumber();
      }).toBe(balanceAfterGC);

      await expect.poll(async () => {
        return await lobbyPage.getScBalanceNumber();
      }).toBe(balanceAfterSC);
    });
  });
});
