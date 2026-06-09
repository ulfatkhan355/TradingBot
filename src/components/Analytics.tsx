import React from 'react';
import { BacktestAnalytics } from '../types';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
    LineChart, Line, CartesianGrid, AreaChart, Area, Cell
} from 'recharts';

interface AnalyticsProps {
    analytics: BacktestAnalytics;
}

export function Analytics({ analytics }: AnalyticsProps) {

    const equityData = Array.from({ length: 12 }).map((_, i) => ({
        month: `M${i+1}`,
        equity: 10000 + (i * analytics.monthlyReturns * 100) + (Math.random() * 500 - 250)
    }));

    const sessionData = [
        { name: 'London', pnl: 4500 },
        { name: 'New York', pnl: 3200 },
        { name: 'Tokyo', pnl: -800 },
        { name: 'Sydney', pnl: -200 },
    ];

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-6">
            
            <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-100">Backtest: {analytics.pair}</h2>
                    <span className="px-3 py-1 bg-[#131722] text-gray-300 rounded-lg text-sm font-mono border border-gray-700">
                        {analytics.timeframe} Base Timeframe
                    </span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <StatBox label="Total Trades" value={analytics.totalTrades.toString()} />
                    <StatBox label="ITM Rate" value={`${analytics.itmRate.toFixed(1)}%`} color="text-indigo-400" />
                    <StatBox label="Win Rate" value={`${analytics.winRate.toFixed(1)}%`} color="text-emerald-400" />
                    <StatBox label="Average Payout" value={`${analytics.averagePayout}%`} color="text-emerald-400" />
                    <StatBox label="Max Drawdown" value={`${analytics.maxDrawdown.toFixed(1)}%`} color="text-rose-400" />
                    <StatBox label="Sharpe Ratio" value={analytics.sharpeRatio.toFixed(2)} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equity Curve */}
                <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-6 h-[350px] flex flex-col">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Projected Equity Curve</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={equityData}>
                                <defs>
                                    <linearGradient id="colorEq" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#131722', border: '1px solid #374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Area type="monotone" dataKey="equity" stroke="#6366f1" fillOpacity={1} fill="url(#colorEq)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Session Performance */}
                <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-6 h-[350px] flex flex-col">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">PnL by Session</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sessionData}>
                                <XAxis dataKey="name" stroke="#4b5563" fontSize={11} />
                                <YAxis stroke="#4b5563" fontSize={10} tickFormatter={(v) => `$${v}`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#131722', border: '1px solid #374151', borderRadius: '8px' }}
                                    cursor={{fill: '#374151', opacity: 0.2}}
                                />
                                <Bar dataKey="pnl" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32}>
                                    {
                                        sessionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#f43f5e'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                 <div className="bg-[#1e222d] border border-gray-800 rounded-xl p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">Additional Metrics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span className="text-gray-400 text-sm">Winning Trades</span>
                            <span className="text-emerald-400 font-mono">{analytics.winningTrades}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span className="text-gray-400 text-sm">Losing Trades</span>
                            <span className="text-rose-400 font-mono">{analytics.losingTrades}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span className="text-gray-400 text-sm">Tie Trades</span>
                            <span className="text-gray-400 font-mono">{analytics.tieTrades}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span className="text-gray-400 text-sm">Recovery Factor</span>
                            <span className="text-gray-200 font-mono">{analytics.recoveryFactor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="text-gray-400 text-sm">Yearly Projected Return</span>
                            <span className="text-indigo-400 font-mono font-bold">+{analytics.yearlyReturns.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatBox({ label, value, color = "text-gray-200" }: { label: string, value: string, color?: string }) {
    return (
        <div className="bg-[#131722] p-4 rounded-lg border border-gray-800/50">
            <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider mb-1">{label}</p>
            <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
        </div>
    )
}
