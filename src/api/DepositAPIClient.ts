import { APIRequestContext, expect } from '@playwright/test';

export type DepositInitResponse = {
  url: string;
  paymentId: string;
};

export type DepositStatusResponse = {
  userId: number;
  coinPackId: number;
  paymentId: string;
  status: 'In progress' | 'Complete' | 'Failed';
  createdAt: string;
  updatedAt: string;
};

export class DepositAPIClient {
  constructor(private request: APIRequestContext) {}

  async getDepositStatus(paymentId: string): Promise<DepositStatusResponse> {
    const response = await this.request.get(
      `/gateway/coin-packs/deposit/${paymentId}/status`
    );

    expect(response.status()).toBe(200);

    return (await response.json()) as DepositStatusResponse;
  }

  async waitForDepositComplete(
    paymentId: string,
    timeoutMs = 20000
  ): Promise<DepositStatusResponse> {

    let finalStatus: DepositStatusResponse | null = null;

    await expect.poll(async () => {
      const status = await this.getDepositStatus(paymentId);

      if (status.status === 'Failed') {
        throw new Error('Deposit failed on backend');
      }

      finalStatus = status;
      return status.status;
    }, {
      timeout: timeoutMs,
      intervals: [1000]
    }).toBe('Complete');

    return finalStatus!;
  }
}
