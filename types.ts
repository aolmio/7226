
export interface GoldWeight {
  kyat: number;
  pae: number;
  yway: number;
}

export interface CalculationResult {
  totalWeightInKyat: number;
  totalPrice: number;
  formattedPrice: string;
  wasteAmount: number;
  handmadeFee: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  weight: GoldWeight;
  pricePerKyat: number;
  totalPrice: number;
}

export enum CalculationMode {
  BUY = 'BUY',
  SELL = 'SELL'
}
