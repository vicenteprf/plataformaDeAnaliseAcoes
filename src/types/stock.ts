export interface Stock {
  symbol: string;
  shortName: string;
  longName: string;
  name: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  dividendYield: number | null;
  regularMarketDayLow?: number;
  regularMarketDayHigh?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  industryDisp: string;
  sector: string;
  longBusinessSummary: string;
  priceEarnings: number;
  marketCap: number;
  historicalDataPrice?: {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

export interface Alert {
  id: string;
  user_id: string;
  ticker: string;
  target_price: number;
  type: "above" | "below";
  email: string;
  active: boolean;
  created_at: string;
}
