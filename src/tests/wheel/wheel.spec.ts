import { test, expect } from '../../fixtures/test-fixtures';
import 'dotenv/config';

type Currency = 'GC' | 'SC';

test.describe.parallel('Wheel flow', () => {

  test('Should exhaust spins and activate cooldown', async ({
    wheelModal,
    wheelAPI,
    balanceAPI,
    lobbyPage
  }) => {

    await test.step('Prepare: check initial state', async () => {

      await lobbyPage.navigate('/');
      const state = await wheelAPI.getWheelState();
      test.skip(state.remainingSpins === 0, 'No spins available.');

    });

    const balanceBefore: Record<Currency, number> = {
      GC: await balanceAPI.getBalance('GC'),
      SC: await balanceAPI.getBalance('SC')
    };

    await wheelModal.open();

    const totalWon = await test.step<Record<Currency, number>>(
      'Execute all available spins',
      async () => {
        return await wheelModal.spinUntilExhausted();
      }
    );

    await test.step(
      `Verify API Result: +${totalWon.GC} GC / +${totalWon.SC} SC`,
      async () => {
        for (const currency of ['GC', 'SC'] as const) {
          const expectedBalance =
            balanceBefore[currency] + totalWon[currency];

          await expect.poll(() =>
            balanceAPI.getBalance(currency)
          ).toBe(expectedBalance);
        }

        const stateAfter = await wheelAPI.getWheelState();
        expect(stateAfter.remainingSpins).toBe(0);
        expect(stateAfter.cooldown).toBeGreaterThan(0);
      }
    );

    await test.step('Verify UI state and balance update', async () => {
      await wheelModal.expectCooldownActive();
      for (const currency of ['GC', 'SC'] as const) {
        const expectedBalance =
          balanceBefore[currency] + totalWon[currency];

        await expect.poll(() =>
          lobbyPage.getUiBalance(currency)
        ).toBe(expectedBalance);
            console.log({
              balanceBefore: balanceBefore[currency],
              totalWon: totalWon[currency],
              expected: expectedBalance
        });
      }
    });
  });
});
