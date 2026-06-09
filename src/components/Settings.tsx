import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Moon, Clock, Globe, Sliders } from 'lucide-react';

interface SettingsProps {
    timeframe: '1m' | '5m' | '15m';
    setTimeframe: (tf: '1m' | '5m' | '15m') => void;
}

export function Settings({ timeframe, setTimeframe }: SettingsProps) {
    return (
        <div className="h-full flex flex-col bg-[#1e222d] rounded-xl border border-gray-800 overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-gray-100 flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2 text-indigo-400" /> Platform Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">Configure your binary options environment and engine parameters.</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">Appearance & Region</h3>
                    
                    <SettingToggle icon={Moon} label="Dark Mode" description="Use premium dark interface" active />
                    <SettingToggle icon={Globe} label="Timezone" description="Display times in UTC" active />
                    <SettingSelect icon={Clock} label="Date Format" options={['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY']} value="YYYY-MM-DD" onChange={() => {}} />
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">Signal Engine Parameters</h3>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-start">
                            <div className="p-2 bg-[#131722] rounded-lg mr-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-200 text-sm">Default Timeframe</p>
                                <p className="text-xs text-gray-500 mt-0.5">Base expiration for new signals</p>
                            </div>
                        </div>
                        <select 
                            className="bg-[#131722] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value as any)}
                        >
                            <option value="1m">1 Minute</option>
                            <option value="5m">5 Minutes</option>
                            <option value="15m">15 Minutes</option>
                        </select>
                    </div>

                    <SettingSelect 
                        icon={Sliders} 
                        label="Minimum Quality Filter" 
                        options={['A+ Only', 'A and above', 'B+ and above', 'All Signals']} 
                        value="B+ and above"
                        onChange={() => {}}
                    />
                </div>

                <div className="space-y-6 md:col-span-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">System Integrations</h3>
                    
                    <div className="bg-[#131722] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-200 text-sm">Engine Connection</p>
                            <p className="text-xs text-gray-500 mt-0.5">Connect to external real-time pricing feeds (e.g. Quotex API, IQ Option)</p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors">
                            Configure API
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function SettingToggle({ icon: Icon, label, description, active }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-start">
                <div className="p-2 bg-[#131722] rounded-lg mr-3">
                    <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                    <p className="font-medium text-gray-200 text-sm">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </div>
    )
}

function SettingSelect({ icon: Icon, label, options, value, onChange }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-start">
                <div className="p-2 bg-[#131722] rounded-lg mr-3">
                    <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                    <p className="font-medium text-gray-200 text-sm">{label}</p>
                </div>
            </div>
            <select 
                className="bg-[#131722] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                value={value}
                onChange={onChange}
            >
                {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}
