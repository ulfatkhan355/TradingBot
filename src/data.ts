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
  }).sort((a, b) => b.rankingScore - a.rankingScore);
}

export function generateActiveSignals(pairs: PairStat[]): TradeSignal[] {
  const activeSignals: TradeSignal[] = [];
  const topPairs = pairs.filter(p => !['C', 'NONE'].includes(p.signalQuality)).slice(0, 10);

  topPairs.forEach((pair, index) => {
    if (Math.random() > 0.4) {
      const direction = pair.trend === 'UP' ? 'BUY CALL' : 'SELL PUT';
      const score = randomBetween(70, 95);
      const isJpy = pair.symbol.includes('JPY');
      const pipMultiplier = isJpy ? 0.01 : 0.0001;
      const entryPrice = pair.price;
      const slOffset = randomBetween(10, 30, 1) * pipMultiplier * (direction === 'BUY CALL' ? -1 : 1);
      const tpOffset = Math.abs(slOffset) * randomBetween(1.5, 3, 1) * (direction === 'BUY CALL' ? 1 : -1);

      const entryTime = new Date();
      entryTime.setMinutes(entryTime.getMinutes() - randomBetween(1, 15));
      const expDurs: ('1m' | '5m' | '15m' | '30m' | '1H')[] = ['5m', '15m', '30m', '1H'];
      const duration = expDurs[Math.floor(Math.random() * expDurs.length)];
      const expiryMinutes = duration === '5m' ? 5 : duration === '15m' ? 15 : duration === '30m' ? 30 : 60;
      const expiryTime = new Date(entryTime.getTime() + expiryMinutes * 60000);

      activeSignals.push({
        id: `SIG-${index}-${Date.now()}`,
        pair: pair.symbol,
        direction,
        entryPrice: randomBetween(pair.price - pipMultiplier*5, pair.price + pipMultiplier*5, isJpy ? 3 : 5),
        stopLoss: entryPrice + slOffset,
        takeProfit: entryPrice + tpOffset,
        riskReward: `1:${(Math.abs(tpOffset) / Math.abs(slOffset)).toFixed(1)}`,
        signalStrength: score,
        confidenceScore: score + randomBetween(-5, 5),
        qualityGrade: pair.signalQuality as 'A+' | 'A' | 'B+' | 'B' | 'C',
        expectedDuration: duration,
        entryTime: entryTime.toISOString(),
        expiryTime: expiryTime.toISOString(),
        status: 'ACTIVE',
        factors: [
          { name: 'Liquidity Sweep', score: randomBetween(10, 20) },
          { name: 'Bullish FVG', score: randomBetween(10, 20) },
          { name: 'HTF Alignment', score: randomBetween(15, 25) },
          { name: 'Volume Confirmation', score: randomBetween(5, 15) }
        ]
      });
    }
  });

  return activeSignals;
}

export function generateBacktestAnalytics(pair: string): BacktestAnalytics {
  const totalTrades = randomBetween(200, 1500);
  const winRate = randomBetween(55, 85, 1);
  const winningTrades = Math.floor((winRate / 100) * totalTrades);
  const losingTrades = totalTrades - winningTrades;

  return {
    pair,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    profitFactor: randomBetween(1.2, 3.5, 2),
    averageWin: randomBetween(100, 300, 2),
    averageLoss: randomBetween(-50, -150, 2),
    maxDrawdown: randomBetween(5, 30, 2),
    recoveryFactor: randomBetween(1.5, 5.0, 2),
    sharpeRatio: randomBetween(0.8, 2.5, 2),
    expectancy: randomBetween(0.2, 2.5, 2),
    monthlyReturns: randomBetween(2, 15, 2),
    yearlyReturns: randomBetween(30, 250, 2),
    bestSession: ['London', 'New York', 'Tokyo'][Math.floor(Math.random() * 3)],
    worstSession: ['Sydney', 'Tokyo', 'London'][Math.floor(Math.random() * 3)],
    bestStrategy: ['Liquidity Sweep', 'Momentum Breakout', 'Mean Reversion'][Math.floor(Math.random() * 3)],
    worstStrategy: ['Trend Following', 'RSI Divergence', 'News Fade'][Math.floor(Math.random() * 3)],
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

export function generateSignalHistory(count = 50): TradeSignal[] {
    const history: TradeSignal[] = [];
    const pairs = [...MAJORS, ...MINORS];
    for (let i=0; i<count; i++) {
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const isJpy = pair.includes('JPY');
        const price = isJpy ? randomBetween(130, 150, 3) : randomBetween(0.9, 1.5, 5);
        const direction = Math.random() > 0.5 ? 'BUY CALL' : 'SELL PUT';
        const won = Math.random() > 0.4; // 60% win rate
        
        history.push({
            id: `HIST-${i}`,
            pair,
            direction,
            entryPrice: price,
            stopLoss: price * (direction === 'BUY CALL' ? 0.99 : 1.01),
            takeProfit: price * (direction === 'BUY CALL' ? 1.02 : 0.98),
            riskReward: '1:2.0',
            signalStrength: randomBetween(70, 95),
            confidenceScore: randomBetween(70, 99),
            qualityGrade: ['A+', 'A', 'B+'][Math.floor(Math.random()*3)] as any,
            expectedDuration: '15m',
            entryTime: new Date(Date.now() - randomBetween(1, 30) * 86400000).toISOString(),
            expiryTime: new Date(Date.now() - randomBetween(1, 30) * 86400000 + 4500000).toISOString(),
            factors: [],
            status: won ? 'WON' : 'LOST',
            pnl: won ? randomBetween(10, 100, 2) : randomBetween(-10, -50, 2)
        });
    }
    return history.sort((a,b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime());
}
