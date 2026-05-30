import React from 'react';
import { Shield, LayoutGrid, Wifi, Layers, Activity, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  connectionState: 'disconnected' | 'connecting' | 'connected';
}

export default function Sidebar({ activeTab, setActiveTab, connectionState }: SidebarProps) {
  const navItems = [
    { id: 'quick', label: 'Дошборд', icon: LayoutGrid, desc: 'Главный пульт' },
    { id: 'wifi', label: 'Сервера WI-FI', icon: Wifi, desc: 'Защита хотспотов' },
    { id: 'whitelist', label: 'Белые Списки', icon: Layers, desc: 'Управление путями' },
    { id: 'stats', label: 'Статистика', icon: Activity, desc: 'Графики и логи' },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside id="desktop-sidebar" className="hidden lg:flex flex-col w-64 bg-garcha-card border-r border-garcha-border min-h-[calc(100vh-80px)] p-6 justify-between flex-shrink-0">
        <div className="flex flex-col gap-6">
          <div className="text-slate-500 text-[10px] uppercase font-mono tracking-wider pl-3">Навигация</div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,180,220,0.05)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 border border-transparent'
                  }`}
                >
                  <IconComp className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 group-hover:text-slate-400">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Info Box Footer */}
        <div className="bg-garcha-dark/60 border border-garcha-border/40 p-4 rounded-xl text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Shield className="h-4 w-4 shrink-0" />
            <span className="font-semibold">GARCHA Сканнер</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Двойное VPN туннелирование препятствует перехвату пакетов на всех общедоступных точках доступа Wi-Fi.
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>Статус ядра:</span>
            <span className={connectionState === 'connected' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {connectionState === 'connected' ? 'АКТИВНО' : 'ОЖИДАНИЕ'}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Tab Bar (Bottom) */}
      <nav id="mobile-tab-bar" className="lg:hidden fixed bottom-0 left-0 right-0 bg-garcha-card/95 backdrop-blur-md border-t border-garcha-border flex justify-around p-3 z-50 shadow-2xl">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all duration-200 ${
                isActive ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <IconComp className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
