import React from 'react';
import { SignalCard } from './SignalCard';
import { TradeSignal, PairStat, MarketSession } from '../types';
import { Activity, Target, Trophy, Percent, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatedCounter } from './AnimatedCounter';

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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                    <div className="bg-qx-card border border-qx-border rounded-xl p-4 shadow-md">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Activity className="w-4 h-4 mr-2 text-qx-blue" /> Active Signals
                        </div>
                        <div className="text-2xl font-mono text-gray-100">
                            <AnimatedCounter value={liveSignals.length} />
                        </div>
                    </div>
                    <div className="bg-qx-card border border-qx-border rounded-xl p-4 shadow-md">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Target className="w-4 h-4 mr-2 text-qx-green" /> Avg ITM Rate
                        </div>
                        <div className="text-2xl font-mono text-gray-100">
                            <AnimatedCounter value={82.8} decimals={1} suffix="%" />
                        </div>
                    </div>
                    <div className="bg-qx-card border border-qx-border rounded-xl p-4 shadow-md">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Trophy className="w-4 h-4 mr-2 text-amber-500" /> Avg Payout
                        </div>
                        <div className="text-2xl font-mono text-gray-100">
                            <AnimatedCounter value={85} suffix="%" />
                        </div>
                    </div>
                    <div className="bg-qx-card border border-qx-border rounded-xl p-4 shadow-md">
                        <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Percent className="w-4 h-4 mr-2 text-qx-red" /> Market Volatility
                        </div>
                        <div className="text-2xl font-mono text-gray-100">High <span className="text-sm text-gray-500 font-sans">Level</span></div>
                    </div>
                </div>

                {/* Main Signals Area Replacing Chart */}
                <div className="flex-1 min-h-[400px] flex flex-col bg-qx-card rounded-xl border border-qx-border p-4 shadow-md">
                    <div className="flex items-center justify-between border-b border-qx-border pb-4 mb-4 shrink-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-qx-green animate-pulse" />
                            <h3 className="font-semibold text-gray-200 text-sm tracking-wide flex items-center">
                                <TrendingUp className="w-4 h-4 text-qx-blue mr-2" /> Live Engine Signals
                            </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-qx-blue/20 text-qx-blue animate-pulse w-auto">AUTO-SYNC (demo)</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-2">
                        {liveSignals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {liveSignals.map(sig => (
                                    <SignalCard key={sig.id} signal={sig} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm pb-10">
                                Waiting for next signal (30-60s)...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-6">
                
                {/* Active Sessions */}
                <div className="bg-qx-card border border-qx-border rounded-xl p-4 shadow-md">
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

                <div className="bg-qx-card border border-qx-border rounded-xl p-4 flex-1 flex flex-col shadow-md">
                     <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Top Expected Pairs</h3>
                     <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                         {pairs.slice(0, 5).map(pair => (
                             <div key={pair.symbol} className="flex items-center justify-between p-3 bg-qx-bg rounded-lg border border-qx-border/50">
                                 <div>
                                     <div className="font-bold text-gray-200">{pair.symbol}</div>
                                     <div className="text-[10px] text-gray-500 uppercase">{pair.category}</div>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-qx-green font-bold text-sm">{pair.winRate.toFixed(1)}% WR</div>
                                     <div className="text-[10px] text-qx-blue font-bold tracking-wider">{pair.signalQuality} RANK</div>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
}
