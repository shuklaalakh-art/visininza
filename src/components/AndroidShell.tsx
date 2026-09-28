import React, { useState, useEffect } from 'react';
import { VisiNinjaLogo } from './VisiNinjaLogo';
import {
  Wifi,
  BatteryCharging,
  Smartphone,
  Maximize2,
  FileSpreadsheet,
  CheckCircle2,
  BrainCircuit,
  BarChart2,
  Download,
  Info,
} from 'lucide-react';

interface AndroidShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  datasetName?: string;
  children: React.ReactNode;
}

export const AndroidShell: React.FC<AndroidShellProps> = ({
  activeTab,
  onTabChange,
  datasetName,
  children,
}) => {
  const [deviceTime, setDeviceTime] = useState('09:41');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setDeviceTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'feed', label: 'Feed XLSX', icon: FileSpreadsheet },
    { id: 'clean', label: 'Clean', icon: CheckCircle2 },
    { id: 'council', label: '5-AI Council', icon: BrainCircuit },
    { id: 'viz', label: 'Charts', icon: BarChart2 },
    { id: 'apk', label: 'Install APK', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Outer Desktop Utilities Bar (when viewed on desktop) */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">Android PWA Edition</span>
          <span className="text-slate-600">·</span>
          <span className="text-teal-400 font-medium">Material You Interface</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('about')}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              activeTab === 'about' ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Brand & About
          </button>

          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Responsive View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container - Either Phone Frame or Full Responsive */}
      <div
        className={`w-full transition-all duration-300 flex flex-col justify-between ${
          isPhoneFrame
            ? 'max-w-[440px] my-6 rounded-[48px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl shadow-teal-950/50 overflow-hidden ring-1 ring-slate-700'
            : 'max-w-4xl mx-auto flex-1 flex flex-col justify-between min-h-[calc(100vh-42px)]'
        }`}
      >
        {/* Android Status Bar */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400 select-none bg-slate-950 shrink-0">
          <span className="font-bold text-slate-200 tracking-tight font-mono">{deviceTime}</span>

          {isPhoneFrame && (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 shadow-inner" />
          )}

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] font-bold tracking-tight text-slate-300">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono text-slate-300">98%</span>
              <BatteryCharging className="w-4 h-4 text-teal-400" />
            </div>
          </div>
        </div>

        {/* Android Material 3 Top App Bar */}
        <header className="px-4 py-3 bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            {/* VisiNinja Logo with 'Created by Alakh' right below it */}
            <VisiNinjaLogo
              size="md"
              showSubtitle={true}
              showCreatedBy={true}
              onClick={() => onTabChange('about')}
            />

            {/* Quick Active Dataset Badge */}
            {datasetName && (
              <div
                onClick={() => onTabChange('clean')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-teal-500/40 cursor-pointer transition-colors max-w-[180px] truncate"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span className="truncate">{datasetName}</span>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <main className="flex-1 px-4 py-4 overflow-y-auto">
          {children}
        </main>

        {/* Android Material You Bottom Navigation Bar */}
        <nav className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 select-none">
          <div className="grid grid-cols-5 gap-1 items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                    isActive
                      ? 'text-teal-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap truncate max-w-[64px]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Android Bottom Gesture Bar */}
          <div className="w-32 h-1 bg-slate-700/60 rounded-full mx-auto my-1.5" />
        </nav>
      </div>
    </div>
  );
};
