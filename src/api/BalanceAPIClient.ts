import { APIRequestContext, expect } from '@playwright/test';
import type { UserInfoResponse } from '../types/userInfo';

export class BalanceAPIClient {
  constructor(private request: APIRequestContext) {}

  async getUserInfo(): Promise<UserInfoResponse> {
    const response = await this.request.get('/gateway/user/info');
    expect(response.status()).toBe(200);
    return (await response.json()) as UserInfoResponse;
  }

  async getBalance(currency: 'GC' | 'SC'): Promise<number> {
    const userInfo = await this.getUserInfo();

    const balance = userInfo.user.userBalance.find(
      b => b.userCurrency === currency
    );

    if (!balance) {
      throw new Error(`${currency} balance not found`);
    }

    return balance.userBalance;
  }
}
