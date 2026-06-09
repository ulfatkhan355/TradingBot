import React from 'react';
import { TradingViewChart } from './TradingViewChart';
import { SignalCard } from './SignalCard';
import { TradeSignal, PairStat, MarketSession } from '../types';
import { Activity, Target, Trophy, Percent, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
    signals: TradeSignal[];
    pairs: PairStat[];
    sessions: MarketSession[];
}

export function Dashboard({ signals, pairs, sessions }: DashboardProps) {
    const liveSignals = signals.filter(s => s.status === 'PRE_ALERT' || s.status === 'ACTIVE');
    
    return (
        <div className="h-full flex flex-col xl:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                    <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Activity className="w-4 h-4 mr-2 text-indigo-400" /> Active Signals
                        </div>
                        <div className="text-2xl font-mono text-gray-100">{liveSignals.length}</div>
                    </div>
                    <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Target className="w-4 h-4 mr-2 text-emerald-400" /> Avg ITM Rate
                        </div>
                        <div className="text-2xl font-mono text-gray-100">62.8%</div>
                    </div>
                    <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Trophy className="w-4 h-4 mr-2 text-amber-400" /> Avg Payout
                        </div>
                        <div className="text-2xl font-mono text-gray-100">85%</div>
                    </div>
                    <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Percent className="w-4 h-4 mr-2 text-rose-400" /> Market Volatility
                        </div>
                        <div className="text-2xl font-mono text-gray-100">82.1 <span className="text-sm text-gray-500">ATR</span></div>
                    </div>
                </div>

                {/* Main Chart Area */}
                <div className="flex-1 min-h-[400px] flex flex-col bg-[#1e222d] rounded-xl border border-gray-800 p-1">
                    <div className="h-12 px-4 flex items-center justify-between border-b border-gray-800 mb-1">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-semibold text-gray-200 text-sm">Live Terminal</span>
                        </div>
                    </div>
                    <div className="flex-1 rounded-b-lg overflow-hidden">
                        <TradingViewChart symbol={liveSignals.length > 0 ? `FX:${liveSignals[0].pair}` : "FX:EURUSD"} />
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Signals & Actions */}
            <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
                
                {/* Active Sessions */}
                <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Market Sessions</h3>
                    <div className="space-y-3">
                        {sessions.map(s => (
                            <div key={s.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={cn("w-2 h-2 rounded-full mr-3", s.open ? s.color : "bg-gray-700")} />
                                    <span className="text-sm font-medium text-gray-300">{s.name}</span>
                                </div>
                                <span className="text-xs font-mono text-gray-500">{s.open ? "OPEN" : "CLOSED"}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Signals Feed */}
                <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-4 flex-1 flex flex-col min-h-[500px] lg:max-h-[600px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" /> Live Opportunities
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">REALTIME</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-2">
                        {liveSignals.length > 0 ? (
                            liveSignals.map(sig => (
                                <SignalCard key={sig.id} signal={sig} />
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm pb-10">
                                Waiting for next high-quality setup...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
