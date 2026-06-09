import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { MarketScanner } from './components/MarketScanner';
import { Analytics } from './components/Analytics';
import { SignalHistory } from './components/SignalHistory';
import { Settings } from './components/Settings';
import { 
    generatePairsData, 
    generateActiveSignals, 
    generateBacktestAnalytics, 
    generateSignalHistory,
    SESSIONS
} from './data';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pairs, setPairs] = useState(generatePairsData());
    const [signals, setSignals] = useState(generateActiveSignals(pairs));
    const [history] = useState(generateSignalHistory(500));
    const [analytics] = useState(generateBacktestAnalytics('EURUSD'));

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setPairs(prev => {
                return prev.map(p => ({
                    ...p,
                    price: p.price * (1 + (Math.random() * 0.0002 - 0.0001))
                }));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
                return <Settings />;
            default:
                return <Dashboard signals={signals} pairs={pairs} sessions={SESSIONS} />;
        }
    };

    return (
        <div className="flex bg-[#131722] text-gray-200 h-screen overflow-hidden font-sans selection:bg-indigo-500/30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />
                <main className="flex-1 p-4 md:p-6 overflow-hidden">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

