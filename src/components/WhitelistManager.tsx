import React, { useState } from 'react';
import { Layers, Plus, Trash2, Check, RefreshCw, Server, AlertCircle, ShieldAlert, Globe, HelpCircle, ToggleLeft, ToggleRight, Radio } from 'lucide-react';
import { VPNServer, WhitelistRule, ConnectionState } from '../types';

interface WhitelistManagerProps {
  servers: VPNServer[];
  selectedServer: VPNServer;
  rules: WhitelistRule[];
  connectionState: ConnectionState;
  onSelectServer: (server: VPNServer) => void;
  onAddRule: (domain: string, notes: string) => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

export default function WhitelistManager({
  servers,
  selectedServer,
  rules,
  connectionState,
  onSelectServer,
  onAddRule,
  onToggleRule,
  onDeleteRule
}: WhitelistManagerProps) {
  const [newDomain, setNewDomain] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [tunnelMode, setTunnelMode] = useState<'bypass_mode' | 'tunnel_mode'>('bypass_mode'); // bypass_mode = only whitelisted go via VPN, tunnel_mode = all go via VPN except whitelisted
  const [testDomain, setTestDomain] = useState('telegram.org');
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'vpn' | 'direct';
    nodeName: string;
    details: string;
    log: string;
  }>({
    status: 'idle',
    nodeName: '',
    details: '',
    log: ''
  });

  const whitelistServers = servers.filter((s) => s.type === 'whitelist');

