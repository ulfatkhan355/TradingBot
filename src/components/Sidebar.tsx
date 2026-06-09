import React from 'react';
import { 
    LayoutDashboard, 
    LineChart, 
    History, 
    Settings, 
    ActivitySquare, 
    Activity, 
    Globe2 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'scanner', label: 'Scanner', icon: ActivitySquare },
        { id: 'analytics', label: 'Analytics', icon: LineChart },
        { id: 'history', label: 'History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-16 md:w-64 h-screen bg-[#1e222d] border-r border-gray-800 flex flex-col transition-all duration-300 z-20 shrink-0">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-800">
                <Globe2 className="w-8 h-8 text-indigo-500 shrink-0" />
                <span className="hidden md:block ml-3 font-bold text-lg tracking-tight text-white">ForexPro</span>
            </div>

            <nav className="flex-1 py-6 space-y-2 px-3">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center justify-center md:justify-start px-3 py-3 rounded-xl transition-all duration-200 group",
                                isActive 
                                    ? "bg-indigo-500/10 text-indigo-400" 
                                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-200", isActive && "scale-110")} />
                            <span className="hidden md:block ml-4 font-medium text-sm tracking-wide">
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className="hidden md:block absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 flex items-center justify-center md:justify-start">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                   <Activity className="w-4 h-4 text-white" />
               </div>
               <div className="hidden md:block ml-3">
                   <p className="text-xs font-semibold text-white">Engine Status</p>
                   <p className="text-[10px] text-emerald-400 flex items-center">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                       Live Connected
                   </p>
               </div>
            </div>
        </aside>
    );
}
