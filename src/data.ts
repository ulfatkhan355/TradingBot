import {
  PairStat,
  TradeSignal,
  BacktestAnalytics,
  MarketSession,
  NewsEvent,
} from './types';

export const MAJORS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
];

export const MINORS = [
  'EURGBP', 'EURJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'EURNZD',
  'GBPJPY', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPNZD',
  'AUDJPY', 'AUDCAD', 'AUDCHF', 'AUDNZD',
  'CADJPY', 'CHFJPY', 'NZDJPY', 'NZDCAD', 'NZDCHF',
];

export const EXOTICS = [
  'USDTRY', 'USDZAR', 'USDMXN', 'USDSEK', 'USDNOK', 'USDHKD', 'USDPLN', 'USDSGD', 'USDHUF', 'USDTHB', 'USDCNH',
];

const ALL_PAIRS = [
  ...MAJORS.map((p) => ({ symbol: p, category: 'MAJORS' as const })),
  ...MINORS.map((p) => ({ symbol: p, category: 'MINORS' as const })),
  ...EXOTICS.map((p) => ({ symbol: p, category: 'EXOTICS' as const })),
];

function randomBetween(min: number, max: number, decimals = 0) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
}

export function generatePairsData(): PairStat[] {
  return ALL_PAIRS.map((pair) => {
    const isMajor = pair.category === 'MAJORS';
    const volatility = randomBetween(30, 95);
    const trendStrength = randomBetween(20, 90);
    const trendRand = Math.random();
    const trend = (trendRand > 0.6 ? 'UP' : trendRand > 0.3 ? 'DOWN' : 'RANGING') as 'UP' | 'DOWN' | 'RANGING';
    const liquidity = isMajor ? randomBetween(80, 100) : randomBetween(40, 80);
    const winRate = randomBetween(45, 85, 1);
    
    // Determine ranking score
    const rankingScore = (volatility * 0.3) + (trendStrength * 0.3) + (liquidity * 0.2) + (winRate * 0.2);

    let signalQuality: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'NONE' = 'NONE';
    if (rankingScore > 85) signalQuality = 'A+';
    else if (rankingScore > 75) signalQuality = 'A';
    else if (rankingScore > 65) signalQuality = 'B+';
    else if (rankingScore > 55) signalQuality = 'B';
    else if (rankingScore > 40) signalQuality = 'C';

    const basePrice = pair.symbol.includes('JPY') ? randomBetween(130, 150, 3) : randomBetween(0.9, 1.5, 5);

    return {
      symbol: pair.symbol,
      category: pair.category,
      price: basePrice,
      spread: isMajor ? randomBetween(0.1, 1.5, 1) : randomBetween(1.0, 5.0, 1),
      volatility,
      trend,
      trendStrength,
      liquidity,
      winRate,
      sessionActivity: randomBetween(30, 100),
      backtestedExpectancy: randomBetween(-0.5, 2.5, 2),
      signalQuality,
      rankingScore,
    };
  }).sort((a, b) => b.winRate - a.winRate);
}

export function generateActiveSignals(pairs: PairStat[], timeframe: '1m'|'5m'|'15m' = '5m'): TradeSignal[] {
  const activeSignals: TradeSignal[] = [];
  const topPairs = pairs.filter(p => !['C', 'NONE'].includes(p.signalQuality)).sort((a, b) => b.winRate - a.winRate).slice(0, 2);

  topPairs.forEach((pair, index) => {
      const direction = pair.trend === 'DOWN' ? 'PUT' : 'CALL';
      const score = randomBetween(85, 99);
      const isJpy = pair.symbol.includes('JPY');
      const pipMultiplier = isJpy ? 0.01 : 0.0001;
      
      const now = Date.now();
      const timeframeMs = (timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : 15) * 60000;
      
      // Calculate next candle open time
      const nextCandleTime = Math.ceil(now / timeframeMs) * timeframeMs;
      
      // Target entry is next candle open. Alert is 10s before.
      const entryTimeMs = nextCandleTime;
      const alertTimeMs = entryTimeMs - 10000;
      const expiryTimeMs = entryTimeMs + timeframeMs;
      
      let status: 'PRE_ALERT' | 'ACTIVE' | 'WON' | 'LOST' | 'TIE' = 'PRE_ALERT';
      if (now >= entryTimeMs) {
         status = 'ACTIVE';
      }

      activeSignals.push({
        id: `SIG-${index}-${Date.now()}`,
        pair: pair.symbol,
        direction,
        entryPrice: pair.price, // Target entry price (current price at alert)
        signalStrength: score,
        confidenceScore: score + randomBetween(-5, 5),
        qualityGrade: pair.signalQuality as 'A+' | 'A' | 'B+' | 'B' | 'C',
        timeframe,
        alertTime: new Date(alertTimeMs).toISOString(),
        entryTime: new Date(entryTimeMs).toISOString(),
        expiryTime: new Date(expiryTimeMs).toISOString(),
        status,
        profitAmount: 85, // Default 85% payout
        factors: [
          { name: 'Binary Pattern', score: randomBetween(10, 20) },
          { name: 'Momentum Shift', score: randomBetween(10, 20) },
          { name: 'Volume Surge', score: randomBetween(15, 25) },
          { name: 'RSI Divergence', score: randomBetween(5, 15) }
        ]
      });
  });

  return activeSignals;
}

