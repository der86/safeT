import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { useDeviceStore } from '../store/deviceStore';
import Colors from '../constants/colors';

// Example for Zustand or similar:
import { create } from 'zustand';

export type SettingsState = {
  // ...other properties
  followModeEnabled: boolean;
  toggleFollowMode: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  followModeEnabled: false,
  toggleFollowMode: () =>
    set((state) => ({ followModeEnabled: !state.followModeEnabled })),
  // ...other properties and methods
}));

export const FollowModeToggle = () => {
  const { toggleTracking, isTracking } = useDeviceStore();
  const { followModeEnabled, toggleFollowMode } = useSettingsStore();

  const handleToggleTracking = () => {
    toggleTracking();
  };

  const handleToggleFollowMode = () => {
    toggleFollowMode();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleToggleTracking}
        style={[
          styles.button,
          isTracking ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        <MapPin
          size={24}
          color={isTracking ? Colors.dark.text : Colors.dark.subtext}
        />
        <Text
          style={[
            styles.buttonText,
            isTracking ? styles.activeText : styles.inactiveText,
          ]}
        >
          {isTracking ? 'Tracking Active' : 'Start Tracking'}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleToggleFollowMode}
        style={[
          styles.button,
          followModeEnabled ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        <Navigation
          size={24}
          color={followModeEnabled ? Colors.dark.text : Colors.dark.subtext}
        />
        <Text
          style={[
            styles.buttonText,
            followModeEnabled ? styles.activeText : styles.inactiveText,
          ]}
        >
          {followModeEnabled ? 'Follow Mode On' : 'Follow Mode Off'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  activeButton: {
    backgroundColor: Colors.dark.primary,
  },
  inactiveButton: {
    backgroundColor: Colors.dark.card,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.dark.text,
  },
  inactiveText: {
    color: Colors.dark.subtext,
  },
});