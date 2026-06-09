import React, { useState } from 'react';
import { PairStat } from '../types';
import { cn } from '../lib/utils';
import { ArrowUp, ArrowDown, Activity, Minus } from 'lucide-react';

interface MarketScannerProps {
    pairs: PairStat[];
}

export function MarketScanner({ pairs }: MarketScannerProps) {
    const [sortCol, setSortCol] = useState<keyof PairStat>('rankingScore');
    const [sortAsc, setSortAsc] = useState(false);
    const [filter, setFilter] = useState('');

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
        <div className="h-full flex flex-col bg-[#1e222d] rounded-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-100 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-indigo-400" /> Market Scanner
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time pair ranking and structural analysis</p>
                </div>
                <div>
                    <input 
                        type="text"
                        placeholder="Filter EXOTICS, EURUSD..."
                        className="bg-[#131722] border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 w-64"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
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
            </div>
        </div>
    );
}
