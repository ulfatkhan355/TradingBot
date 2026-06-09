import React, { useEffect, useState } from 'react';
import { TradeSignal } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Clock, ShieldCheck, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const SignalCard: React.FC<{ signal: TradeSignal }> = ({ signal }) => {
    const isBuy = signal.direction === 'BUY CALL';
    const [, setTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const expiryTime = new Date(signal.expiryTime).getTime();
    const now = Date.now();
    const remainingMs = Math.max(0, expiryTime - now);
    const m = Math.floor(remainingMs / 60000).toString().padStart(2, '0');
    const s = Math.floor((remainingMs % 60000) / 1000).toString().padStart(2, '0');

    return (
        <div className="bg-[#1e222d] rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-100">{signal.pair}</h3>
                    <p className="text-xs text-gray-500 font-mono">{signal.expectedDuration} Expiry</p>
                </div>
                <div className={cn(
                    "flex items-center px-2 py-1 rounded text-xs font-bold font-mono tracking-tight",
                    isBuy ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                )}>
                    {isBuy ? <ArrowUpCircle className="w-3 h-3 mr-1" /> : <ArrowDownCircle className="w-3 h-3 mr-1" />}
                    {signal.direction}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-mono">
                <div>
                    <p className="text-gray-500 text-[10px] uppercase">Entry</p>
                    <p className="text-gray-200">{signal.entryPrice.toFixed(5)}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-[10px] uppercase">Quality</p>
                    <p className={cn(
                        "font-bold",
                        signal.qualityGrade.includes('A') ? "text-indigo-400" : "text-amber-400"
                    )}>{signal.qualityGrade} ({signal.confidenceScore}%)</p>
                </div>
                <div>
                    <p className="text-gray-500 text-[10px] uppercase text-rose-400">Stop Loss</p>
                    <p className="text-gray-300">{signal.stopLoss.toFixed(5)}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-[10px] uppercase text-emerald-400">Take Profit</p>
                    <p className="text-gray-300">{signal.takeProfit.toFixed(5)}</p>
                </div>
            </div>

            <div className="bg-[#131722] rounded-lg p-3 pt-2 mb-3">
                <p className="text-[10px] text-gray-500 uppercase mb-2">Confluence Factors</p>
                <div className="flex flex-wrap gap-1.5">
                    {signal.factors.map(f => (
                        <span key={f.name} className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 border border-gray-700">
                            {f.name} <span className="text-indigo-400">+{f.score}</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                <div className="flex items-center text-xs text-gray-400 font-mono">
                    <Target className="w-3.5 h-3.5 mr-1" />
                    RR {signal.riskReward}
                </div>
                <div className={cn(
                    "flex items-center font-mono text-sm tracking-widest",
                    remainingMs > 0 ? "text-amber-400" : "text-gray-500"
                )}>
                    <Clock className="w-4 h-4 mr-1.5" />
                    {m}:{s}
                </div>
            </div>
        </div>
    );
}
