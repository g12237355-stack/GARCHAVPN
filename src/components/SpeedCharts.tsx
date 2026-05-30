import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldCheck, Play, Terminal, HelpCircle, Server, RefreshCw, Layers } from 'lucide-react';
import { ConnectionState, VPNServer, VPNStats } from '../types';

interface SpeedChartsProps {
  connectionState: ConnectionState;
  selectedServer: VPNServer;
  stats: VPNStats;
}

export default function SpeedCharts({
  connectionState,
  selectedServer,
  stats
}: SpeedChartsProps) {
  // Speed history for SVG plotting
  const [downloadHistory, setDownloadHistory] = useState<number[]>(Array(15).fill(0));
  const [uploadHistory, setUploadHistory] = useState<number[]>(Array(15).fill(0));
  
  // Realtime log lines
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'GARCHA Core client initialized.',
    'Ready for secure tunnels...'
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Sync speed history
  useEffect(() => {
    if (connectionState === 'connected') {
      setDownloadHistory((prev) => [...prev.slice(1), stats.downloadSpeed]);
      setUploadHistory((prev) => [...prev.slice(1), stats.uploadSpeed]);
    } else {
      setDownloadHistory((prev) => [...prev.slice(1), 0]);
      setUploadHistory((prev) => [...prev.slice(1), 0]);
    }
  }, [stats.downloadSpeed, stats.uploadSpeed, connectionState]);

  // Simulate periodic console events
  useEffect(() => {
    if (connectionState !== 'connected') return;

    const phrases = [
      'Handshake completed. Sending Keep-Alive chunk...',
      'Latency calibration: Jitter < 1.4ms optimal',
      'Encrypted tunnel payload verified. Checksums match.',
      'DNS leak protection audit: 100% SECURED.',
      'Routing tables updated. Splitting Whitelist nodes.',
      'Bypasser filter checked. Policy payload updated.',
      'Wi-Fi MitM scanner completed high-level port analysis.',
      'TCP handshake fastopen negotiated successfully.'
    ];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * phrases.length);
      const timestamp = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [...prev, `[${timestamp}] ${phrases[idx]}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, [connectionState]);

  // Auto-push handshake logs when state changes
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    if (connectionState === 'connecting') {
      setConsoleLogs((prev) => [
        ...prev,
        `[${timestamp}] Инициализация шлюза к ${selectedServer.name}...`,
        `[${timestamp}] Согласование ключей Диффи-Хеллмана (CURVE25519)...`,
        `[${timestamp}] Запрос виртуального IP адреса на узле...`
      ]);
    } else if (connectionState === 'connected') {
      setConsoleLogs((prev) => [
        ...prev,
        `[${timestamp}] Туннель GARCHAVPN успешно установлен!`,
        `[${timestamp}] Виртуальный IP: ${selectedServer.ip}`,
        `[${timestamp}] Включен шлюз защиты: ${selectedServer.type === 'wifi' ? 'Wi-Fi Hotspot Shield' : 'Split Whitelist Bypass'}`
      ]);
    } else if (connectionState === 'disconnected') {
      setConsoleLogs((prev) => [
        ...prev,
        `[${timestamp}] Разрыв безопасного туннеля пользователем.`,
        `[${timestamp}] Очистка временных таблиц маршрутизации IP.`,
        `[${timestamp}] Трафик перенаправлен на шлюз провайдера напрямую.`
      ]);
    }
  }, [connectionState]);

  // Scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Convert array data to SVG Polyline string
  const getPolylinePath = (data: number[], maxVal: number) => {
    const scaleY = 70; // Map range to SVG viewBox height
    const scaleX = 20; // Distance between points
    return data
      .map((val, idx) => {
        const x = idx * scaleX;
        const normalizedVal = Math.min(val, maxVal);
        const y = 80 - (normalizedVal / maxVal) * scaleY;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const maxVal = 1200; // max Mbps speed
  const dlPath = getPolylinePath(downloadHistory, maxVal);
  const ulPath = getPolylinePath(uploadHistory, maxVal);

  return (
    <div id="analytics-stats-tab" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Column 1: Speed Graph Visualizer */}
      <div className="xl:col-span-8 bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-garcha-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Телеметрия Скорости Сети</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 bg-cyan-400 rounded-full" />
              <span className="text-slate-400">Входящий</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 bg-indigo-500 rounded-full" />
              <span className="text-slate-400">Исходящий</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Динамический график пропускной способности VPN-канала в реальном времени. Измерение производится в Мбит/с.
        </p>

        {/* Custom SVG Graph */}
        <div className="bg-garcha-dark/60 border border-garcha-border/40 p-4 rounded-2xl relative overflow-hidden flex-1 min-h-[220px] flex items-center justify-center">
          {connectionState !== 'connected' && (
            <div className="absolute inset-0 bg-garcha-dark/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center select-none">
              <Activity className="h-10 w-10 text-slate-600 animate-pulse mb-2" />
              <h5 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">ПОТОК ПАКЕТОВ ОТКЛЮЧЕН</h5>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                Подключитесь к VPN для запуска потоковых датчиков и замера пропускной способности.
              </p>
            </div>
          )}

          {/* SVG Canvas for charting */}
          <svg
            viewBox="0 0 280 90"
            className="w-full h-full min-h-[160px] text-cyan-400 font-mono select-none"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <line x1="0" y1="20" x2="280" y2="20" stroke="#101827" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="0" y1="45" x2="280" y2="45" stroke="#101827" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="0" y1="70" x2="280" y2="70" stroke="#101827" strokeWidth="0.5" strokeDasharray="2,2" />

            {/* Left Speed Labels */}
            <text x="2" y="15" fill="#4B5563" fontSize="4">1.2 Gbps</text>
            <text x="2" y="42" fill="#4B5563" fontSize="4">600 Mbps</text>
            <text x="2" y="68" fill="#4B5563" fontSize="4">10 Mbps</text>

            {/* Shaded area profiles */}
            {connectionState === 'connected' && (
              <>
                <polygon
                  points={`0,90 ${dlPath} 280,90`}
                  fill="url(#dlGrad)"
                  opacity="0.15"
                />
                <polygon
                  points={`0,90 ${ulPath} 280,90`}
                  fill="url(#ulGrad)"
                  opacity="0.1"
                />
              </>
            )}

            {/* Lines plotted */}
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              points={dlPath}
              className="transition-all duration-300"
            />
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="1"
              points={ulPath}
              className="transition-all duration-300"
            />

            <defs>
              <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Column 2: Diagnostic Handshake Logs Console */}
      <div className="xl:col-span-4 bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-garcha-border/50 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Отладочная Консоль</h4>
          </div>
          <button
            id="clear-logs-consoles-btn"
            onClick={() => setConsoleLogs([`[${new Date().toLocaleTimeString()}] Консоль очищена.`])}
            className="text-[10px] text-slate-400 hover:text-white underline font-mono cursor-pointer"
          >
            Очистить
          </button>
        </div>

        {/* Simulated logs container */}
        <div
          ref={logContainerRef}
          className="bg-black/80 border border-garcha-border/50 rounded-2xl p-4 font-mono text-[10px] text-emerald-400 h-[220px] overflow-y-auto flex flex-col gap-1.5 scroll-smooth"
        >
          {consoleLogs.map((log, index) => (
            <div key={index} className="line-clamp-2 leading-relaxed">
              <span className="text-cyan-500/80">root@garchavpn:# </span>
              {log}
            </div>
          ))}
          {connectionState === 'connecting' && (
            <div className="text-amber-400 flex items-center gap-1 font-bold animate-pulse">
              <span>&#62; Перераспределение портов... ...</span>
            </div>
          )}
        </div>

        {/* Quick parameters grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-garcha-dark/30 border border-garcha-border/40 p-3.5 rounded-xl">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase font-mono text-slate-500">Потери пакетов</span>
            <span className="text-white font-mono font-bold">
              {connectionState === 'connected' ? '0.00% (Идеально)' : '0.00%'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase font-mono text-slate-500">Стабильность</span>
            <span className="text-white font-mono font-bold">
              {connectionState === 'connected' ? '99.98% / TLS v1.3' : '---%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
