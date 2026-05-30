import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QuickConnect from './components/QuickConnect';
import WifiShield from './components/WifiShield';
import WhitelistManager from './components/WhitelistManager';
import SpeedCharts from './components/SpeedCharts';

import { VPNServer, ConnectionState, VPNProtocol, WhitelistRule, VPNStats } from './types';
import { INITIAL_SERVERS, INITIAL_WHITELIST_RULES } from './data';
import { Shield, Lock, Globe, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // Global VPN States
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [selectedServer, setSelectedServer] = useState<VPNServer>(INITIAL_SERVERS[0]);
  const [activeTab, setActiveTab] = useState<string>('quick');
  const [protocol, setProtocol] = useState<VPNProtocol>('WireGuard');
  const [rules, setRules] = useState<WhitelistRule[]>(INITIAL_WHITELIST_RULES);
  const [ipAddress, setIpAddress] = useState<string>(INITIAL_SERVERS[0].ip);
  const [duration, setDuration] = useState<number>(0);
  
  const [stats, setStats] = useState<VPNStats>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    totalDownloaded: 0,
    totalUploaded: 0,
    pingTime: INITIAL_SERVERS[0].ping,
    sessionDuration: 0
  });

  // Handle connection toggling
  const handleToggleConnection = () => {
    if (connectionState === 'disconnected') {
      setConnectionState('connecting');
      // Simulate cryptographic handshake delay of 1.5 seconds
      const timer = setTimeout(() => {
        setConnectionState('connected');
        setIpAddress(selectedServer.ip);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setConnectionState('disconnected');
    }
  };

  // Hot swapping servers with connection state preservation
  const handleSelectServer = (server: VPNServer) => {
    setSelectedServer(server);
    if (connectionState === 'connected') {
      setConnectionState('connecting');
      const timer = setTimeout(() => {
        setConnectionState('connected');
        setIpAddress(server.ip);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIpAddress(server.ip);
    }
  };

  // Active Connection Timer Tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (connectionState === 'connected') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else if (connectionState === 'disconnected') {
      setDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [connectionState]);

  // Dynamic Speeds and Volume Simulation
  useEffect(() => {
    let statsTimer: NodeJS.Timeout | null = null;
    if (connectionState === 'connected') {
      statsTimer = setInterval(() => {
        // Base numbers vary by server criteria
        const baseDownload = selectedServer.type === 'wifi' ? 880 : 710;
        const baseUpload = selectedServer.type === 'wifi' ? 320 : 220;

        // Introduce random slight variances
        const varianceDL = (Math.random() * 100 - 50);
        const varianceUL = (Math.random() * 40 - 20);

        const activeDL = Math.max(0, baseDownload + varianceDL);
        const activeUL = Math.max(0, baseUpload + varianceUL);

        setStats((prev) => ({
          downloadSpeed: activeDL,
          uploadSpeed: activeUL,
          // Calculate volume increments (Mbps -> MB divided by 8, accumulated per second)
          totalDownloaded: prev.totalDownloaded + (activeDL / 80),
          totalUploaded: prev.totalUploaded + (activeUL / 80),
          pingTime: selectedServer.ping + Math.floor(Math.random() * 5 - 2),
          sessionDuration: prev.sessionDuration + 1
        }));
      }, 1000);
    } else if (connectionState === 'disconnected') {
      setStats({
        downloadSpeed: 0,
        uploadSpeed: 0,
        totalDownloaded: 0,
        totalUploaded: 0,
        pingTime: selectedServer.ping,
        sessionDuration: 0
      });
    }

    return () => {
      if (statsTimer) clearInterval(statsTimer);
    };
  }, [connectionState, selectedServer]);

  // Whitelist mutations
  const handleAddRule = (domain: string, notes: string) => {
    const newRule: WhitelistRule = {
      id: Date.now().toString(),
      domain,
      addedAt: new Date().toISOString().split('T')[0],
      isActive: true,
      notes
    };
    setRules((prev) => [newRule, ...prev]);
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Rendering individual tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'quick':
        return (
          <QuickConnect
            connectionState={connectionState}
            selectedServer={selectedServer}
            stats={stats}
            protocol={protocol}
            setProtocol={setProtocol}
            onToggleConnection={handleToggleConnection}
          />
        );
      case 'wifi':
        return (
          <WifiShield
            servers={INITIAL_SERVERS}
            selectedServer={selectedServer}
            connectionState={connectionState}
            onSelectServer={handleSelectServer}
            onConnect={handleToggleConnection}
          />
        );
      case 'whitelist':
        return (
          <WhitelistManager
            servers={INITIAL_SERVERS}
            selectedServer={selectedServer}
            rules={rules}
            connectionState={connectionState}
            onSelectServer={handleSelectServer}
            onAddRule={handleAddRule}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
          />
        );
      case 'stats':
        return (
          <SpeedCharts
            connectionState={connectionState}
            selectedServer={selectedServer}
            stats={stats}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-garcha-dark text-slate-100 font-sans flex flex-col justify-between pb-16 lg:pb-0">
      {/* Dynamic Security Ribbon (Visual top alert on connection) */}
      <div className={`text-center py-1.5 px-4 text-[10px] md:text-xs font-semibold flex items-center justify-center gap-2 select-none transition-colors duration-500 overflow-hidden ${
        connectionState === 'connected'
          ? 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20'
          : connectionState === 'connecting'
          ? 'bg-amber-500/10 text-amber-400 border-b border-amber-500/20 animate-pulse'
          : 'bg-red-500/5 text-red-400 border-b border-red-500/10'
      }`}>
        <Lock className="h-3 w-3" />
        {connectionState === 'connected' ? (
          <span>СКВОЗНОЕ ШИФРОВАНИЕ GARCHA АКТИВНО. ВАШ НАСТОЯЩИЙ IP СКРЫТ ОТ ПРОВАЙДЕРОВ.</span>
        ) : connectionState === 'connecting' ? (
          <span>СОГЛАСОВАНИЕ КАНАЛА REKEYING В ПРОЦЕССЕ... ПОЖАЛУЙСТА, ПОДОЖДИТЕ.</span>
        ) : (
          <span>ВНИМАНИЕ: СОЕДИНЕНИЕ ОТКРЫТО. РЕКАЛИБРУЙТЕ ЗАЩИТУ ДЛЯ ПРЕДОТВРАЩЕНИЯ СНИФФИНГА ПАКЕТОВ.</span>
        )}
      </div>

      {/* Primary Top Header */}
      <Header
        connectionState={connectionState}
        selectedServer={selectedServer}
        duration={duration}
        protocol={protocol}
        ipAddress={ipAddress}
      />

      {/* Main Core Full-Stack Mock Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto md:p-6 pb-24 lg:pb-6 gap-6">
        {/* Navigation Sidebar panel */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} connectionState={connectionState} />

        {/* Dynamic active viewport panel */}
        <main className="flex-1 min-w-0 px-4 md:px-0 mt-4 md:mt-0">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-garcha-card/40 border border-garcha-border/50 p-4 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {activeTab === 'quick' && 'Главаный Пульт'}
                {activeTab === 'wifi' && 'Ассистент Wi-Fi Точек'}
                {activeTab === 'whitelist' && 'Конфигурация Обхода Маршрутов'}
                {activeTab === 'stats' && 'Анализ Потока Шифрования'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'quick' && 'Интегральный мониторинг, соединение в один клик и спидометр.'}
                {activeTab === 'wifi' && 'Поиск и защита слабых хотспотов, бесплатных сетей и корпоративных линий.'}
                {activeTab === 'whitelist' && 'Настройка прямого трафика для банков и проксирование для заблокированных ресурсов.'}
                {activeTab === 'stats' && 'Графики задержки, HANDSHAKE логи, верификация пакетов в консоли.'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-garcha-dark px-3 py-1.5 rounded-xl border border-garcha-border/50 text-xs">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-400">Шлюз: </span>
              <span className="text-white font-semibold">{selectedServer.countryCode}</span>
            </div>
          </div>

          <div className="transition-all duration-300">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Mini App Footer */}
      <footer className="hidden lg:block bg-garcha-card border-t border-garcha-border py-4 text-center text-[11px] text-slate-500 font-mono">
        <div>
          GARCHAVPN Client Desktop Suite © {new Date().getFullYear()} — Защита военных стандартов (AES-256-GCM / WireGuard v2).
        </div>
      </footer>
    </div>
  );
}
