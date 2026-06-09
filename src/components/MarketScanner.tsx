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
        if (score >= 80) return 'text-emerald-400 bg-emerald-400/10';
        if (score >= 60) return 'text-indigo-400 bg-indigo-400/10';
        if (score >= 40) return 'text-amber-400 bg-amber-400/10';
        return 'text-rose-400 bg-rose-400/10';
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'UP') return <ArrowUp className="w-3 h-3 text-emerald-400 mr-1" />;
        if (trend === 'DOWN') return <ArrowDown className="w-3 h-3 text-rose-400 mr-1" />;
        return <Minus className="w-3 h-3 text-gray-500 mr-1" />;
    };

    return (
        <div className="h-full flex flex-col bg-[#1e222d] rounded-xl border border-gray-800 min-h-[500px]">
            <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-100 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-indigo-400" /> Market Scanner
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time pair ranking and structural analysis</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex bg-[#131722] p-1 rounded-lg shrink-0">
                        <button 
                            className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex-1 sm:flex-none", view === 'AI' ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-gray-200")}
                            onClick={() => setView('AI')}
                        >
                            AI Scanner
                        </button>
                        <button 
                            className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex-1 sm:flex-none", view === 'LIVE' ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-gray-200")}
                            onClick={() => setView('LIVE')}
                        >
                            Live Rates
                        </button>
                    </div>
                    {view === 'AI' && (
                        <input 
                            type="text"
                            placeholder="Filter pairs..."
                            className="bg-[#131722] border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar relative">
                {view === 'LIVE' ? (
                    <div className="absolute inset-0 h-full w-full min-h-[500px]">
                        <ForexCrossRates />
                    </div>
                ) : (
                <>
                {/* Desktop Table View */}
                <table className="hidden md:table w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-[#1e222d] shadow-sm z-10">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-800">
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('symbol')}>Pair</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('category')}>Category</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('price')}>Price</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('spread')}>Spread (Pips)</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('volatility')}>Volatility</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('trend')}>Trend</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300" onClick={() => handleSort('signalQuality')}>Quality</th>
                            <th className="p-4 cursor-pointer hover:text-gray-300 text-right" onClick={() => handleSort('rankingScore')}>Ranking Score</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-mono align-middle">
                        {displayPairs.map((pair, i) => (
                            <tr key={pair.symbol} className="border-b border-gray-800/50 hover:bg-[#131722] transition-colors">
                                <td className="p-4 font-bold text-gray-200">{pair.symbol}</td>
                                <td className="p-4 text-gray-500 text-xs">{pair.category}</td>
                                <td className="p-4 text-gray-300">{pair.price.toFixed(5)}</td>
                                <td className="p-4 text-gray-400">{pair.spread.toFixed(1)}</td>
                                <td className="p-4">
                                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${pair.volatility}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1 block">{pair.volatility.toFixed(0)}</span>
                                </td>
                                <td className="p-4 flex items-center">
                                    {getTrendIcon(pair.trend)}
                                    <span className={cn(
                                        "text-xs",
                                        pair.trend === 'UP' ? 'text-emerald-400' : pair.trend === 'DOWN' ? 'text-rose-400' : 'text-gray-400'
                                    )}>{pair.trend}</span>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-xs font-bold",
                                        pair.signalQuality.includes('A') ? 'bg-indigo-500/20 text-indigo-400' : 
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
                        <div key={pair.symbol} className="bg-[#131722] p-4 rounded-lg border border-gray-800 font-mono">
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
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Price</span> {pair.price.toFixed(5)}</div>
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Spread</span> {pair.spread.toFixed(1)}</div>
                                <div>
                                    <span className="text-gray-500 block text-xs uppercase mb-1">Trend</span>
                                    <div className="flex items-center">
                                        {getTrendIcon(pair.trend)}
                                        <span className={cn("text-xs", pair.trend === 'UP' ? 'text-emerald-400' : pair.trend === 'DOWN' ? 'text-rose-400' : 'text-gray-400')}>{pair.trend}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs uppercase mb-1">Quality</span>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                        pair.signalQuality.includes('A') ? 'bg-indigo-500/20 text-indigo-400' : 
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
                                <div className="w-full h-1.5 bg-[#1e222d] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full"
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
