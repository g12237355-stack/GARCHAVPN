export type ServerType = 'wifi' | 'whitelist';

export interface VPNServer {
  id: string;
  name: string;
  type: ServerType;
  country: string;
  countryCode: string;
  flag: string;
  load: number; // percentage 0-100
  ping: number; // ms
  speed: string; // e.g. "950 Mbps"
  ip: string;
  secureFeatures: string[];
}

export interface WhitelistRule {
  id: string;
  domain: string;
  addedAt: string;
  isActive: boolean;
  notes?: string;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export type VPNProtocol = 'WireGuard' | 'OpenVPN' | 'GARCHA-Stealth';

export interface VPNStats {
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  totalDownloaded: number; // in MB
  totalUploaded: number; // in MB
  pingTime: number; // in ms
  sessionDuration: number; // in seconds
}
