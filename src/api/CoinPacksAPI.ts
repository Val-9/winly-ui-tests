import { APIRequestContext } from '@playwright/test';
import { CoinPack } from '../types/coinPack';

export class CoinPacksAPI {
  constructor(private request: APIRequestContext) {}

  async fetchCoinPacks(): Promise<CoinPack[]> {
    const response = await this.request.get('/gateway/coin-packs');

    if (response.status() !== 200) {
      throw new Error(
        `Failed to fetch coin packs. Status: ${response.status()}`
      );
    }

    const body = await response.json();

    return body as CoinPack[];
  }
}
