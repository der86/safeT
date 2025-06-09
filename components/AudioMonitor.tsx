import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Update the path below to the correct relative path if needed
import { useDeviceStore } from '../store/deviceStore';
import Colors from '../constants/colors';

export const AudioMonitor = () => {
  const { isAudioEnabled, toggleAudio, audioLevel, simulateAudioLevel } = useDeviceStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAudioEnabled) {
      // Simulate audio level changes when enabled
      intervalRef.current = setInterval(() => {
        simulateAudioLevel();
      }, 500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAudioEnabled, simulateAudioLevel]);

  const getAudioBars = () => {
    const bars = [];
    const totalBars = 20;
    const activeBars = Math.floor((audioLevel / 100) * totalBars);

    for (let i = 0; i < totalBars; i++) {
      const isActive = i < activeBars;
      const height = 4 + (i / 2);
      
      bars.push(
        <View
          key={i}
          style={[
            styles.audioBar,
            {
              height,
              backgroundColor: isActive ? getBarColor(i, totalBars) : Colors.dark.inactive,
            },
          ]}
        />
      );
    }

    return bars;
  };

  const getBarColor = (index: number, total: number) => {
    const ratio = index / total;
    if (ratio < 0.5) return Colors.dark.success;
    if (ratio < 0.8) return Colors.dark.warning;
    return Colors.dark.danger;
  };

  return (
    <Pressable onPress={toggleAudio} style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          {isAudioEnabled ? (
            <MaterialIcons name="mic" size={24} color={Colors.dark.primary} />
          ) : (
            <MaterialIcons name="mic-off" size={24} color={Colors.dark.inactive} />
          )}
        </View>
        <Text style={styles.title}>
          {isAudioEnabled ? 'Audio Monitoring Active' : 'Audio Monitoring Off'}
        </Text>
      </View>
      
      {isAudioEnabled && (
        <View style={styles.visualizerContainer}>
          {getAudioBars()}
        </View>
      )}
      
      <Text style={styles.helpText}>
        {isAudioEnabled
          ? "Listening to device's surroundings"
          : "Tap to enable audio monitoring"}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  visualizerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    marginBottom: 12,
    gap: 2,
  },
  audioBar: {
    width: 4,
    borderRadius: 2,
    flex: 1,
  },
  helpText: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
});