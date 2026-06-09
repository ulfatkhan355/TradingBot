import React, { useState } from 'react';
import { PairStat } from '../types';
import { cn } from '../lib/utils';
import { ArrowUp, ArrowDown, Activity, Minus } from 'lucide-react';
import { ForexCrossRates } from './ForexCrossRates';

interface MarketScannerProps {
    pairs: PairStat[];
}

export function MarketScanner({ pairs }: MarketScannerProps) {
    const [sortCol, setSortCol] = useState<keyof PairStat>('rankingScore');
    const [sortAsc, setSortAsc] = useState(false);
    const [filter, setFilter] = useState('');
    const [view, setView] = useState<'AI' | 'LIVE'>('AI');

    const handleSort = (col: keyof PairStat) => {
        if (sortCol === col) setSortAsc(!sortAsc);
        else { setSortCol(col); setSortAsc(false); }
    };

    const displayPairs = [...pairs]
        .filter(p => filter === '' || p.symbol.toLowerCase().includes(filter.toLowerCase()) || p.category.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
            let va = a[sortCol];
            let vb = b[sortCol];
            if (typeof va === 'string' && typeof vb === 'string') {
                return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
            }
            if (typeof va === 'number' && typeof vb === 'number') {
                return sortAsc ? va - vb : vb - va;
            }
            return 0;
        });

    const getRankColor = (score: number) => {
        if (score >= 80) return 'text-qx-green bg-qx-green/10';
        if (score >= 60) return 'text-qx-blue bg-qx-blue/10';
        if (score >= 40) return 'text-amber-400 bg-amber-400/10';
        return 'text-qx-red bg-qx-red/10';
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'UP') return <ArrowUp className="w-3 h-3 text-qx-green mr-1" />;
        if (trend === 'DOWN') return <ArrowDown className="w-3 h-3 text-qx-red mr-1" />;
        return <Minus className="w-3 h-3 text-gray-500 mr-1" />;
    };

    return (
        <div className="h-full flex flex-col bg-qx-card rounded-xl border border-qx-border min-h-[500px]">
            <div className="p-4 border-b border-qx-border flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-100 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-qx-blue" /> Market Scanner
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time pair ranking and structural analysis</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex bg-qx-bg p-1 rounded-lg shrink-0">
                        <button 
                            className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex-1 sm:flex-none", view === 'AI' ? "bg-qx-blue text-white" : "text-gray-400 hover:text-gray-200")}
                            onClick={() => setView('AI')}
                        >
                            AI Scanner
                        </button>
                        <button 
                            className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex-1 sm:flex-none", view === 'LIVE' ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200")}
                            onClick={() => setView('LIVE')}
                        >
                            Live Rates
                        </button>
                    </div>
                    {view === 'AI' && (
                        <input 
                            type="text"
                            placeholder="Filter pairs..."
                            className="bg-qx-bg border border-qx-border rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-qx-blue w-full sm:w-48"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    )}
                </div>
            </div>

            {view === 'AI' && (
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 p-4 border-b border-qx-border shrink-0 bg-qx-bg">
                    <div className="bg-qx-card rounded-md p-3 border border-qx-border">
                        <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Global Trend</p>
                        <div className="flex items-center"><ArrowUp className="w-3 h-3 text-qx-green mr-1" /><span className="text-sm font-mono text-qx-green font-bold">BULLISH</span></div>
                    </div>
                    <div className="bg-qx-card rounded-md p-3 border border-qx-border">
                        <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Avg RSI</p>
                        <p className="text-sm font-mono text-gray-200 font-bold">58.4 <span className="text-gray-500 font-sans text-xs font-normal">Neutral</span></p>
                    </div>
                    <div className="bg-qx-card rounded-md p-3 border border-qx-border">
                        <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Volatility Focus</p>
                        <p className="text-sm font-mono text-qx-red font-bold">HIGH</p>
                    </div>
                    <div className="bg-qx-card rounded-md p-3 border border-qx-border">
                        <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Volume Proxy</p>
                        <p className="text-sm font-mono text-gray-200 font-bold">2.4M/tick</p>
                    </div>
                    <div className="bg-qx-card rounded-md p-3 border border-qx-border">
                        <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Session Bias</p>
                        <p className="text-sm font-mono text-qx-blue font-bold">LONDON OPEN</p>
                    </div>
                    <div className="bg-qx-card rounded-md p-3 border border-qx-border">
                        <p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Market State</p>
                        <p className="text-sm font-mono text-qx-green font-bold text-center bg-qx-green/10 rounded-sm py-0.5">OPTIMAL</p>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-auto custom-scrollbar relative">
                {view === 'LIVE' ? (
                    <div className="absolute inset-0 h-full w-full min-h-[500px]">
                        <ForexCrossRates />
                    </div>
                ) : (
                <>
                {/* Desktop Table View */}
                <table className="hidden md:table w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-qx-card shadow-sm z-10">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-qx-border">
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('symbol')}>Pair</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('category')}>Category</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300 text-center" onClick={() => handleSort('winRate')}>Win Rate</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300 text-center" onClick={() => handleSort('drawdown')}>Drawdown</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('volatility')}>Volatility</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('trend')}>Trend</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('signalQuality')}>Quality</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300 text-right" onClick={() => handleSort('rankingScore')}>Ranking Score</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-mono align-middle">
                        {displayPairs.map((pair, i) => (
                            <tr key={pair.symbol} className="border-b border-qx-border/50 hover:bg-qx-bg transition-colors">
                                <td className="p-4 font-bold text-gray-200">{pair.symbol}</td>
                                <td className="p-4 text-gray-500 text-xs">{pair.category}</td>
                                <td className="p-4 text-center text-qx-green font-bold">{pair.winRate.toFixed(1)}%</td>
                                <td className="p-4 text-center text-qx-red">{pair.drawdown.toFixed(1)}%</td>
                                <td className="p-4">
                                    <div className="w-16 lg:w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-qx-blue rounded-full"
                                            style={{ width: `${pair.volatility}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1 block">{pair.volatility.toFixed(0)}</span>
                                </td>
                                <td className="p-4 flex items-center mt-2">
                                    {getTrendIcon(pair.trend)}
                                    <span className={cn(
                                        "text-xs",
                                        pair.trend === 'UP' ? 'text-qx-green' : pair.trend === 'DOWN' ? 'text-qx-red' : 'text-gray-400'
                                    )}>{pair.trend}</span>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-xs font-bold",
                                        pair.signalQuality.includes('A') ? 'bg-qx-blue/20 text-qx-blue' : 
                                        pair.signalQuality.includes('B') ? 'bg-amber-500/20 text-amber-400' : 
                                        'bg-gray-800 text-gray-500'
                                    )}>
                                        {pair.signalQuality}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <span className={cn("px-2 py-1 rounded font-bold", getRankColor(pair.rankingScore))}>
                                        {pair.rankingScore.toFixed(0)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Mobile Cards View */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {displayPairs.map((pair) => (
                        <div key={pair.symbol} className="bg-qx-bg p-4 rounded-lg border border-qx-border font-mono shadow-md">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <div className="font-bold text-gray-100 text-base">{pair.symbol}</div>
                                    <div className="text-xs text-gray-500">{pair.category}</div>
                                </div>
                                <span className={cn("px-2 py-1 rounded text-xs font-bold", getRankColor(pair.rankingScore))}>
                                    Sc: {pair.rankingScore.toFixed(0)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400 mb-4">
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Win Rate</span> <span className="text-qx-green font-bold">{pair.winRate.toFixed(1)}%</span></div>
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Drawdown</span> <span className="text-qx-red font-bold">{pair.drawdown.toFixed(1)}%</span></div>
                                <div>
                                    <span className="text-gray-500 block text-xs uppercase mb-1">Trend</span>
                                    <div className="flex items-center">
                                        {getTrendIcon(pair.trend)}
                                        <span className={cn("text-xs", pair.trend === 'UP' ? 'text-qx-green' : pair.trend === 'DOWN' ? 'text-qx-red' : 'text-gray-400')}>{pair.trend}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs uppercase mb-1">Quality</span>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                        pair.signalQuality.includes('A') ? 'bg-qx-blue/20 text-qx-blue' : 
                                        pair.signalQuality.includes('B') ? 'bg-amber-500/20 text-amber-400' : 
                                        'bg-gray-800 text-gray-500'
                                    )}>
                                        {pair.signalQuality}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span className="uppercase text-[10px]">Volatility</span>
                                    <span>{pair.volatility.toFixed(0)}</span>
                                </div>
                                <div className="w-full h-1.5 bg-qx-card rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-qx-blue rounded-full"
                                        style={{ width: `${pair.volatility}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </>
                )}
            </div>
        </div>
    );
}
