import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import LocationMap from '../../components/LocationMap';
import { FollowModeToggle } from '../../components/FollowModeToggle';
import Colors from '../../constants/colors';
import { useDeviceStore } from '../../store/deviceStore';
import { Feather,FontAwesome } from '@expo/vector-icons';

export default function LocationScreen() {
  const { locationHistory, updateLocation, isTracking } = useDeviceStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        updateLocation();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isTracking, updateLocation]);

  const handleRefresh = () => {
    setRefreshing(true);
    updateLocation();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Stack.Screen options={{ title: "Location Tracking" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <FollowModeToggle />
        
        <LocationMap />
        
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Location History</Text>
          <Pressable onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Text>
          </Pressable>
        </View>
        
        <View style={styles.historyContainer}>
          {locationHistory.length > 0 ? (
            locationHistory.slice().reverse().map((location, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.timeContainer}>
                  <Feather name="clock" size={16} color={Colors.dark.subtext} />
                  <Text style={styles.timeText}>
                    {formatTime(location.timestamp)}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDate(location.timestamp)}
                  </Text>
                </View>
                
                <View style={styles.locationContainer}>
                  <FontAwesome name="location-arrow" size={16} color={Colors.dark.primary} />
                  <Text style={styles.locationText}>
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.accuracyText}>
                    Accuracy: {location.accuracy.toFixed(1)}m
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No location history available</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  refreshButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.dark.card,
  },
  refreshText: {
    fontSize: 14,
    color: Colors.dark.primary,
  },
  historyContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  timeContainer: {
    width: 100,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.text,
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: Colors.dark.text,
    marginTop: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
    padding: 16,
  },
});