export function generateBacktestAnalytics(pair: string, timeframe: string = '5m'): BacktestAnalytics {
  const totalTrades = randomBetween(200, 1500);
  const winRate = randomBetween(55, 75, 1);
  const itmRate = winRate;
  const winningTrades = Math.floor((winRate / 100) * totalTrades);
  const tieTrades = Math.floor(totalTrades * 0.05); // 5% ties
  const losingTrades = totalTrades - winningTrades - tieTrades;

  return {
    pair,
    timeframe,
    totalTrades,
    winningTrades,
    losingTrades,
    tieTrades,
    winRate,
    itmRate,
    averagePayout: 85, // 85% payout
    maxDrawdown: randomBetween(5, 30, 2),
    recoveryFactor: randomBetween(1.5, 5.0, 2),
    sharpeRatio: randomBetween(0.8, 2.5, 2),
    monthlyReturns: randomBetween(2, 15, 2),
    yearlyReturns: randomBetween(30, 250, 2),
    bestSession: ['London', 'New York', 'Tokyo'][Math.floor(Math.random() * 3)],
    worstSession: ['Sydney', 'Tokyo', 'London'][Math.floor(Math.random() * 3)],
  };
}

export const SESSIONS: MarketSession[] = [
  { name: 'Sydney', open: false, timeRemaining: '00:00:00', volatility: 'LOW', performance: -0.2, color: 'text-indigo-400' },
  { name: 'Tokyo', open: true, timeRemaining: '04:15:30', volatility: 'MEDIUM', performance: 0.5, color: 'text-blue-400' },
  { name: 'London', open: true, timeRemaining: '08:45:00', volatility: 'HIGH', performance: 1.2, color: 'text-green-400' },
  { name: 'New York', open: false, timeRemaining: '00:00:00', volatility: 'HIGH', performance: -0.8, color: 'text-rose-400' },
];

export const MOCK_NEWS: NewsEvent[] = [
  { id: '1', time: new Date(Date.now() + 3600000).toISOString(), currency: 'USD', event: 'Non-Farm Employment Change', impact: 'HIGH' },
  { id: '2', time: new Date(Date.now() + 7200000).toISOString(), currency: 'EUR', event: 'ECB Press Conference', impact: 'HIGH' },
  { id: '3', time: new Date(Date.now() + 1800000).toISOString(), currency: 'GBP', event: 'Services PMI', impact: 'MEDIUM' },
  { id: '4', time: new Date(Date.now() - 3600000).toISOString(), currency: 'JPY', event: 'Monetary Policy Statement', impact: 'HIGH' },
];

export function generateSignalHistory(count = 50, timeframe: '1m'|'5m'|'15m' = '5m'): TradeSignal[] {
    const history: TradeSignal[] = [];
    const pairs = [...MAJORS, ...MINORS];
    for (let i=0; i<count; i++) {
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const isJpy = pair.includes('JPY');
        const price = isJpy ? randomBetween(130, 150, 3) : randomBetween(0.9, 1.5, 5);
        const direction = Math.random() > 0.5 ? 'CALL' : 'PUT';
        const rand = Math.random();
        const won = rand > 0.45; // 55% win rate
        const tie = rand > 0.4 && rand <= 0.45; // 5% tie
        const timeframeMs = (timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : 15) * 60000;
        
        const entryTimeMs = Date.now() - randomBetween(1, 30) * 86400000;
        const expiryTimeMs = entryTimeMs + timeframeMs;
        const alertTimeMs = entryTimeMs - 10000;
        
        history.push({
            id: `HIST-${i}`,
            pair,
            direction,
            entryPrice: price,
            signalStrength: randomBetween(70, 95),
            confidenceScore: randomBetween(70, 99),
            qualityGrade: ['A+', 'A', 'B+'][Math.floor(Math.random()*3)] as any,
            timeframe,
            alertTime: new Date(alertTimeMs).toISOString(),
            entryTime: new Date(entryTimeMs).toISOString(),
            expiryTime: new Date(expiryTimeMs).toISOString(),
            factors: [],
            status: won ? 'WON' : tie ? 'TIE' : 'LOST',
            profitAmount: won ? 85 : tie ? 0 : -100 // Using 100 as base bet for PnL example
        });
    }
    return history.sort((a,b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime());
}
