import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    LineChart, 
    History, 
    Settings, 
    ActivitySquare, 
    Activity, 
    Globe2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'scanner', label: 'Scanner', icon: ActivitySquare },
        { id: 'analytics', label: 'Analytics', icon: LineChart },
        { id: 'history', label: 'History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className={cn(
            "hidden md:flex h-screen bg-qx-bg border-r border-qx-border flex-col transition-all duration-300 z-20 shrink-0",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="h-16 flex items-center justify-between px-4 border-b border-qx-border bg-qx-card relative">
                <div className="flex items-center overflow-hidden">
                    <Globe2 className="w-8 h-8 text-qx-blue shrink-0 ml-1" />
                    <span className={cn("ml-3 font-bold text-lg tracking-tight text-white transition-opacity duration-200 whitespace-nowrap", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                        QX Broker
                    </span>
                </div>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-qx-card border border-qx-border rounded-full p-1 text-gray-400 hover:text-white hover:bg-qx-border shadow-md"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            <nav className="flex-1 py-6 space-y-2 px-3 overflow-hidden">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            title={isCollapsed ? tab.label : undefined}
                            className={cn(
                                "w-full flex items-center justify-center md:justify-start py-3 rounded-xl transition-all duration-200 group relative",
                                isCollapsed ? "px-0" : "px-3",
                                isActive 
                                    ? "bg-qx-card border border-qx-border text-qx-blue shadow-sm" 
                                    : "border border-transparent text-gray-400 hover:bg-qx-card hover:text-gray-200"
                            )}
                        >
                            <div className={cn("flex items-center justify-center", isCollapsed && "w-full")}>
                                <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-200", isActive && "scale-110", isCollapsed && "mx-auto")} />
                            </div>
                            <span className={cn(
                                "hidden md:block ml-4 font-medium text-sm tracking-wide transition-opacity duration-200 whitespace-nowrap",
                                isCollapsed ? "opacity-0 w-0 h-0 hidden" : "opacity-100"
                            )}>
                                {tab.label}
                            </span>
                            {isActive && !isCollapsed && (
                                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-qx-blue rounded-r-full shadow-[0_0_10px_rgba(77,166,255,0.5)]" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className={cn("p-4 border-t border-qx-border flex items-center justify-center bg-qx-card", !isCollapsed && "md:justify-start")}>
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-qx-blue to-blue-800 flex items-center justify-center shrink-0" title={isCollapsed ? "Engine Live" : undefined}>
                   <Activity className="w-4 h-4 text-white" />
               </div>
               <div className={cn("hidden md:block ml-3 overflow-hidden transition-all duration-200", isCollapsed ? "opacity-0 w-0 h-0" : "opacity-100")}>
                   <p className="text-xs font-semibold text-white whitespace-nowrap">Engine Status</p>
                   <p className="text-[10px] text-qx-green flex items-center whitespace-nowrap">
                       <span className="w-1.5 h-1.5 rounded-full bg-qx-green mr-1.5 animate-pulse shadow-[0_0_5px_rgba(0,230,118,0.8)]"></span>
                       Live Connected
                   </p>
               </div>
            </div>
        </aside>
    );
}
