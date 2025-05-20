import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { useDeviceStore } from '../store/deviceStore';
import Colors from '../constants/colors';
import { MapPin } from 'lucide-react-native';

// Mock map component since we can't use actual maps in this demo
export const LocationMap = () => {
  const { currentLocation, updateLocation, isTracking } = useDeviceStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTracking) {
      // Update location every 5 seconds when tracking is enabled
      intervalRef.current = setInterval(() => {
        updateLocation();
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, updateLocation]);

  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.mockMap}>
          <MapPin size={32} color={Colors.dark.primary} />
          <Text style={styles.trackingStatus}>
            {isTracking ? 'Live Tracking' : 'Tracking Paused'}
          </Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.coordinateRow}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{formatCoordinate(currentLocation.latitude)}</Text>
        </View>
        <View style={styles.coordinateRow}>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{formatCoordinate(currentLocation.longitude)}</Text>
        </View>
        <View style={styles.coordinateRow}>
          <Text style={styles.label}>Last Updated:</Text>
          <Text style={styles.value}>{formatTime(currentLocation.timestamp)}</Text>
        </View>
        <View style={styles.coordinateRow}>
          <Text style={styles.label}>Accuracy:</Text>
          <Text style={styles.value}>{currentLocation.accuracy.toFixed(1)} m</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapContainer: {
    width: '100%',
    height: 200,
  },
  mockMap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#263238',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingStatus: {
    color: Colors.dark.text,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  value: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
});