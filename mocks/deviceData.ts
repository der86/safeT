import { DeviceStatus, LocationData } from '../types';

export const mockDeviceStatus: DeviceStatus = {
  batteryLevel: 78,
  isConnected: true,
  connectionType: 'bluetooth',
  lastSeen: new Date().toISOString(),
  signalStrength: 85,
};

export const mockLocationHistory: LocationData[] = [
  {
    latitude: 37.7749,
    longitude: -122.4194,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    accuracy: 10,
    speed: 0,
  },
  {
    latitude: 37.7748,
    longitude: -122.4191,
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    accuracy: 8,
    speed: 1.2,
  },
  {
    latitude: 37.7747,
    longitude: -122.4185,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    accuracy: 5,
    speed: 0.8,
  },
  {
    latitude: 37.7750,
    longitude: -122.4180,
    timestamp: new Date().toISOString(),
    accuracy: 4,
    speed: 0,
  },
];

export const getCurrentLocation = (): LocationData => {
  return mockLocationHistory[mockLocationHistory.length - 1];
};

export const simulateLocationUpdate = (): LocationData => {
  const current = getCurrentLocation();
  const randomLat = current.latitude + (Math.random() * 0.001 - 0.0005);
  const randomLng = current.longitude + (Math.random() * 0.001 - 0.0005);
  
  return {
    latitude: randomLat,
    longitude: randomLng,
    timestamp: new Date().toISOString(),
    accuracy: 3 + Math.random() * 5,
    speed: Math.random() * 2,
  };
};