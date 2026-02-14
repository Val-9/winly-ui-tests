import { test, expect } from '../../fixtures/test-fixtures';
import 'dotenv/config';
import { CoinPack } from '../../types/coinPack';

test.describe.parallel('Purchase flow', () => {
  test('Should successfully purchase coin pack', async ({
    page,
    lobbyPage,
    shopModal,
    purchaseModal,
    paymentFrame,
    coinPacksAPI,
    depositAPI,
    balanceAPI
  }) => {

    await page.goto('/');

    const packs: CoinPack[] = await coinPacksAPI.fetchCoinPacks();
    const selectedPack = packs.find(p => p.status === 'active');

    if (!selectedPack) {
      throw new Error('No active coin pack found');
    }

    const balanceBeforeGC = await balanceAPI.getBalance('GC');
    const balanceBeforeSC = await balanceAPI.getBalance('SC');

    await lobbyPage.openShop();

    const selected = await shopModal.selectCoinPackByBusinessData(selectedPack);

    await purchaseModal.waitForOpen();
    await purchaseModal.selectCreditCardIfNeeded();

    const depositInit =
      await purchaseModal.clickCompletePurchaseAndWaitDeposit(selected.packId);

    await paymentFrame.fillCardDetails({
      number: '4000020951595032',
      expiry: '11/30',
      cvv: '777',
      holder: 'Test Test',
    });

    await paymentFrame.submit();

    await purchaseModal.waitForSuccess();

    await depositAPI.waitForDepositComplete(depositInit.paymentId);

    const balanceAfterGC = await balanceAPI.getBalance('GC');
    const balanceAfterSC = await balanceAPI.getBalance('SC');

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
      await expect.poll(async () =>
        await lobbyPage.getUiBalance('GC')
      ).toBe(balanceAfterGC);

      await expect.poll(async () =>
        await lobbyPage.getUiBalance('SC')
      ).toBe(balanceAfterSC);
    });
  });
});
