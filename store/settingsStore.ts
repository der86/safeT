import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

interface SettingsState extends AppSettings {
  // Actions
  toggleFollowMode: () => void;
  toggleAudioMonitoring: () => void;
  toggleNotifications: () => void;
  toggleVibration: () => void;
  toggleDarkMode: () => void;
  toggleAutoConnect: () => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  followModeEnabled: false,
  audioMonitoringEnabled: false,
  notificationsEnabled: true,
  vibrationEnabled: true,
  darkModeEnabled: true,
  autoConnectEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      toggleFollowMode: () => set((state) => ({
        followModeEnabled: !state.followModeEnabled,
      })),
      
      toggleAudioMonitoring: () => set((state) => ({
        audioMonitoringEnabled: !state.audioMonitoringEnabled,
      })),
      
      toggleNotifications: () => set((state) => ({
        notificationsEnabled: !state.notificationsEnabled,
      })),
      
      toggleVibration: () => set((state) => ({
        vibrationEnabled: !state.vibrationEnabled,
      })),
      
      toggleDarkMode: () => set((state) => ({
        darkModeEnabled: !state.darkModeEnabled,
      })),
      
      toggleAutoConnect: () => set((state) => ({
        autoConnectEnabled: !state.autoConnectEnabled,
      })),
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);