  const handleSubmitRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    
    // Quick sanitization
    let cleanDomain = newDomain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    onAddRule(cleanDomain, newNotes.trim() || 'Пользовательское правило');
    setNewDomain('');
    setNewNotes('');
  };

  const handleTestRoute = () => {
    setTestResult((prev) => ({ ...prev, status: 'testing', log: 'Определяем таблицы маршрутизации...' }));
    
    setTimeout(() => {
      let cleanTest = testDomain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
      const rule = rules.find((r) => r.domain === cleanTest || cleanTest.endsWith('.' + r.domain));
      const ruleActive = rule && rule.isActive;

      let isViaVPN = false;

      // Logic:
      // In bypass_mode (обходной): only active whitelisted sites go via VPN
      // In tunnel_mode (стандартный): all sites go via VPN EXCEPT active whitelisted sites
      if (tunnelMode === 'bypass_mode') {
        isViaVPN = ruleActive;
      } else {
        isViaVPN = !ruleActive;
      }

      // If VPN overall is turned off, then absolutely everything is direct
      const activeState = connectionState === 'connected';
      const actualViaVPN = activeState && isViaVPN;

      if (actualViaVPN) {
        setTestResult({
          status: 'vpn',
          nodeName: selectedServer.name,
          details: `Зашифровано через узел (${selectedServer.flag} ${selectedServer.country}). Виртуальный IP: ${selectedServer.ip}`,
          log: `[МАРШРУТ]: ${cleanTest} -> [GARCHAVPN TUNNEL] -> ${selectedServer.ip}`
        });
      } else {
        setTestResult({
          status: 'direct',
          nodeName: 'Прямое Подключение (Провайдер)',
          details: activeState && ruleActive && tunnelMode === 'tunnel_mode'
            ? 'Сайт находится в исключениях белого списка при стандартном туннеле. Загружен напрямую.'
            : activeState && !ruleActive && tunnelMode === 'bypass_mode'
            ? 'Сайт не включен в белый список при обходном режиме. Загружен напрямую.'
            : 'VPN отключен в клиенте. Трафик идет через открытый канал провайдера.',
          log: `[МАРШРУТ]: ${cleanTest} -> [DIRECT ROUTE] -> Прямой IP шлюз`
        });
      }
    }, 800);
  };

  return (
    <div id="whitelist-manager-tab" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Column 1: Rules Config & Tester */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        
        {/* Whitelist Rules Table Container */}
        <div className="bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-garcha-border/50 pb-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold">СПЕЦИФИКАЦИЯ МАРШРУТОВ</span>
              <h3 className="text-lg font-bold text-white mt-1">Редактор Белых Списков</h3>
              <p className="text-xs text-slate-400">
                Добавляйте доменные адреса сайтов, чтобы настроить обход блокировок и умное распределение скорости.
              </p>
            </div>

            {/* Tunnel Mode Switcher Buttons */}
            <div className="flex bg-garcha-dark p-1 rounded-xl border border-garcha-border/60 shrink-0 self-start">
              <button
                id="bypass-mode-toggle-button"
                onClick={() => setTunnelMode('bypass_mode')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  tunnelMode === 'bypass_mode'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Обходной (Split)
              </button>
              <button
                id="tunnel-mode-toggle-button"
                onClick={() => setTunnelMode('tunnel_mode')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  tunnelMode === 'tunnel_mode'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Стандартный
              </button>
            </div>
          </div>

          {/* Detailed helper text based on selected mode */}
          <div className="bg-garcha-dark/40 border border-garcha-border/50 p-4 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              {tunnelMode === 'bypass_mode' ? (
                <span>
                  <strong>Режим Обхода:</strong> Через VPN пойдут <strong className="text-cyan-400">только те сайты</strong>, которые включены и активированы в списке ниже. Весь глобальный фоновый трафик компьютера идет напрямую через провайдера без потери пинга.
                </span>
              ) : (
                <span>
                  <strong>Стандартный Режим:</strong> Весь входящий и исходящий трафик компьютера направляется в шифрованное VPN-облако <strong className="text-cyan-400">за исключением</strong> сайтов, добавленных в список ниже. Полный режим невидимки с быстрой локальной загрузкой.
                </span>
              )}
            </div>
          </div>

          {/* Add New Rule Form Inline */}
          <form onSubmit={handleSubmitRule} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-garcha-dark/60 p-4 rounded-2xl border border-garcha-border/40">
            <div className="md:col-span-5">
              <input
                id="new-domain-input"
                type="text"
                required
                placeholder="домен (e.g. yandex.ru)"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full bg-garcha-dark border border-garcha-border rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <div className="md:col-span-5">
              <input
                id="new-domain-notes-input"
                type="text"
                placeholder="краткое примечание (необязательно)"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-garcha-dark border border-garcha-border rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="md:col-span-2">
              <button
                id="add-rule-submit-button"
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Добавить</span>
              </button>
            </div>
          </form>

          {/* Rules List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] text-slate-500 font-mono uppercase border-b border-garcha-border/50">
                <tr>
                  <th className="py-3 px-2">Ресурс / Домен</th>
                  <th className="py-3 px-2">Назначение</th>
                  <th className="py-3 px-2">Добавлено</th>
                  <th className="py-3 px-2 text-center">Статус</th>
                  <th className="py-3 px-2 text-center">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-garcha-border/30">
                {rules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                      Список правил маршрутизации пуст. Добавьте первый домен выше.
                    </td>
                  </tr>
                ) : (
                  rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-800/10 transition duration-150">
                      <td className="py-3.5 px-2 font-mono font-semibold text-white truncate max-w-[180px]">
                        {rule.domain}
                      </td>
                      <td className="py-3.5 px-2 text-slate-400 truncate max-w-[180px]">
                        {rule.notes}
                      </td>
                      <td className="py-3.5 px-2 text-slate-500 font-mono">
                        {rule.addedAt}
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <button
                          id={`toggle-rule-btn-${rule.id}`}
                          onClick={() => onToggleRule(rule.id)}
                          className="mx-auto block focus:outline-none cursor-pointer"
                        >
                          {rule.isActive ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full select-none">
                              АКТИВНО
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-500 border border-slate-700/50 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full select-none">
                              ИГНОР
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <button
                          id={`delete-rule-btn-${rule.id}`}
                          onClick={() => onDeleteRule(rule.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                          title="Удалить домен"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Checker Panel */}
        <div className="bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-garcha-border/40 pb-3">
            <Radio className="h-5 w-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Интерактивный Сканер Маршрута</h4>
          </div>

          <p className="text-xs text-slate-400">
            Введите адрес и проверьте, пойдет ли к нему пакет через шифрованный узел GARCHAVPN при текущих настройках белого списка.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="test-route-domain-input"
              type="text"
              placeholder="youtube.com"
              value={testDomain}
              onChange={(e) => setTestDomain(e.target.value)}
              className="flex-1 bg-garcha-dark border border-garcha-border rounded-xl py-2 px-4 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              id="test-route-check-button"
              onClick={handleTestRoute}
              className="bg-garcha-lightcard hover:bg-slate-800 border border-garcha-border text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              Проверить трассировку
            </button>
          </div>

          {/* Test Outcomes */}
          {testResult.status !== 'idle' && (
            <div className="bg-garcha-dark/50 border border-garcha-border/60 p-4 rounded-xl flex flex-col gap-2 font-mono text-xs text-slate-300">
              {testResult.status === 'testing' ? (
                <div className="flex items-center gap-2 text-amber-500 py-1.5 animate-pulse">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Имитируем отправку ICMP пакетов и сверяем правила...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-garcha-border/40 pb-2">
                    <span className="text-xs text-slate-500">Цель: {testDomain}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      testResult.status === 'vpn'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                    }`}>
                      {testResult.status === 'vpn' ? 'VPN ТРАНЗИТ' : 'ПРЯМОЙ ДОСТУП'}
                    </span>
                  </div>
                  <div className="text-white font-semibold text-xs mt-1">{testResult.nodeName}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{testResult.details}</p>
                  <div className="bg-garcha-dark/90 text-green-400 p-2.5 rounded-lg border border-garcha-border/40 text-[10px] font-mono mt-1">
                    {testResult.log}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Column 2: Specialized Whitelist Servers */}
      <div className="xl:col-span-4 flex flex-col gap-4 bg-garcha-card border border-garcha-border rounded-3xl p-6 shadow-xl h-fit">
        <div className="flex items-center justify-between border-b border-garcha-border/30 pb-3">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase font-bold font-mono">УЗЛЫ БЕЛЫХ СПИСКОВ</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Маршрутизаторы</h4>
          </div>
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase tracking-wider font-semibold font-mono px-2 py-0.5 rounded">
            Split-Tunnel
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Специализированные шлюзы, оптимизированные под моментальную обработку сотен доменных правил с минимальным кэшированием DNS.
        </p>

        {/* Server cards vertical */}
        <div className="flex flex-col gap-3">
          {whitelistServers.map((s) => {
            const isSelected = selectedServer.id === s.id;
            return (
              <button
                key={s.id}
                id={`whitelist-server-${s.id}`}
                onClick={() => onSelectServer(s)}
                className={`w-full group text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                    : 'bg-garcha-dark/40 border-garcha-border/60 hover:bg-slate-800/10 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl filter drop-shadow select-none shrink-0">{s.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{s.name}</span>
                      {isSelected && (
                        <div className="h-2 w-2 bg-cyan-400 rounded-full shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">{s.ip}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-xs font-bold font-mono text-slate-300">{s.ping} мс</span>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase font-semibold">Нагрузка: {s.load}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
