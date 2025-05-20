import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceStatus, LocationData } from '../types';
import { mockDeviceStatus, getCurrentLocation, simulateLocationUpdate } from '../mocks/deviceData';

interface DeviceState {
  deviceStatus: DeviceStatus;
  currentLocation: LocationData;
  locationHistory: LocationData[];
  isTracking: boolean;
  audioLevel: number;
  isAudioEnabled: boolean;
  
  // Actions
  connectDevice: () => void;
  disconnectDevice: () => void;
  updateLocation: () => void;
  toggleTracking: () => void;
  toggleAudio: () => void;
  simulateAudioLevel: () => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      deviceStatus: { ...mockDeviceStatus },
      currentLocation: getCurrentLocation(),
      locationHistory: [],
      isTracking: false,
      audioLevel: 0,
      isAudioEnabled: false,
      
      connectDevice: () => set((state) => ({
        deviceStatus: {
          ...state.deviceStatus,
          isConnected: true,
          lastSeen: new Date().toISOString(),
        }
      })),
      
      disconnectDevice: () => set((state) => ({
        deviceStatus: {
          ...state.deviceStatus,
          isConnected: false,
          lastSeen: new Date().toISOString(),
        }
      })),
      
      updateLocation: () => {
        const newLocation = simulateLocationUpdate();
        set((state) => ({
          currentLocation: newLocation,
          locationHistory: [...state.locationHistory.slice(-19), newLocation],
        }));
      },
      
      toggleTracking: () => set((state) => ({ isTracking: !state.isTracking })),
      
      toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),
      
      simulateAudioLevel: () => set({ audioLevel: Math.random() * 100 }),
    }),
    {
      name: 'device-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isTracking: state.isTracking,
        isAudioEnabled: state.isAudioEnabled,
      }),
    }
  )
);