export type UserBalance = {
    userBalance: number;
    userCurrency: 'GC' | 'SC';
    isMain: boolean;
    wager: number;
    isWagerApplicable: boolean;
  };
  
  export type UserInfoResponse = {
    success: boolean;
    token: string | null;
    user: {
      userId: number;
      userBalance: UserBalance[];
    };
    error: string | null;
    twoFactorRequired: boolean | null;
    sessionId: string | null;
  };
  