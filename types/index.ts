export interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency: boolean;
}

export interface DeviceStatus {
  batteryLevel: number;
  isConnected: boolean;
  connectionType: 'bluetooth' | 'wifi' | 'none';
  lastSeen: string;
  signalStrength: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number;
  speed: number | null;
}

export interface AppSettings {
  followModeEnabled: boolean;
  audioMonitoringEnabled: boolean;
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
  darkModeEnabled: boolean;
  autoConnectEnabled: boolean;
}