import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Update the path below if your deviceStore file is in a different location
import { useDeviceStore } from '../store/deviceStore';
// Update the path below to the correct relative path if needed
import Colors from '../constants/colors';

export const ConnectionStatus = () => {
  const { deviceStatus, connectDevice, disconnectDevice } = useDeviceStore();
  const { isConnected, connectionType, batteryLevel, signalStrength } = deviceStatus;

  // Simulate connection changes
  useEffect(() => {
    if (!isConnected) {
      const timer = setTimeout(() => {
        connectDevice();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, connectDevice]);

  const getConnectionIcon = () => {
      return <MaterialCommunityIcons name="alert-circle" size={24} color={Colors.dark.danger} />;
    }
    
    if (connectionType === 'bluetooth') {
    if (connectionType === 'bluetooth') {
      return <MaterialCommunityIcons name="bluetooth" size={24} color={Colors.dark.primary} />;
    }
    
    return <MaterialCommunityIcons name="wifi" size={24} color={Colors.dark.primary} />;
  };
  const getStatusText = () => {
    if (!isConnected) {
      return 'Disconnected';
    }
    return `Connected via ${connectionType === 'wifi' ? 'Wi-Fi' : 'Unknown'}`;
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      disconnectDevice();
    } else {
      connectDevice();
    }
  };

  return (
    <Pressable onPress={handleToggleConnection} style={styles.container}>
      <View style={styles.iconContainer}>
        {getConnectionIcon()}
      </View>
      <View style={styles.infoContainer}>
        <Text style={[
          styles.statusText,
          { color: isConnected ? Colors.dark.success : Colors.dark.danger }
        ]}>
          {getStatusText()}
        </Text>
        {isConnected && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>Battery: {batteryLevel}%</Text>
            <Text style={styles.statsText}>Signal: {signalStrength}%</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
});