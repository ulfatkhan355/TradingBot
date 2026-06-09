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

const ALL_PAIRS = [
  ...MAJORS.map((p) => ({ symbol: p, category: 'MAJORS' as const })),
  ...MINORS.map((p) => ({ symbol: p, category: 'MINORS' as const })),
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
    const trendStrength = randomBetween(50, 95);
    const trendRand = Math.random();
    const trend = (trendRand > 0.6 ? 'UP' : trendRand > 0.3 ? 'DOWN' : 'RANGING') as 'UP' | 'DOWN' | 'RANGING';
    const liquidity = isMajor ? randomBetween(80, 100) : randomBetween(40, 80);
    // Enforce high winrate (62-88%) and max drawdown < 10% (1-9%)
    const winRate = randomBetween(62, 88, 1);
    const drawdown = randomBetween(1, 9, 1);
    
    // Determine ranking score based on winRate and drawdown primarily
    const rankingScore = (winRate * 0.6) + ((10 - drawdown) * 2) + (volatility * 0.1) + (liquidity * 0.1);

    let signalQuality: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'NONE' = 'NONE';
    if (rankingScore > 85) signalQuality = 'A+';
    else if (rankingScore > 75) signalQuality = 'A';
    else if (rankingScore > 65) signalQuality = 'B+';
    else if (rankingScore > 55) signalQuality = 'B';
    else signalQuality = 'C';

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
      drawdown,
      sessionActivity: randomBetween(30, 100),
      backtestedExpectancy: randomBetween(0.8, 2.5, 2),
      signalQuality,
      rankingScore,
    };
  }).filter(p => p.drawdown < 10).sort((a, b) => b.winRate - a.winRate);
}

export const BINARY_PAIRS = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCHF', 'USDCAD', 'EURJPY'];

export function generateActiveSignals(pairs: PairStat[], timeframe: '1m'|'5m'|'15m' = '5m'): TradeSignal[] {
  const activeSignals: TradeSignal[] = [];
  
  // Filter and rank pairs based on user criteria: WR >= 60%, Drawdown <= 10%
  let eligiblePairs = pairs
    .filter(p => p.winRate >= 60 && p.drawdown <= 10)
    .sort((a, b) => b.winRate - a.winRate);

  // Fallback if not enough eligible pairs (shouldn't happen with our data generator, but good practice)
  if (eligiblePairs.length < 2) {
      eligiblePairs = pairs.sort((a, b) => b.winRate - a.winRate);
  }

  // Pick the top 2 highest ranked pairs for signals
  const pair1 = eligiblePairs[0];
  const pair2 = eligiblePairs[1];

  const createSignal = (pair: PairStat) => {
      const direction = Math.random() > 0.5 ? 'CALL' : 'PUT';
      const score = randomBetween(70, 95);
      
      const now = Date.now();
      const timeframeMs = (timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : 15) * 60000;
      
      // Entry in 10 seconds exactly to demonstrate alert
      const alertTimeMs = now;
      const entryTimeMs = now + 10000;
      const expiryTimeMs = entryTimeMs + timeframeMs;
      
      let status: 'PRE_ALERT' | 'ACTIVE' | 'WON' | 'LOST' | 'TIE' = 'PRE_ALERT';

      return {
        id: `SIG-${Date.now()}-${pair.symbol}`,
        pair: pair.symbol,
        direction,
        entryPrice: pair.price,
        signalStrength: score,
        confidenceScore: score,
        qualityGrade: pair.signalQuality as 'A+' | 'A' | 'B+' | 'B' | 'C',
        timeframe,
        alertTime: new Date(alertTimeMs).toISOString(),
        entryTime: new Date(entryTimeMs).toISOString(),
        expiryTime: new Date(expiryTimeMs).toISOString(),
        status,
        profitAmount: 85,
        factors: [
          { name: 'Binary Pattern', score: randomBetween(10, 20) },
          { name: 'Momentum Shift', score: randomBetween(10, 20) },
          { name: 'Volume Surge', score: randomBetween(15, 25) },
          { name: 'RSI Divergence', score: randomBetween(5, 15) }
        ]
      };
  };

  activeSignals.push(createSignal(pair1));
  activeSignals.push(createSignal(pair2));

  return activeSignals;
}

export function generateBacktestAnalytics(pair: string, timeframe: string = '5m'): BacktestAnalytics {
  const totalTrades = randomBetween(500, 2500);
  const winRate = randomBetween(65, 85, 1);
  const itmRate = winRate;
  const winningTrades = Math.floor((winRate / 100) * totalTrades);
  const tieTrades = Math.floor(totalTrades * 0.03); // 3% ties
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
    maxDrawdown: randomBetween(2, 9.5, 1),
    recoveryFactor: randomBetween(2.0, 6.0, 2),
    sharpeRatio: randomBetween(1.5, 3.5, 2),
    monthlyReturns: randomBetween(8, 25, 2),
    yearlyReturns: randomBetween(90, 350, 2),
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
        const won = rand > 0.35; // 65% win rate
        const tie = rand > 0.30 && rand <= 0.35; // 5% tie
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
