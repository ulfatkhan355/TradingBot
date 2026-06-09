import React, { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';
import { AppSettings } from '../App';

interface TopbarProps {
    settings: AppSettings;
}

export function Topbar({ settings }: TopbarProps) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeFormat = settings.timeFormat === '12 Hour' ? 'hh:mm:ss a' : 'HH:mm:ss';

    const clocks = [
        { label: 'UTC', tz: 'UTC' },
        { label: 'Pakistan', tz: 'Asia/Karachi' },
        { label: 'India (+5:30)', tz: 'Asia/Kolkata' },
        { label: 'London', tz: 'Europe/London' },
        { label: 'New York', tz: 'America/New_York' },
        { label: 'Tokyo', tz: 'Asia/Tokyo' },
    ];

    return (
        <header className="h-16 bg-qx-card border-b border-qx-border flex items-center justify-between px-6 shrink-0 z-10 w-full">
            
            <div className="hidden lg:flex items-center space-x-6">
                {clocks.map(clock => (
                    <div key={clock.label} className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{clock.label}</span>
                        <span className="text-sm text-gray-200 font-mono">
                            {formatInTimeZone(now, clock.tz, timeFormat)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex items-center lg:hidden">
                <span className="font-bold text-lg tracking-tight text-white mr-4">QX Broker</span>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
                {/* Account Status / Current Pair could go here */}
                <div className="hidden md:flex items-center px-4 py-1.5 bg-[#1e2330] rounded-lg border border-qx-border text-qx-blue">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-qx-blue/20 px-2 py-0.5 rounded shadow-sm">AI Simulated</span>
                </div>
                <div className="hidden md:flex items-center px-4 py-1.5 bg-[#1e2330] rounded-lg border border-qx-border">
                    <span className="text-sm text-gray-400 mr-2">Demo Account:</span>
                    <span className="text-sm font-bold text-qx-blue font-mono">$10,000.00</span>
                </div>

                <div className="relative hidden md:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search pairs..." 
                        className="bg-qx-bg border border-qx-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-qx-blue transition-colors w-48 placeholder:text-gray-600"
                    />
                </div>
                
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    {settings.notifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-qx-red rounded-full border-2 border-qx-card"></span>}
                </button>

                <div className="h-8 w-8 rounded-full bg-qx-bg border border-qx-border flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                    <User className="w-4 h-4 text-gray-400" />
                </div>
            </div>
        </header>
    );
}
