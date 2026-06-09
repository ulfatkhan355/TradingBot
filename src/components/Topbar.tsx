import React, { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export function Topbar() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const clocks = [
        { label: 'UTC', tz: 'UTC' },
        { label: 'London', tz: 'Europe/London' },
        { label: 'New York', tz: 'America/New_York' },
        { label: 'Tokyo', tz: 'Asia/Tokyo' },
        { label: 'Sydney', tz: 'Australia/Sydney' },
    ];

    return (
        <header className="h-16 bg-[#1e222d] border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-10 w-full">
            
            <div className="hidden lg:flex items-center space-x-6">
                {clocks.map(clock => (
                    <div key={clock.label} className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{clock.label}</span>
                        <span className="text-sm text-gray-200 font-mono">
                            {formatInTimeZone(now, clock.tz, 'HH:mm:ss')}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex-1 lg:hidden text-gray-400 text-sm font-mono">
                {formatInTimeZone(now, 'UTC', 'HH:mm:ss')} UTC
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search pairs..." 
                        className="bg-[#131722] border border-gray-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors w-48 placeholder:text-gray-600"
                    />
                </div>
                
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#1e222d]"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                    <User className="w-4 h-4 text-gray-400" />
                </div>
            </div>
        </header>
    );
}
