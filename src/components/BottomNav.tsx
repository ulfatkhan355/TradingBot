import React from 'react';
import { 
    LayoutDashboard, 
    ActivitySquare, 
    LineChart, 
    History, 
    Settings 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    const tabs = [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'scanner', label: 'Scanner', icon: ActivitySquare },
        { id: 'analytics', label: 'Analytics', icon: LineChart },
        { id: 'history', label: 'History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1e222d] border-t border-gray-800 z-50 flex items-center justify-around px-2 pb-safe">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full transition-colors",
                            isActive ? "text-indigo-400" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <Icon className={cn("w-5 h-5 mb-1", isActive && "scale-110 transition-transform")} />
                        <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
