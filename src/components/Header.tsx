import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw, Zap, Timer } from 'lucide-react';
import { ConnectionState, VPNServer, VPNProtocol } from '../types';

interface HeaderProps {
  connectionState: ConnectionState;
  selectedServer: VPNServer;
  duration: number;
  protocol: VPNProtocol;
  ipAddress: string;
}

export default function Header({
  connectionState,
  selectedServer,
  duration,
  protocol,
  ipAddress
}: HeaderProps) {
  const [imgError, setImgError] = useState(false);

  // Format dynamic connection timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(displayMins)}:${pad(remainingSecs)}`;
    }
    return `${pad(displayMins)}:${pad(remainingSecs)}`;
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between border-b border-garcha-border bg-garcha-card p-4 md:px-8 gap-4 shadow-md sticky top-0 z-50">
      {/* Brand Profile - Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 opacity-75 blur-md group-hover:opacity-100 transition duration-300 animate-pulse-glow" />
          <div className="relative h-12 w-12 rounded-full border border-garcha-border bg-garcha-dark overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <img
                src="/src/assets/images/garchavpn_logo_1780156330832.png"
                alt="GARCHAVPN Logo"
                className="h-full w-full object-cover animate-float-fire"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              // SVG Layered Flame Fallback - absolutely stunning
              <svg
                viewBox="0 0 100 100"
                className="h-8 w-8 animate-float-fire"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="flameGrad" x1="0%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 95C69.33 95 85 79.33 85 60C85 45.2 78.4 34.8 70 25C73 34 71.5 45 64 52C56.5 59 48 51.5 48 41C48 29.5 55 12 50 5C45.2 13 36 25.5 30 36C22 50 15 57 15 68C15 82.91 30.67 95 50 95Z"
                  fill="url(#flameGrad)"
                />
                <path
                  d="M50 90C63.81 90 75 78.81 75 65C75 51.5 63 43 57 33C57.5 40.5 54 48.5 48.5 53.5C43 58.5 38 52 38 45.5C38 37 41 29 38 22C34.5 28.5 29 37.5 25.5 45C21.5 53.5 19 60.5 19 67.5C19 79.93 29.5 90 50 90Z"
                  fill="#00F0FF"
                  opacity="0.8"
                  style={{ mixBlendMode: 'screen' }}
                />
              </svg>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 id="app-brand-title" className="text-xl md:text-2xl font-sans font-bold tracking-tight text-white m-0">
              GARCHA<span className="text-cyan-400">VPN</span>
            </h1>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
              v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Премиальная безопасность для Wi-Fi и белых списков</p>
        </div>
      </div>

      {/* Connection Quick Telemetry Ribbon */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 bg-garcha-dark/50 border border-garcha-border/50 px-4 py-2 rounded-2xl">
        {/* Dynamic IP Indicator */}
        <div className="flex items-center gap-2 border-r border-garcha-border/50 pr-4">
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Виртуальный IP</div>
            <div className="text-xs font-mono font-medium text-slate-300">
              {connectionState === 'connected' ? ipAddress : '---.---.---.---'}
            </div>
          </div>
        </div>

        {/* Selected Protocol */}
        <div className="flex items-center gap-2 border-r border-garcha-border/50 pr-4">
          <Zap className="h-4 w-4 text-cyan-400" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Протокол</div>
            <div className="text-xs font-semibold text-slate-300">{protocol}</div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <Timer className={`h-4 w-4 ${connectionState === 'connected' ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Времени в сети</div>
            <div className="text-xs font-mono font-bold text-slate-200">
              {connectionState === 'connected' ? formatTime(duration) : '00:00:00'}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Shield Button */}
      <div className="flex items-center gap-3">
        {connectionState === 'connected' ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium px-4 py-2 rounded-xl text-xs sm:text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="h-4 w-4 text-emerald-400 animate-bounce" />
            <span>Соединение Защищено</span>
          </div>
        ) : connectionState === 'connecting' ? (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium px-4 py-2 rounded-xl text-xs sm:text-sm animate-pulse-glow">
            <RefreshCw className="h-4 w-4 text-amber-400 animate-spin" />
            <span>Установка шифрования...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 font-medium px-4 py-2 rounded-xl text-xs sm:text-sm">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>Трафик Не Защищен</span>
          </div>
        )}
      </div>
    </header>
  );
}
