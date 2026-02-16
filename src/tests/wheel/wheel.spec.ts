import { test, expect } from '../../fixtures/test-fixtures';
import 'dotenv/config';

test.describe.parallel('Wheel flow', () => {

  test('Should exhaust spins and activate cooldown', async ({
    page,
    wheelModal,
    wheelAPI,
    balanceAPI,
    lobbyPage
  }) => {

    await page.goto('/');

    const wheelStateBefore = await wheelAPI.getWheelState();
    const spins = wheelStateBefore.remainingSpins;

    if (spins === 0) {
      throw new Error('No spins available. Test requires active spins.');
    }

    const balanceBeforeGC = await balanceAPI.getBalance('GC');
    const balanceBeforeSC = await balanceAPI.getBalance('SC');

    let totalWonGC = 0;
    let totalWonSC = 0;

    await test.step(
      `INITIAL STATE: ${spins} spins | GC=${balanceBeforeGC} | SC=${balanceBeforeSC}`,
      async () => {}
    );

    await wheelModal.open();

    for (let i = 0; i < spins; i++) {

      const spinResponsePromise = page.waitForResponse(r =>
        r.url().includes('/gateway/wheel/spin') &&
        r.request().method() === 'POST'
      );

      await wheelModal.spin();

      const response = await spinResponsePromise;
      const data = await response.json();

      const { value, type } = data.result;

      if (type === 'GC') totalWonGC += value;
      if (type === 'SC') totalWonSC += value;

      await wheelModal.waitForReward();
      await wheelModal.closeReward();
    }

    await test.step(
      `API RESULT: +${totalWonGC} GC / +${totalWonSC} SC`,
      async () => {

        if (totalWonGC > 0) {
          await expect.poll(() =>
            balanceAPI.getBalance('GC')
          ).toBe(balanceBeforeGC + totalWonGC);
        }

        if (totalWonSC > 0) {
          await expect.poll(() =>
            balanceAPI.getBalance('SC')
          ).toBe(balanceBeforeSC + totalWonSC);
        }

        const stateAfter = await wheelAPI.getWheelState();

        expect(stateAfter.remainingSpins).toBe(0);
        expect(stateAfter.cooldown).toBeGreaterThan(0);
      }
    );

    
    await test.step('UI cooldown state visible', async () => {
      await wheelModal.expectCooldownActive();
    });

    await test.step('UI balance updated', async () => {

      if (totalWonGC > 0) {
        await expect.poll(async () =>
          await lobbyPage.getUiBalance('GC')
        ).toBe(balanceBeforeGC + totalWonGC);
      }

      if (totalWonSC > 0) {
        await expect.poll(async () =>
          await lobbyPage.getUiBalance('SC')
        ).toBe(balanceBeforeSC + totalWonSC);
      }
    });

  });

});
