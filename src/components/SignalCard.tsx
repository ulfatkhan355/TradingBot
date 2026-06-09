import React, { useEffect, useState } from 'react';
import { TradeSignal } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export const SignalCard: React.FC<{ signal: TradeSignal }> = ({ signal }) => {
    const isCall = signal.direction === 'CALL';
    const [, setTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const now = Date.now();
    const entryTime = new Date(signal.entryTime).getTime();
    const expiryTime = new Date(signal.expiryTime).getTime();
    
    let countdownTitle = "";
    let remainingMs = 0;
    
    if (signal.status === 'PRE_ALERT' || now < entryTime) {
        countdownTitle = "Countdown:";
        remainingMs = Math.max(0, entryTime - now);
    } else if (signal.status === 'ACTIVE' || (now >= entryTime && now < expiryTime)) {
        countdownTitle = "Expiry in:";
        remainingMs = Math.max(0, expiryTime - now);
    } else {
        countdownTitle = "Expired:";
        remainingMs = 0;
    }

    const m = Math.floor(remainingMs / 60000).toString().padStart(2, '0');
    const s = Math.floor((remainingMs % 60000) / 1000).toString().padStart(2, '0');

    // Generate progress bar for signal strength (10 blocks)
    const strengthBlocks = Math.max(0, Math.min(10, Math.round(signal.signalStrength / 10)));
    const strengthStr = '█'.repeat(strengthBlocks) + '░'.repeat(10 - strengthBlocks);

    return (
        <div className={cn(
            "bg-qx-card rounded-xl border p-4 transition-colors relative overflow-hidden font-mono text-sm leading-relaxed",
            signal.status === 'PRE_ALERT' ? "border-qx-blue/50 shadow-[0_0_15px_rgba(77,166,255,0.1)]" : "border-qx-border hover:border-gray-700"
        )}>
            {signal.status === 'PRE_ALERT' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-qx-blue animate-[pulse_1s_ease-in-out_infinite]" />
            )}
            
            <div className="flex flex-col space-y-1.5 text-gray-300">
                <div className="text-gray-100 font-bold text-base">Signal: {signal.pair}</div>
                <div className={cn("font-bold flex items-center text-base tracking-wider", isCall ? "text-emerald-400" : "text-rose-400")}>
                    {isCall ? "🟢 CALL" : "🔴 PUT"}
                </div>
                <div className="pt-2">Confidence: <span className="text-gray-100">{signal.confidenceScore}%</span></div>
                <div>Entry Time: <span className="text-gray-100">{format(entryTime, 'HH:mm:ss')}</span></div>
                <div>Expiry: <span className="text-gray-100">{format(expiryTime, 'HH:mm:ss')}</span></div>
                <div>{countdownTitle} <span className={cn(
                    "font-bold",
                    signal.status === 'PRE_ALERT' ? "text-amber-400" : remainingMs > 0 ? "text-blue-400" : "text-gray-500"
                )}>{m}:{s}</span></div>
                <div className="pt-2 flex items-center flex-wrap">
                    <span className="mr-2">Signal Strength:</span> 
                    <span className={cn("tracking-widest", signal.signalStrength >= 90 ? "text-emerald-400" : "text-indigo-400")}>{strengthStr}</span>
                </div>
            </div>
        </div>
    );
}
