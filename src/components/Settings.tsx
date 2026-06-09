import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Moon, Clock, Globe, Sliders } from 'lucide-react';

export function Settings() {
    return (
        <div className="h-full flex flex-col bg-[#1e222d] rounded-xl border border-gray-800 overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-gray-100 flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2 text-indigo-400" /> Platform Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">Configure your trading environment and engine parameters.</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">Appearance & Region</h3>
                    
                    <SettingToggle icon={Moon} label="Dark Mode" description="Use premium dark interface" active />
                    <SettingToggle icon={Globe} label="Timezone" description="Display times in UTC" active />
                    <SettingSelect icon={Clock} label="Date Format" options={['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY']} />
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">Notifications</h3>
                    
                    <SettingToggle icon={Bell} label="Push Notifications" description="Alert on new A+ signals" active />
                    <SettingToggle icon={Bell} label="Sound Alerts" description="Play chime on signal entry/expiry" active={false} />
                    <SettingToggle icon={Shield} label="News Alerts" description="Warn before high impact events" active />
                </div>

                <div className="space-y-6 md:col-span-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">Signal Engine Parameters</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingSelect 
                            icon={Sliders} 
                            label="Minimum Quality Filter" 
                            options={['A+ Only', 'A and above', 'B+ and above', 'All Signals']} 
                        />
                        <SettingSelect 
                            icon={Sliders} 
                            label="Risk Profile" 
                            options={['Conservative (Higher Confluence)', 'Moderate', 'Aggressive (Lower Confluence)']} 
                        />
                    </div>
                    
                    <div className="bg-[#131722] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-200 text-sm">Engine Connection</p>
                            <p className="text-xs text-gray-500 mt-0.5">Connect to external real-time pricing feeds</p>
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

function SettingSelect({ icon: Icon, label, options }: any) {
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
            <select className="bg-[#131722] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500">
                {options.map((o: string) => <option key={o}>{o}</option>)}
            </select>
        </div>
    )
}
