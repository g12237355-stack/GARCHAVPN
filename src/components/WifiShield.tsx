import React, { useState, useEffect } from 'react';
import { Wifi, ShieldAlert, ShieldCheck, RefreshCw, Server, Info, Search, ShieldCheck as SecureIcon, Target, Cpu } from 'lucide-react';
import { VPNServer, ConnectionState } from '../types';

interface WifiShieldProps {
  servers: VPNServer[];
  selectedServer: VPNServer;
  connectionState: ConnectionState;
  onSelectServer: (server: VPNServer) => void;
  onConnect: () => void;
}

export default function WifiShield({
  servers,
  selectedServer,
  connectionState,
  onSelectServer,
  onConnect
}: WifiShieldProps) {
  const [wifiName, setWifiName] = useState('Public_Airport_WiFi_Free');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'unchecked' | 'scanning' | 'vulnerable' | 'secured';
    dnsLeak: boolean;
    mitmRisk: boolean;
    encryption: string;
    score: number;
    logs: string[];
  }>({
    status: 'unchecked',
    dnsLeak: true,
    mitmRisk: true,
    encryption: 'WPA2 AES (No Auth)',
    score: 35,
    logs: []
  });

  const wifiServers = servers.filter((s) => s.type === 'wifi');

  // If connection starts while scanned, we can automatically adjust status
  useEffect(() => {
    if (connectionState === 'connected' && selectedServer.type === 'wifi') {
      setScanResult((prev) => ({
        ...prev,
        status: 'secured',
        score: 100,
        dnsLeak: false,
        mitmRisk: false,
        encryption: 'AES-256 + GARCHA Tunnel v2'
      }));
    } else if (connectionState === 'disconnected' && scanResult.status === 'secured') {
      setScanResult((prev) => ({
        ...prev,
        status: 'vulnerable',
        score: 35,
        dnsLeak: true,
        mitmRisk: true,
        encryption: 'WPA2 AES (No Auth)'
      }));
    }
  }, [connectionState, selectedServer]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult((prev) => ({ ...prev, status: 'scanning', logs: [] }));

    const steps = [
      `Инициализация сканирования интерфейса Wi-Fi [${wifiName}]...`,
      'Перехват ARP пакетов для проверки Spoofing атак...',
      'Анализ DNS серверов провайдера на предмет скрытой утечки...',
      'Проверка наличия клонированных фальшивых точек (Evil Twin)...',
      'Оценка силы текущего шифрования трафика...',
      'Формирование отчета безопасности...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanResult((prev) => ({
          ...prev,
          logs: [...prev.logs, steps[currentStep]]
        }));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        const isProtectedByGarcha = connectionState === 'connected' && selectedServer.type === 'wifi';
        setScanResult({
          status: isProtectedByGarcha ? 'secured' : 'vulnerable',
          dnsLeak: !isProtectedByGarcha,
          mitmRisk: !isProtectedByGarcha,
          encryption: isProtectedByGarcha ? 'AES-256 + GARCHA Tunnel v2' : 'WPA2 AES (No Auth / Открытая сеть)',
          score: isProtectedByGarcha ? 100 : 35,
          logs: [...steps, 'Аудит завершен успешно. Сформированы рекомендации.']
        });
      }
    }, 600);
  };

  return (
    <div id="wifi-shield-tab" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Column 1: Auditor Tool */}
      <div className="xl:col-span-7 flex flex-col gap-6 bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-1 border-b border-garcha-border/50 pb-4">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">WI-FI АУДИТОР</span>
          <h3 className="text-lg font-bold text-white">Сканирование Общественных Сетей</h3>
          <p className="text-xs text-slate-400">
            Проверьте, защищена ли ваша общественная точка Wi-Fi от кражи паролей и перехвата сессии.
          </p>
        </div>

        {/* Input area */}
        <div className="bg-garcha-dark/50 border border-garcha-border/60 p-5 rounded-2xl flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 font-mono">
              Имя вашей текущей Wi-Fi сети (SSID):
            </label>
            <div className="relative">
              <Wifi className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
              <input
                id="wifi-hotspot-ssid-input"
                type="text"
                placeholder="Например, Subway_Free_WiFi"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                disabled={isScanning}
                className="w-full bg-garcha-dark border border-garcha-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          <button
            id="garcha-wifi-scan-button"
            onClick={handleStartScan}
            disabled={isScanning || !wifiName.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Идет глубокий технический анализ...</span>
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                <span>Проверить безопасность сети</span>
              </>
            )}
          </button>
        </div>

        {/* Diagnostic Logs & Outcome */}
        {scanResult.status !== 'unchecked' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">РЕЗУЛЬТАТЫ СКАНИРОВАНИЯ:</h4>
            
            {/* Interactive Status banner */}
            {scanResult.status === 'scanning' ? (
              <div className="bg-amber-500/5 border border-dashed border-amber-500/40 p-5 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-amber-500 animate-spin" />
                  <div>
                    <h5 className="text-sm font-semibold text-amber-400">Диагностика структуры пакетов...</h5>
                    <p className="text-xs text-slate-400">Проверяем таблицы ARP роутера</p>
                  </div>
                </div>
                {/* Simulated Log panel */}
                <div className="bg-garcha-dark/80 rounded-xl p-3 border border-garcha-border/40 font-mono text-[11px] text-green-400 h-32 overflow-y-auto">
                  {scanResult.logs.map((log, id) => (
                    <div key={id} className="pb-1">
                      <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                  <div className="animate-pulse">_</div>
                </div>
              </div>
            ) : scanResult.status === 'secured' ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <SecureIcon className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h5 className="text-sm font-bold text-emerald-400">ТОЧКА ПОЛНОСТЬЮ ЗАЩИЩЕНА VPN ТУННЕЛЕМ</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Весь трафик сети <strong className="text-white">"{wifiName}"</strong> инкапсулирован через узел <strong className="text-white">{selectedServer.name}</strong>. Все уязвимости устранены.
                  </p>
                </div>
                <div className="bg-garcha-dark text-emerald-400 border border-emerald-500/30 font-mono font-bold px-3 py-1.5 rounded-full text-sm">
                  100% / Безопасно
                </div>
              </div>
            ) : (
              <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 animate-pulse-glow">
                <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-8 w-8 text-red-500" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h5 className="text-sm font-bold text-red-400">КРИТИЧЕСКИЕ УЯЗВИМОСТИ ОБНАРУЖЕНЫ</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Обнаружены риски атаки "Человек посередине" (MitM) и утечки DNS. Настоятельно рекомендуем включить шифрование GARCHAVPN.
                  </p>
                </div>
                <div className="bg-garcha-dark text-red-400 border border-red-500/30 font-mono font-bold px-3 py-1.5 rounded-full text-sm">
                  35% / Высокий риск
                </div>
              </div>
            )}

            {/* Security checklist grid */}
            {scanResult.status !== 'scanning' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-garcha-dark/30 border border-garcha-border/40 p-3 rounded-xl flex items-center gap-3">
                  {scanResult.dnsLeak ? (
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                  ) : (
                    <SecureIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 font-mono">Утечка DNS</div>
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {scanResult.dnsLeak ? 'Угроза обнаружена' : 'Утечки устранены'}
                    </div>
                  </div>
                </div>

                <div className="bg-garcha-dark/30 border border-garcha-border/40 p-3 rounded-xl flex items-center gap-3">
                  {scanResult.mitmRisk ? (
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                  ) : (
                    <SecureIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 font-mono">Перехват данных (MitM)</div>
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {scanResult.mitmRisk ? 'Высокая вероятность' : 'Заглушено кодом'}
                    </div>
                  </div>
                </div>

                <div className="bg-garcha-dark/30 border border-garcha-border/40 p-3 rounded-xl flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 font-mono">Метод Шифрования</div>
                    <div className="text-xs font-semibold text-slate-200 truncate">{scanResult.encryption}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick recommendation action */}
            {scanResult.status === 'vulnerable' && connectionState === 'disconnected' && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl flex items-center justify-between text-xs gap-4">
                <span className="text-slate-300">Включите специализированный Wi-Fi сервер GARCHA для защиты.</span>
                <button
                  onClick={onConnect}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-lg font-bold transition shrink-0 cursor-pointer"
                >
                  Защитить сеть
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Column 2: Servers List */}
      <div className="xl:col-span-5 flex flex-col gap-4 bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-garcha-border/30 pb-3">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">WI-FI СЕРВЕРА</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Рекомендованные узлы</h4>
          </div>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] uppercase tracking-wider font-semibold font-mono px-2 py-0.5 rounded">
            Hotspots
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-2">
          Эти сервера реализуют двойное туннелирование трафика и симулируют локальный WPA3-шифратор прямо в клиенте для общественных точек.
        </p>

        {/* Server Cards scrollable container */}
        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
          {wifiServers.map((s) => {
            const isSelected = selectedServer.id === s.id;
            return (
              <button
                key={s.id}
                id={`server-card-${s.id}`}
                onClick={() => onSelectServer(s)}
                className={`w-full group text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                    : 'bg-garcha-dark/40 border-garcha-border/60 hover:bg-slate-800/20 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl filter drop-shadow select-none shrink-0">{s.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{s.name}</span>
                      {isSelected && (
                        <div className="h-2 w-2 bg-amber-500 rounded-full shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{s.ip}</span>
                      <span>•</span>
                      <span>{s.speed}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="text-xs font-bold text-slate-300 font-mono">{s.ping} мс</div>
                  <div className="flex items-center gap-1.5 mt-1 select-none">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.load < 40 ? 'bg-emerald-500' : s.load < 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${s.load}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">{s.load}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
