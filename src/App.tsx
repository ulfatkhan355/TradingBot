import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { MarketScanner } from './components/MarketScanner';
import { Analytics } from './components/Analytics';
import { SignalHistory } from './components/SignalHistory';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { TickerTape } from './components/TickerTape';
import { 
    generatePairsData, 
    generateActiveSignals, 
    generateBacktestAnalytics, 
    generateSignalHistory,
    SESSIONS
} from './data';

export default function App() {
    const [timeframe, setTimeframe] = useState<'1m'|'5m'|'15m'>('5m');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pairs, setPairs] = useState(generatePairsData());
    const [signals, setSignals] = useState(generateActiveSignals(pairs, timeframe));
    const [history, setHistory] = useState(generateSignalHistory(500, timeframe));
    const [analytics, setAnalytics] = useState(generateBacktestAnalytics('EURUSD', timeframe));

    // Update data when timeframe changes
    useEffect(() => {
        setSignals(generateActiveSignals(pairs, timeframe));
        setHistory(generateSignalHistory(500, timeframe));
        setAnalytics(generateBacktestAnalytics('EURUSD', timeframe));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeframe]);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setPairs(prev => {
                return prev.map(p => ({
                    ...p,
                    price: p.price * (1 + (Math.random() * 0.0002 - 0.0001))
                }));
            });
            // Every so often, re-roll the signals
            if (Math.random() > 0.8) {
                setSignals(s => generateActiveSignals(pairs, timeframe));
            }
        }, 1000); // Check every second for countdowns
        return () => clearInterval(interval);
    }, [pairs, timeframe]);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard signals={signals} pairs={pairs} sessions={SESSIONS} />;
            case 'scanner':
                return <MarketScanner pairs={pairs} />;
            case 'analytics':
                return <Analytics analytics={analytics} />;
            case 'history':
                return <SignalHistory history={history} />;
            case 'settings':
                return <Settings timeframe={timeframe} setTimeframe={setTimeframe} />;
            default:
                return <Dashboard signals={signals} pairs={pairs} sessions={SESSIONS} />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-[#131722] text-gray-200 h-screen overflow-hidden font-sans selection:bg-indigo-500/30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <Topbar />
                <TickerTape />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto mb-16 md:mb-0 pb-20 md:pb-6 custom-scrollbar">
                    {renderContent()}
                </main>
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
