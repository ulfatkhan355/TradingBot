import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { MarketScanner } from './components/MarketScanner';
import { Analytics } from './components/Analytics';
import { SignalHistory } from './components/SignalHistory';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { TickerTape } from './components/TickerTape';
import { Footer } from './components/Footer';
import { useLiveMarketData } from './hooks/useLiveMarketData';
import { 
    generatePairsData, 
    generateActiveSignals, 
    generateBacktestAnalytics, 
    generateSignalHistory,
    SESSIONS
} from './data';
import { TradeSignal } from './types';

// Simple beep sound for notifications
const playBeep = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx. destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 880; // A5
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
};

export interface AppSettings {
    theme: 'Dark' | 'Light';
    signalSound: boolean;
    notifications: boolean;
    timeFormat: '12 Hour' | '24 Hour';
    timeZone: 'Local' | 'UTC' | 'Pakistan' | 'London' | 'New York' | 'Tokyo';
}

const DEFAULT_SETTINGS: AppSettings = {
    theme: 'Dark',
    signalSound: true,
    notifications: true,
    timeFormat: '24 Hour',
    timeZone: 'Pakistan'
};

export default function App() {
    const [timeframe, setTimeframe] = useState<'1m'|'5m'|'15m'>('5m');
    const [activeTab, setActiveTab] = useState('dashboard');
    const initialPairs = useMemo(() => generatePairsData(), []);
    const { pairs } = useLiveMarketData(initialPairs);
    const [signals, setSignals] = useState<TradeSignal[]>([]);
    const [history, setHistory] = useState(generateSignalHistory(50, timeframe));
    const [analytics, setAnalytics] = useState(generateBacktestAnalytics('EURUSD', timeframe));
    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem('qx_settings');
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });
    const [toast, setToast] = useState<{show: boolean; signal?: TradeSignal | null}>({ show: false, signal: null });

    useEffect(() => {
        localStorage.setItem('qx_settings', JSON.stringify(settings));
    }, [settings]);

    // Signal Generator Engine
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const scheduleNextSignal = () => {
            const nextDelay = Math.random() * 30000 + 30000; // 30-60s
            timeoutId = setTimeout(() => {
                const newSignals = generateActiveSignals(pairs, timeframe);
                setSignals(newSignals);
                
                // Show notification
                if (settings.notifications && newSignals.length > 0) {
                    setToast({ show: true, signal: newSignals[0] });
                    setTimeout(() => setToast({ show: false, signal: null }), 5000);
                    if (settings.signalSound) playBeep();
                }

                // Auto-add to history after expiry for demo purposes
                // Here we just prepend it immediately for demo history sync
                scheduleNextSignal();
            }, nextDelay);
        };
        scheduleNextSignal();
        return () => clearTimeout(timeoutId);
    }, [pairs, timeframe, settings]);

    // Simulate real-time signal status updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Update active signal remaining times, if it's past entryTime set to ACTIVE
            setSignals(currentSignals => {
                const now = Date.now();
                let changed = false;
                const updated = currentSignals.map(s => {
                    if (s.status === 'PRE_ALERT' && now >= new Date(s.entryTime).getTime()) {
                        changed = true;
                        return { ...s, status: 'ACTIVE' as const };
                    }
                    if (s.status === 'ACTIVE' && now >= new Date(s.expiryTime).getTime()) {
                        changed = true;
                        // Move to history
                        const w = Math.random() > 0.45;
                        const finalSignal = { ...s, status: w ? 'WON' as const : 'LOST' as const };
                        setHistory(h => [finalSignal, ...h].slice(0, 50));
                        return finalSignal;
                    }
                    return s;
                });
                return changed ? updated.filter(s => s.status === 'PRE_ALERT' || s.status === 'ACTIVE') : currentSignals;
            });
        }, 1000);
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
                return <Settings timeframe={timeframe} setTimeframe={setTimeframe} settings={settings} setSettings={setSettings} />;
            default:
                return <Dashboard signals={signals} pairs={pairs} sessions={SESSIONS} />;
        }
    };

    return (
        <div className={`flex flex-col md:flex-row h-screen overflow-hidden font-sans selection:bg-qx-blue/30 ${settings.theme === 'Dark' ? 'bg-qx-bg text-qx-text' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <Topbar settings={settings} />
                <TickerTape />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto mb-16 md:mb-0 pb-20 md:pb-6 custom-scrollbar">
                    {renderContent()}
                </main>
                <div className="hidden md:block">
                    <Footer 
                        lastSignalTime={signals.length > 0 ? signals[0].entryTime : undefined} 
                        isDemo={true} 
                    />
                </div>
            </div>
            <div className="md:hidden">
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            {/* Toast Notification */}
            <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                {toast.signal && (
                    <div className="bg-qx-card border border-qx-border shadow-2xl rounded-xl p-4 min-w-[280px]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-qx-blue animate-pulse">New Signal</span>
                            <span className="text-xs text-gray-400 font-mono">10s to Entry</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{toast.signal.pair}</div>
                        <div className={`text-lg font-bold ${toast.signal.direction === 'CALL' ? 'text-qx-green' : 'text-qx-red'}`}>
                            {toast.signal.direction === 'CALL' ? '🟢 CALL' : '🔴 PUT'}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">Confidence: <span className="text-white font-bold">{toast.signal.confidenceScore}%</span></div>
                    </div>
                )}
            </div>
        </div>
    );
}
