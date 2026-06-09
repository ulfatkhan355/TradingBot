import React from 'react';
import { Settings as SettingsIcon, Bell, Moon, Clock, Globe, Volume2, Monitor } from 'lucide-react';
import { AppSettings } from '../App';

interface SettingsProps {
    timeframe: '1m' | '5m' | '15m';
    setTimeframe: (tf: '1m' | '5m' | '15m') => void;
    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export function Settings({ timeframe, setTimeframe, settings, setSettings }: SettingsProps) {
    const handleToggle = (key: keyof AppSettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="h-full flex flex-col bg-qx-card rounded-xl border border-qx-border overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-qx-border">
                <h2 className="text-xl font-bold text-gray-100 flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2 text-qx-blue" /> Platform Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">Configure your binary options environment and engine parameters.</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-qx-border pb-2">Appearance & Region</h3>
                    
                    <SettingSelect 
                        icon={Monitor} 
                        label="Theme" 
                        options={['Dark', 'Light']} 
                        value={settings.theme} 
                        onChange={(e: any) => setSettings(prev => ({ ...prev, theme: e.target.value }))} 
                    />
                    <SettingSelect 
                        icon={Globe} 
                        label="Time Zone" 
                        options={['Local', 'UTC', 'Pakistan', 'London', 'New York', 'Tokyo']} 
                        value={settings.timeZone} 
                        onChange={(e: any) => setSettings(prev => ({ ...prev, timeZone: e.target.value }))} 
                    />
                    <SettingSelect 
                        icon={Clock} 
                        label="Time Format" 
                        options={['12 Hour', '24 Hour']} 
                        value={settings.timeFormat} 
                        onChange={(e: any) => setSettings(prev => ({ ...prev, timeFormat: e.target.value }))} 
                    />
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-qx-border pb-2">Notifications</h3>
                    
                    <SettingToggle 
                        icon={Bell} 
                        label="Signal Notifications" 
                        description="Show popup alerts for new signals" 
                        active={settings.notifications}
                        onClick={() => handleToggle('notifications')}
                    />
                    
                    <SettingToggle 
                        icon={Volume2} 
                        label="Signal Sound" 
                        description="Play an audible beep for new signals" 
                        active={settings.signalSound}
                        onClick={() => handleToggle('signalSound')}
                    />
                </div>

                <div className="space-y-6 md:col-span-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-qx-border pb-2">System Integrations</h3>
                    
                    <div className="bg-qx-card p-4 rounded-lg border border-amber-500/30 flex items-start">
                        <div className="p-2 bg-amber-500/10 rounded-lg mr-4 mt-1">
                            <Monitor className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-400 text-sm mb-1">Live Engine Connection Status</p>
                            <p className="text-xs text-gray-400 leading-relaxed mb-3">
                                The application connects directly to the Finnhub WebSocket API to stream real-time forex tick data. The simulation engine runs purely on the client side without relying on a backend server or mock generators.
                            </p>
                            <div className="bg-qx-bg p-3 rounded border border-qx-border text-xs text-gray-500 font-mono">
                                STATUS: Direct WebSocket Streaming (Real Time)
                            </div>
                        </div>
                    </div>

                    <div className="bg-qx-bg p-4 rounded-lg border border-qx-border flex items-center justify-between opacity-50">
                        <div>
                            <p className="font-medium text-gray-200 text-sm">Engine Connection (Real API)</p>
                            <p className="text-xs text-gray-500 mt-0.5">Connect to external real-time pricing feeds (e.g. Quotex API, IQ Option)</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed">
                            Requires Backend
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function SettingToggle({ icon: Icon, label, description, active, onClick }: any) {
    return (
        <div className="flex items-center justify-between cursor-pointer group" onClick={onClick}>
            <div className="flex items-start">
                <div className="p-2 bg-qx-bg rounded-lg mr-3 group-hover:bg-[#1e2330] transition-colors">
                    <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                    <p className="font-medium text-gray-200 text-sm">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-qx-blue' : 'bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </div>
    )
}

function SettingSelect({ icon: Icon, label, options, value, onChange }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-start">
                <div className="p-2 bg-qx-bg rounded-lg mr-3">
                    <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                    <p className="font-medium text-gray-200 text-sm">{label}</p>
                </div>
            </div>
            <select 
                className="bg-qx-bg border border-qx-border rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-qx-blue"
                value={value}
                onChange={onChange}
            >
                {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}
