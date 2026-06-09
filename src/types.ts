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
  drawdown: number; // percentage
  sessionActivity: number; // 0-100
  backtestedExpectancy: number; // expectancy value
  signalQuality: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'NONE';
  rankingScore: number;
}

export type SignalDirection = 'CALL' | 'PUT';

export interface TradeSignal {
  id: string;
  pair: string;
  direction: SignalDirection;
  entryPrice: number; // Expected or actual entry
  signalStrength: number; // 0-100
  confidenceScore: number; // 0-100
  qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  timeframe: '1m' | '5m' | '15m';
  alertTime: string; // Time signal generated (10s before entry)
  entryTime: string; // Target entry time (e.g. 10:05:00)
  expiryTime: string; // Target expiry time (e.g. 10:10:00)
  factors: SignalFactor[];
  status: 'PRE_ALERT' | 'ACTIVE' | 'WON' | 'LOST' | 'TIE';
  profitAmount?: number;
}

export interface SignalFactor {
  name: string;
  score: number;
}

export interface BacktestAnalytics {
  pair: string;
  timeframe: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  tieTrades: number;
  winRate: number;
  itmRate: number; // In the money rate
  averagePayout: number;
  maxDrawdown: number;
  recoveryFactor: number;
  sharpeRatio: number;
  monthlyReturns: number;
  yearlyReturns: number;
  bestSession: string;
  worstSession: string;
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
