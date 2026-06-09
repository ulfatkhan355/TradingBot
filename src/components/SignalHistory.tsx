import React, { useState } from 'react';
import { TradeSignal } from '../types';
import { History, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface SignalHistoryProps {
    history: TradeSignal[];
}

export function SignalHistory({ history }: SignalHistoryProps) {
    const [filter, setFilter] = useState('ALL');

    const filtered = history.filter(s => {
        if (filter === 'ALL') return true;
        return s.status === filter;
    });

    return (
        <div className="h-full flex flex-col bg-[#1e222d] rounded-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-100 flex items-center">
                        <History className="w-5 h-5 mr-2 text-indigo-400" /> Trading History
                    </h2>
                </div>
                <div className="flex space-x-2">
                    {['ALL', 'WON', 'LOST', 'TIE'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1 rounded text-xs font-semibold tracking-wider transition-colors",
                                filter === f 
                                ? "bg-indigo-500 text-white" 
                                : "bg-[#131722] text-gray-400 hover:text-gray-200"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                {/* Desktop Table View */}
                <table className="hidden md:table w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#1e222d] shadow-sm z-10">
                        <tr className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-800">
                            <th className="p-4">Entry Time</th>
                            <th className="p-4">Pair</th>
                            <th className="p-4">Direction</th>
                            <th className="p-4">Target Entry</th>
                            <th className="p-4">Expiry Time</th>
                            <th className="p-4">Quality</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4 text-right">Result PnL</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-mono align-middle">
                        {filtered.map(signal => {
                            const isCall = signal.direction === 'CALL';
                            const won = signal.status === 'WON';
                            const tie = signal.status === 'TIE';
                            return (
                                <tr key={signal.id} className="border-b border-gray-800/50 hover:bg-[#131722] transition-colors">
                                    <td className="p-4 text-gray-400 text-xs">
                                        {format(new Date(signal.entryTime), 'MMM dd, HH:mm:ss')}
                                    </td>
                                    <td className="p-4 font-bold text-gray-200">{signal.pair}</td>
                                    <td className="p-4">
                                        <div className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                                            isCall ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                                        )}>
                                            {isCall ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                            {signal.direction}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300">{signal.entryPrice.toFixed(5)}</td>
                                    <td className="p-4 text-gray-400 text-xs shadow-sm">
                                        {format(new Date(signal.expiryTime), 'HH:mm:ss')}
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs font-bold text-indigo-400">{signal.qualityGrade}</span>
                                        <span className="text-gray-500 text-[10px] ml-1">{signal.confidenceScore}%</span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-xs">{signal.timeframe}</td>
                                    <td className="p-4 text-right">
                                        <div className={cn(
                                            "font-bold",
                                            won ? "text-emerald-400" : tie ? "text-gray-400" : "text-rose-400"
                                        )}>
                                            {won ? '+' : ''}{signal.profitAmount?.toFixed(2)}
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase mt-0.5">
                                            {signal.status}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* Mobile Cards View */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {filtered.map(signal => {
                        const isCall = signal.direction === 'CALL';
                        const won = signal.status === 'WON';
                        const tie = signal.status === 'TIE';
                        return (
                            <div key={signal.id} className="bg-[#131722] p-4 rounded-lg border border-gray-800 font-mono">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-bold text-gray-100 text-base mb-1">{signal.pair}</div>
                                        <div className="text-xs text-gray-500">{format(new Date(signal.entryTime), 'MMM dd, HH:mm:ss')}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "font-bold text-lg",
                                            won ? "text-emerald-400" : tie ? "text-gray-400" : "text-rose-400"
                                        )}>
                                            {won ? '+' : ''}{signal.profitAmount?.toFixed(2)}
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase mt-0.5">{signal.status}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-400 mb-3">
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase mb-1">Direction</span>
                                        <div className={cn(
                                            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider",
                                            isCall ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                                        )}>
                                            {isCall ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                            {signal.direction}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase mb-1">Quality</span>
                                        <span className="text-xs font-bold text-indigo-400">{signal.qualityGrade}</span>
                                        <span className="text-gray-500 text-[10px] ml-1">{signal.confidenceScore}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase mb-1">Target Entry</span>
                                        <span className="text-gray-200">{signal.entryPrice.toFixed(5)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase mb-1">Expiry ({signal.timeframe})</span>
                                        <span className="text-gray-300">{format(new Date(signal.expiryTime), 'HH:mm:ss')}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
