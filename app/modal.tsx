import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDeviceStore } from '../store/deviceStore';
import Colors from '../constants/colors';
import { 
  Battery, 
  Bluetooth, 
  Clock, 
  MapPin, 
  Mic, 
  Signal, 
  Smartphone, 
  Wifi 
} from 'lucide-react-native';

export default function ModalScreen() {
  const { deviceStatus, currentLocation, isTracking, isAudioEnabled } = useDeviceStore();
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.deviceHeader}>
          <Smartphone size={48} color={Colors.dark.primary} />
          <Text style={styles.deviceName}>Safety Tracker Device</Text>
          <View style={[
            styles.statusBadge,
            deviceStatus.isConnected ? styles.connectedBadge : styles.disconnectedBadge
          ]}>
            <Text style={styles.statusText}>
              {deviceStatus.isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              {deviceStatus.connectionType === 'bluetooth' ? (
                <Bluetooth size={24} color={Colors.dark.primary} />
              ) : (
                <Wifi size={24} color={Colors.dark.primary} />
              )}
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Connection Type</Text>
              <Text style={styles.infoValue}>
                {deviceStatus.connectionType === 'bluetooth' ? 'Bluetooth' : 'Wi-Fi'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Signal size={24} color={Colors.dark.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Signal Strength</Text>
              <Text style={styles.infoValue}>{deviceStatus.signalStrength}%</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Clock size={24} color={Colors.dark.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Last Seen</Text>
              <Text style={styles.infoValue}>{formatTime(deviceStatus.lastSeen)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Status</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Battery size={24} color={Colors.dark.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Battery Level</Text>
              <View style={styles.batteryContainer}>
                <View 
                  style={[
                    styles.batteryLevel, 
                    { width: `${deviceStatus.batteryLevel}%` },
                    deviceStatus.batteryLevel < 20 ? styles.batteryLow : null
                  ]} 
                />
              </View>
              <Text style={styles.batteryText}>{deviceStatus.batteryLevel}%</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MapPin size={24} color={Colors.dark.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tracking Status</Text>
              <Text style={styles.infoValue}>
                {isTracking ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mic size={24} color={Colors.dark.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Audio Monitoring</Text>
              <Text style={styles.infoValue}>
                {isAudioEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          
          <View style={styles.locationContainer}>
            <Text style={styles.coordinateLabel}>Latitude</Text>
            <Text style={styles.coordinateValue}>
              {currentLocation.latitude.toFixed(6)}
            </Text>
            
            <Text style={styles.coordinateLabel}>Longitude</Text>
            <Text style={styles.coordinateValue}>
              {currentLocation.longitude.toFixed(6)}
            </Text>
            
            <Text style={styles.coordinateLabel}>Accuracy</Text>
            <Text style={styles.coordinateValue}>
              {currentLocation.accuracy.toFixed(1)} meters
            </Text>
            
            <Text style={styles.coordinateLabel}>Last Updated</Text>
            <Text style={styles.coordinateValue}>
              {formatTime(currentLocation.timestamp)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
  deviceHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 12,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  connectedBadge: {
    backgroundColor: Colors.dark.success + '33', // 20% opacity
  },
  disconnectedBadge: {
    backgroundColor: Colors.dark.danger + '33', // 20% opacity
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  batteryContainer: {
    height: 10,
    backgroundColor: Colors.dark.inactive,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  batteryLevel: {
    height: '100%',
    backgroundColor: Colors.dark.success,
    borderRadius: 5,
  },
  batteryLow: {
    backgroundColor: Colors.dark.danger,
  },
  batteryText: {
    fontSize: 14,
    color: Colors.dark.text,
  },
  locationContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
  },
  coordinateLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 2,
  },
  coordinateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 12,
  },
});