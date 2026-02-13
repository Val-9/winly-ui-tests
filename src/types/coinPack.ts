export type CoinPack = {
  id: number;
  goldenCoins: number;
  sweepCoins: number;
  shownPrice: number;
  realPrice: number;
  oldPrice: number | null;
  status: string;
  tag: string | null;
  type: string;
  icon: string;
  order: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};
