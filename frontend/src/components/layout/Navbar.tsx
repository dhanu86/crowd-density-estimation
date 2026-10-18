import React from 'react';
import { 
  Activity, 
  Layers, 
  Sliders, 
  History, 
  BarChart2, 
  Camera, 
  Box
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  systemStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, systemStatus = "Healthy" }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'analyze', label: 'Analyze', icon: <Layers className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'evaluation', label: 'Evaluation', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'calibration', label: 'Calibration', icon: <Camera className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-dark-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-100 tracking-tight flex items-center gap-2 text-base">
                STEREOVISION CROWD ANALYTICS
              </div>
              <div className="text-[10px] font-mono text-cyan-400 tracking-wider">
                3D LOCALIZATION & SPATIAL DENSITY PIPELINE
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-semibold">{systemStatus}</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400 text-[11px]">StereoSGBM + YOLOv8</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
