import React from 'react';
import { Activity, Clock3, Wifi } from 'lucide-react';
import { format } from 'date-fns';

interface FooterProps {
    lastSignalTime?: string;
    isDemo: boolean;
}

export function Footer({ lastSignalTime, isDemo }: FooterProps) {
    return (
        <footer className="h-8 bg-qx-card border-t border-qx-border flex items-center justify-between px-4 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-20">
            <div className="flex items-center gap-4">
                <div className="flex items-center text-[10px] uppercase font-semibold text-gray-500">
                    <Wifi className="w-3 h-3 mr-1 text-qx-green animate-pulse" />
                    Data Feed Connected
                </div>
                {lastSignalTime && (
                    <div className="hidden sm:flex items-center text-[10px] uppercase font-semibold text-gray-500">
                        <Activity className="w-3 h-3 mr-1 text-qx-blue" />
                        Last Signal Recv: <span className="ml-1 text-gray-300">{format(new Date(lastSignalTime), 'HH:mm:ss')}</span>
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center text-[10px] uppercase font-semibold">
                    <span className="text-gray-500 mr-1.5">Account Mode:</span>
                    <span className={isDemo ? "text-amber-500" : "text-qx-green"}>
                        {isDemo ? "DEMO EUR" : "LIVE"}
                    </span>
                </div>
            </div>
        </footer>
    );
}
