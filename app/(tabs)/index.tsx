import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { ConnectionStatus } from '../../components/ConnectionStatus';
import LocationMap from '../../components/LocationMap';
import { AudioMonitor } from '../../components/AudioMonitor';
import { FollowModeToggle } from '../../components/FollowModeToggle';
import { EmergencyButton } from '../../components/EmergencyButton';
import Colors from '../../constants/colors';
import { useDeviceStore } from '../../store/deviceStore';

export default function HomeScreen() {
  const { updateLocation } = useDeviceStore();

  // Initial location update
  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  return (
    <>
      <Stack.Screen options={{ title: "Safety Tracker" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Safety Tracker</Text>
        <Text style={styles.subtitle}>Monitor and protect your loved ones</Text>
        
        <ConnectionStatus />
        
        <FollowModeToggle />
        
        <LocationMap />
        
        <AudioMonitor />
        
        <EmergencyButton />
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginBottom: 24,
  },
});