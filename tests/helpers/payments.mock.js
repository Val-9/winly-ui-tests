// Example payments mock (placeholder).
export const mockPayments = async (page) => {
  await page.route('**/payments/**', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
  });
};
