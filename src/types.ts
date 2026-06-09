export type PairCategory = 'MAJORS' | 'MINORS' | 'EXOTICS';

export interface PairStat {
  symbol: string;
  category: PairCategory;
  price: number;
  spread: number;
  volatility: number; // 0-100
  trend: 'UP' | 'DOWN' | 'RANGING';
  trendStrength: number; // 0-100
  liquidity: number; // 0-100
  winRate: number; // percentage
  sessionActivity: number; // 0-100
  backtestedExpectancy: number; // expectancy value
  signalQuality: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'NONE';
  rankingScore: number;
}

export type SignalDirection = 'BUY CALL' | 'SELL PUT';

export interface TradeSignal {
  id: string;
  pair: string;
  direction: SignalDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: string;
  signalStrength: number; // 0-100
  confidenceScore: number; // 0-100
  qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  expectedDuration: '1m' | '5m' | '15m' | '30m' | '1H';
  entryTime: string; // ISO String
  expiryTime: string; // ISO String
  factors: SignalFactor[];
  status: 'ACTIVE' | 'WON' | 'LOST' | 'EXPIRED';
  pnl?: number;
}

export interface SignalFactor {
  name: string;
  score: number;
}

export interface BacktestAnalytics {
  pair: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  recoveryFactor: number;
  sharpeRatio: number;
  expectancy: number;
  monthlyReturns: number;
  yearlyReturns: number;
  bestSession: string;
  worstSession: string;
  bestStrategy: string;
  worstStrategy: string;
}

export interface MarketSession {
  name: string;
  open: boolean;
  timeRemaining: string; // HH:MM:SS
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  performance: number; // percentage +/-
  color: string;
}

export interface NewsEvent {
  id: string;
  time: string; // ISO
  currency: string;
  event: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}
