import { test } from '../../fixtures/test-fixtures';
import 'dotenv/config';

test.describe.parallel('Purchase flow', () => {
  test('Should successfully purchase coin pack', async ({
    page,
    lobbyPage,
    shopModal,
    purchaseModal,
    paymentFrame
  }) => {

    await page.goto('/');
    
    const indexRaw = process.env.COIN_PACK_INDEX ?? '0';
    const packIndex = Number.parseInt(indexRaw, 10);

    if (Number.isNaN(packIndex)) {
      throw new Error(`COIN_PACK_INDEX must be an integer. Got: ${indexRaw}`);
    }

    await lobbyPage.openShop();

    const selectedPack = await shopModal.selectCoinPackByIndex(packIndex);

    await purchaseModal.waitForOpen();

    await purchaseModal.selectCreditCardIfNeeded();

    await purchaseModal.clickCompletePurchaseAndWaitDeposit(
      selectedPack.packId
    );

    await paymentFrame.fillCardDetails({
      number: '4000020951595032',
      expiry: '11/30',
      cvv: '777',
      holder: 'Test Test',
    });

    await paymentFrame.submit();

    await purchaseModal.waitForSuccess();

    await purchaseModal.clickThanks();
  });
});
