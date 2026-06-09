import React from 'react';
import { BacktestAnalytics } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface AnalyticsProps {
    analytics: BacktestAnalytics;
}

export function Analytics({ analytics }: AnalyticsProps) {

    const equityDataLabels = Array.from({ length: 12 }).map((_, i) => `M${i+1}`);
    const equityDataPoints = Array.from({ length: 12 }).map((_, i) => 10000 + (i * analytics.monthlyReturns * 100) + (Math.random() * 500 - 250));

    const lineChartData = {
        labels: equityDataLabels,
        datasets: [
            {
                fill: true,
                label: 'Equity Curve',
                data: equityDataPoints,
                borderColor: 'rgb(77, 166, 255)',
                backgroundColor: 'rgba(77, 166, 255, 0.1)',
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { display: false, color: '#30363d' }, ticks: { color: '#8b949e' } },
            y: { grid: { color: '#30363d' }, ticks: { color: '#8b949e' } }
        }
    };

    const sessionData = [
        { name: 'London', pnl: 4500 },
        { name: 'New York', pnl: 3200 },
        { name: 'Tokyo', pnl: -800 },
        { name: 'Sydney', pnl: -200 },
    ];

    const barChartData = {
        labels: sessionData.map(d => d.name),
        datasets: [
            {
                label: 'PnL',
                data: sessionData.map(d => d.pnl),
                backgroundColor: sessionData.map(d => d.pnl >= 0 ? '#00e676' : '#ff5252'),
                borderRadius: 4,
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#8b949e' } },
            y: { grid: { color: '#30363d' }, border: { dash: [4, 4] }, ticks: { color: '#8b949e' } }
        }
    };

    const pieData = {
        labels: ['High (>90%)', 'Medium (80-90%)', 'Low (<80%)'],
        datasets: [
            {
                data: [45, 35, 20],
                backgroundColor: ['#00e676', '#4da6ff', '#ff5252'],
                borderWidth: 0,
            }
        ]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: { color: '#8b949e' }
            }
        },
        cutout: '70%'
    };

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-6">
            
            <div className="bg-qx-card border border-qx-border rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-100">Backtest: {analytics.pair}</h2>
                    <span className="px-3 py-1 bg-qx-bg text-gray-300 rounded-lg text-sm font-mono border border-qx-border">
                        {analytics.timeframe} Base Timeframe
                    </span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <StatBox label="Total Trades" value={<AnimatedCounter value={analytics.totalTrades} />} />
                    <StatBox label="ITM Rate" value={<AnimatedCounter value={analytics.itmRate} decimals={1} suffix="%" />} color="text-qx-blue" />
                    <StatBox label="Win Rate" value={<AnimatedCounter value={analytics.winRate} decimals={1} suffix="%" />} color="text-qx-green" />
                    <StatBox label="Average Payout" value={<AnimatedCounter value={analytics.averagePayout} suffix="%" />} color="text-qx-green" />
                    <StatBox label="Max Drawdown" value={<AnimatedCounter value={analytics.maxDrawdown} decimals={1} suffix="%" />} color="text-qx-red" />
                    <StatBox label="Sharpe Ratio" value={<AnimatedCounter value={analytics.sharpeRatio} decimals={2} />} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equity Curve */}
                <div className="bg-qx-card border border-qx-border rounded-xl p-6 h-[350px] flex flex-col shadow-md md:col-span-2 lg:col-span-1">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Projected Equity Curve</h3>
                    <div className="flex-1 min-h-0">
                        <Line options={lineChartOptions} data={lineChartData} />
                    </div>
                </div>

                {/* Session Performance */}
                <div className="bg-qx-card border border-qx-border rounded-xl p-6 h-[350px] flex flex-col shadow-md">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">PnL by Session</h3>
                    <div className="flex-1 min-h-0">
                        <Bar options={barChartOptions} data={barChartData} />
                    </div>
                </div>

                {/* Confidence Distribution */}
                 <div className="bg-qx-card border border-qx-border rounded-xl p-6 h-[250px] flex flex-col justify-center shadow-md">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Confidence Distribution</h3>
                    <div className="flex-1 min-h-0">
                        <Doughnut options={pieOptions} data={pieData} />
                    </div>
                </div>

                 <div className="bg-qx-card border border-qx-border rounded-xl p-6 flex flex-col justify-center shadow-md">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">Additional Metrics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-qx-border pb-2">
                            <span className="text-gray-400 text-sm">Winning Trades</span>
                            <span className="text-qx-green font-mono"><AnimatedCounter value={analytics.winningTrades} /></span>
                        </div>
                        <div className="flex justify-between items-center border-b border-qx-border pb-2">
                            <span className="text-gray-400 text-sm">Losing Trades</span>
                            <span className="text-qx-red font-mono"><AnimatedCounter value={analytics.losingTrades} /></span>
                        </div>
                        <div className="flex justify-between items-center border-b border-qx-border pb-2">
                            <span className="text-gray-400 text-sm">Tie Trades</span>
                            <span className="text-gray-400 font-mono"><AnimatedCounter value={analytics.tieTrades} /></span>
                        </div>
                        <div className="flex justify-between items-center border-b border-qx-border pb-2">
                            <span className="text-gray-400 text-sm">Recovery Factor</span>
                            <span className="text-gray-200 font-mono"><AnimatedCounter value={analytics.recoveryFactor} decimals={2} /></span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="text-gray-400 text-sm">Yearly Projected Return</span>
                            <span className="text-qx-blue font-mono font-bold">+<AnimatedCounter value={analytics.yearlyReturns} decimals={1} suffix="%" /></span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatBox({ label, value, color = "text-gray-200" }: { label: string, value: React.ReactNode, color?: string }) {
    return (
        <div className="bg-qx-bg p-4 rounded-lg border border-qx-border/50">
            <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider mb-1">{label}</p>
            <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
        </div>
    )
}
