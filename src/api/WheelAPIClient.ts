import { APIRequestContext, expect } from '@playwright/test';

export interface WheelSegment {
  id: number;
  value: number;
  type: 'GC' | 'SC';
}

export interface WheelStateResponse {
  segments: WheelSegment[];
  isActive: boolean;
  cooldown: number;
  wheelSpinsPerCooldown: number;
  remainingSpins: number;
}

export interface SpinResult {
  result: {
    id: number;
    value: number;
    type: 'GC' | 'SC';
  };
}

export class WheelAPIClient {
  constructor(private request: APIRequestContext) {}

  async getWheelState(): Promise<WheelStateResponse> {
    const response = await this.request.get('/gateway/wheel');
    expect(response.status()).toBe(200);
    return (await response.json()) as WheelStateResponse;
  }

  async spin(): Promise<SpinResult> {
    const response = await this.request.post('/gateway/wheel/spin');
    expect(response.status()).toBe(200);
    return (await response.json()) as SpinResult;
  }
}


