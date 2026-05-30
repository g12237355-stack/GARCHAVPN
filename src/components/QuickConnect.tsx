import React from 'react';
import { Power, Globe, Zap, Cpu, ArrowUpRight, ArrowDownRight, RefreshCw, Radio } from 'lucide-react';
import { ConnectionState, VPNServer, VPNProtocol, VPNStats } from '../types';

interface QuickConnectProps {
  connectionState: ConnectionState;
  selectedServer: VPNServer;
  stats: VPNStats;
  protocol: VPNProtocol;
  setProtocol: (protocol: VPNProtocol) => void;
  onToggleConnection: () => void;
}

export default function QuickConnect({
  connectionState,
  selectedServer,
  stats,
  protocol,
  setProtocol,
  onToggleConnection
}: QuickConnectProps) {
  const getProtocolDetails = (p: VPNProtocol) => {
    switch (p) {
      case 'WireGuard':
        return { desc: 'Максимальная скорость, легкий и современный код.', port: 'UDP 51820', encryption: 'ChaCha20-Poly1305' };
      case 'OpenVPN':
        return { desc: 'Непревзойденная надежность и обход жестких файрволов.', port: 'TCP 443 (SSL)', encryption: 'AES-256-GCM' };
      case 'GARCHA-Stealth':
        return { desc: 'Маскировка VPN под обычный веб-трафик (HTTPS obfuscation).', port: 'TLS v1.3 Dynamic', encryption: 'AES-256-SHA384' };
    }
  };

  const protocolDetails = getProtocolDetails(protocol);

  return (
    <div id="quick-connect-container" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Column 1 & 2: Main Connection Node */}
      <div className="xl:col-span-2 flex flex-col gap-6 bg-garcha-card border border-garcha-border rounded-3xl p-6 relative overflow-hidden shadow-xl">
        {/* Glow behind contents */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

        {/* Top Header Row of the connection node */}
        <div className="flex items-center justify-between border-b border-garcha-border/50 pb-4">
          <div>
            <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">GARCHAVPN Монитор</span>
            <h3 className="text-lg font-bold text-white">Статус Защиты</h3>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/40 border border-garcha-border/60 px-3 py-1.5 rounded-full text-xs">
            <Radio className={`h-3 w-3 ${connectionState === 'connected' ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-300 font-medium">
              {connectionState === 'connected' ? 'Подключен к сети' : connectionState === 'connecting' ? 'В процессе...' : 'Вне сети'}
            </span>
          </div>
        </div>

        {/* Centered Connection Orb & Flame */}
        <div className="flex flex-col items-center justify-center py-8 gap-6">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Radiating Circle */}
            <div
              className={`absolute rounded-full transition-all duration-1000 ${
                connectionState === 'connected'
                  ? 'h-64 w-64 bg-cyan-500/10 border border-cyan-500/20 scale-105 animate-pulse-glow'
                  : connectionState === 'connecting'
                  ? 'h-64 w-64 bg-amber-500/5 border border-dashed border-amber-500/30 animate-spin [animation-duration:15s]'
                  : 'h-60 w-60 bg-transparent border border-garcha-border/40'
              }`}
            />

            {/* Middle Rotating Orbiting Loader (Only during connecting) */}
            <div
              className={`absolute rounded-full border-t-2 border-b-2 transition-all duration-500 ${
                connectionState === 'connecting'
                  ? 'h-52 w-52 border-cyan-400 animate-spin [animation-duration:1.5s] opacity-100'
                  : 'h-48 w-48 border-transparent opacity-0 scale-90'
              }`}
            />

            {/* Power Button Shell */}
            <button
              id="garcha-connection-power-button"
              onClick={onToggleConnection}
              className={`relative h-40 w-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer shadow-lg group ${
                connectionState === 'connected'
                  ? 'bg-gradient-to-br from-garcha-card to-garcha-dark border border-cyan-400/60 shadow-[0_0_40px_rgba(58,190,248,0.3)] hover:border-cyan-400/80 scale-105'
                  : connectionState === 'connecting'
                  ? 'bg-gradient-to-br from-garcha-card to-garcha-dark border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-400'
                  : 'bg-gradient-to-br from-garcha-lightcard to-garcha-card border border-garcha-border shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:border-slate-500'
              }`}
            >
              {/* Pulsing Backlight inner */}
              <div
                className={`absolute inset-0 rounded-full bg-cyan-500/5 transition-opacity duration-500 group-hover:opacity-100 ${
                  connectionState === 'connected' ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Glowing Icon (Power or Loader) */}
              {connectionState === 'connecting' ? (
                <RefreshCw className="h-10 w-10 text-amber-500 animate-spin" />
              ) : (
                <Power
                  className={`h-12 w-12 transition-all duration-500 ${
                    connectionState === 'connected'
                      ? 'text-cyan-400 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
              )}

              {/* Status Note under Button */}
              <span
                className={`mt-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${
                  connectionState === 'connected'
                    ? 'text-cyan-400'
                    : connectionState === 'connecting'
                    ? 'text-amber-500'
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}
              >
                {connectionState === 'connected' ? 'ВКЛЮЧЕНО' : connectionState === 'connecting' ? 'СТАРТ' : 'ВЫКЛЮЧЕНО'}
              </span>
            </button>
          </div>

          {/* Quick status line */}
          <div className="text-center">
            <h4 className="text-base font-semibold text-slate-100">
              {connectionState === 'connected' ? 'Безопасное соединение активно' : connectionState === 'connecting' ? 'Соединяем...' : 'Подключение отсутствует'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              {connectionState === 'connected'
                ? `Маршрутизируем ваш трафик через ${selectedServer.flag} ${selectedServer.name}`
                : connectionState === 'connecting'
                ? `Синхронизируем ключи через защищенный узел ${selectedServer.country}`
                : 'Кликните на кнопку выше для безопасного старта VPN-туннеля.'}
            </p>
          </div>
        </div>

        {/* Speed Analytics Cards inside container */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          {/* Download Box */}
          <div className="bg-garcha-dark/60 border border-garcha-border/70 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Входящий Канал</span>
              <span className="text-lg sm:text-2xl font-mono font-bold text-white mt-1">
                {connectionState === 'connected' ? stats.downloadSpeed.toFixed(1) : '0.0'}{' '}
                <span className="text-[10px] font-sans font-normal text-slate-400">Мбит/с</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                Скачано: <span className="text-cyan-400 font-semibold">{connectionState === 'connected' ? stats.totalDownloaded.toFixed(1) : '0'}{' MB'}</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          {/* Upload Box */}
          <div className="bg-garcha-dark/60 border border-garcha-border/70 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Исходящий Канал</span>
              <span className="text-lg sm:text-2xl font-mono font-bold text-white mt-1">
                {connectionState === 'connected' ? stats.uploadSpeed.toFixed(1) : '0.0'}{' '}
                <span className="text-[10px] font-sans font-normal text-slate-400">Мбит/с</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                Отправлено: <span className="text-blue-400 font-semibold">{connectionState === 'connected' ? stats.totalUploaded.toFixed(1) : '0'}{' MB'}</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Active Server Card & Protocol Choice */}
      <div className="flex flex-col gap-6">
        {/* Server Widget */}
        <div className="bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-garcha-border/50 pb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Узел Подключения</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              selectedServer.type === 'wifi' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}>
              {selectedServer.type === 'wifi' ? 'Для Wi-Fi сетей' : 'Для Белых списков'}
            </span>
          </div>

          {/* Flag and Server Name */}
          <div className="flex items-center gap-4 bg-garcha-dark/50 border border-garcha-border/40 p-3 rounded-2xl">
            <span className="text-4xl filter drop-shadow">{selectedServer.flag}</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{selectedServer.name}</h4>
              <p className="text-xs text-slate-400">{selectedServer.country} ({selectedServer.ip})</p>
            </div>
          </div>

          {/* Core Server Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-garcha-dark/30 border border-garcha-border/30 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Задержка (Ping)</span>
              <div className="text-base font-bold text-white mt-1 filter drop-shadow">
                {selectedServer.ping} <span className="text-xs font-normal text-slate-400">мс</span>
              </div>
            </div>
            <div className="bg-garcha-dark/30 border border-garcha-border/30 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Нагрузка</span>
              <div className="text-base font-bold text-white mt-1 flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${
                  selectedServer.load < 40 ? 'bg-emerald-500' : selectedServer.load < 70 ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span>{selectedServer.load}%</span>
              </div>
            </div>
          </div>

          {/* Secure Features List */}
          <div className="bg-garcha-dark/40 border border-garcha-border/40 p-4 rounded-xl">
            <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-2">Технические особенности:</div>
            <div className="flex flex-col gap-1.5">
              {selectedServer.secureFeatures.slice(0, 3).map((feat, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Protocol Swapper */}
        <div className="bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-garcha-border/50 pb-2">
            Протоколы GARCHA
          </h3>
          <div className="flex flex-col gap-2">
            {(['WireGuard', 'OpenVPN', 'GARCHA-Stealth'] as VPNProtocol[]).map((p) => (
              <button
                key={p}
                id={`protocol-select-${p}`}
                onClick={() => setProtocol(p)}
                disabled={connectionState === 'connecting'}
                className={`flex items-center justify-between p-3 rounded-xl text-left border transition-all duration-300 ${
                  protocol === p
                    ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-cyan-400 border-cyan-500/30'
                    : 'bg-garcha-dark/40 border-garcha-border/60 text-slate-400 hover:bg-slate-800/20 hover:text-slate-200'
                } ${connectionState === 'connecting' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2">
                  <Cpu className={`h-4 w-4 ${protocol === p ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold font-mono">{p}</span>
                </div>
                {protocol === p && (
                  <span className="bg-cyan-500/20 text-cyan-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                    АКТИВЕН
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Selected Summary */}
          <div className="bg-garcha-dark/60 border border-garcha-border/40 p-3 rounded-xl text-xs flex flex-col gap-1">
            <div className="flex justify-between font-mono text-[10px] font-bold text-slate-400 select-none">
              <span>Порт: {protocolDetails.port}</span>
              <span>Шифр: {protocolDetails.encryption}</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed mt-1">{protocolDetails.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
