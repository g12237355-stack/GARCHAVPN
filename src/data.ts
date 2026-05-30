import { VPNServer, WhitelistRule } from './types';

export const INITIAL_SERVERS: VPNServer[] = [
  // WI-FI Protection Servers
  {
    id: 'wifi-de-01',
    name: 'Wi-Fi Shield - Frankfurt Core 1',
    type: 'wifi',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    load: 42,
    ping: 18,
    speed: '960 Mbps',
    ip: '185.190.140.42',
    secureFeatures: ['Double Encryption', 'Wi-Fi MitM Shield', 'DNS Leak Protection', 'Auto-Disconnect Safeguard']
  },
  {
    id: 'wifi-nl-02',
    name: 'Wi-Fi Shield - Amsterdam SafePort',
    type: 'wifi',
    country: 'Netherlands',
    countryCode: 'NL',
    flag: '🇳🇱',
    load: 58,
    ping: 25,
    speed: '1.2 Gbps',
    ip: '194.102.25.101',
    secureFeatures: ['WPA3 Simulation', 'Public Hotspot Armor', 'Malware Blocker', 'Strict No-Logs Policy']
  },
  {
    id: 'wifi-fi-03',
    name: 'Wi-Fi Shield - Helsinki NordTunnel',
    type: 'wifi',
    country: 'Finland',
    countryCode: 'FI',
    flag: '🇫🇮',
    load: 31,
    ping: 32,
    speed: '890 Mbps',
    ip: '82.161.94.12',
    secureFeatures: ['RAM-Only Core', 'Public Defender Suite', 'DNS Security Boost', 'Anti-Replay Attack Protection']
  },
  {
    id: 'wifi-us-04',
    name: 'Wi-Fi Shield - New York CafeGuard',
    type: 'wifi',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    load: 72,
    ping: 85,
    speed: '1.1 Gbps',
    ip: '104.244.75.29',
    secureFeatures: ['Airport Hotspot Protection', 'Wi-Fi Firefall', 'IPv6 Leak Shield']
  },

  // Whitelist-Only / Split-Tunneling Servers
  {
    id: 'wl-se-01',
    name: 'Whitelist Core - Stockholm Stealth',
    type: 'whitelist',
    country: 'Sweden',
    countryCode: 'SE',
    flag: '🇸🇪',
    load: 22,
    ping: 28,
    speed: '1.0 Gbps',
    ip: '193.180.119.5',
    secureFeatures: ['Split-Tunneling Optimized', 'Censorship Bypass Mode', 'Static IP Routing', 'Direct Whitelist Gate']
  },
  {
    id: 'wl-ch-02',
    name: 'Whitelist Core - Geneva Alpine Route',
    type: 'whitelist',
    country: 'Switzerland',
    countryCode: 'CH',
    flag: '🇨🇭',
    load: 18,
    ping: 21,
    speed: '850 Mbps',
    ip: '109.202.107.82',
    secureFeatures: ['Strict Swiss Privacy Routing', 'Multi-Hop Whitelisting', 'Obfuscated Header Filter']
  },
  {
    id: 'wl-sg-03',
    name: 'Whitelist Core - Singapore EdgeNode',
    type: 'whitelist',
    country: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    load: 64,
    ping: 115,
    speed: '920 Mbps',
    ip: '45.118.134.19',
    secureFeatures: ['Geo-Unblocking Engine', 'Smart Whitelist Routing', 'Low Latency TCP FastOpen']
  },
  {
    id: 'wl-gb-04',
    name: 'Whitelist Core - London Bypass Gate',
    type: 'whitelist',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    load: 49,
    ping: 35,
    speed: '1.3 Gbps',
    ip: '85.255.230.155',
    secureFeatures: ['Intelligent Port Whitelisting', 'Bypasser Mode Active', 'DDoS Protection on Gate']
  }
];

export const INITIAL_WHITELIST_RULES: WhitelistRule[] = [
  { id: '1', domain: 'google.com', addedAt: '2026-05-30', isActive: true, notes: 'Для быстрого поиска' },
  { id: '2', domain: 'youtube.com', addedAt: '2026-05-30', isActive: true, notes: 'Просмотр видео без задержек' },
  { id: '3', domain: 'telegram.org', addedAt: '2026-05-30', isActive: true, notes: 'Стабильное подключение мессенджера' },
  { id: '4', domain: 'github.com', addedAt: '2026-05-30', isActive: false, notes: 'Разработка ПО' }
];

export const DEFAULT_WIFI_METRICS = {
  ssid: 'Public_Airport_WiFi_Free',
  signalStrength: 'Strong',
  vulnerabilityStatus: 'Vulnerable', // Vulnerable / Risky / Protected
  encryptionType: 'WPA2 Personal (Insecure for Public)',
  dnsLeakDetected: true,
  ping: 45
};
