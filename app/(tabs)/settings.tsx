import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SettingItem } from '../../components/SettingItem';
import Colors from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';
import { useDeviceStore } from '../../store/deviceStore';
import { 
  Bell, 
  Bluetooth, 
  HelpCircle, 
  Info, 
  Lock, 
  MapPin, 
  Mic, 
  Moon, 
  Navigation, 
  Vibrate, 
  Wifi 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const {
    followModeEnabled,
    audioMonitoringEnabled,
    notificationsEnabled,
    vibrationEnabled,
    darkModeEnabled,
    autoConnectEnabled,
    toggleFollowMode,
    toggleAudioMonitoring,
    toggleNotifications,
    toggleVibration,
    toggleDarkMode,
    toggleAutoConnect,
  } = useSettingsStore();

  const { deviceStatus, toggleAudio } = useDeviceStore();

  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking</Text>
          
          <SettingItem
            title="Follow Mode"
            description="Continuously track device location"
            icon={<Navigation size={24} color={Colors.dark.primary} />}
            isToggle
            value={followModeEnabled}
            onToggle={toggleFollowMode}
          />
          
          <SettingItem
            title="Audio Monitoring"
            description="Listen to device surroundings"
            icon={<Mic size={24} color={Colors.dark.primary} />}
            isToggle
            value={audioMonitoringEnabled}
            onToggle={() => {
              toggleAudioMonitoring();
              toggleAudio();
            }}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          
          <SettingItem
            title="Auto-Connect"
            description="Automatically connect to device when in range"
            icon={<Bluetooth size={24} color={Colors.dark.primary} />}
            isToggle
            value={autoConnectEnabled}
            onToggle={toggleAutoConnect}
          />
          
          <SettingItem
            title="Connection Type"
            description={`Currently using ${deviceStatus.connectionType}`}
            icon={
              deviceStatus.connectionType === 'bluetooth' 
                ? <Bluetooth size={24} color={Colors.dark.primary} />
                : <Wifi size={24} color={Colors.dark.primary} />
            }
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            title="Push Notifications"
            description="Receive alerts when device status changes"
            icon={<Bell size={24} color={Colors.dark.primary} />}
            isToggle
            value={notificationsEnabled}
            onToggle={toggleNotifications}
          />
          
          <SettingItem
            title="Vibration"
            description="Vibrate on important alerts"
            icon={<Vibrate size={24} color={Colors.dark.primary} />}
            isToggle
            value={vibrationEnabled}
            onToggle={toggleVibration}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          
          <SettingItem
            title="Dark Mode"
            description="Use dark theme"
            icon={<Moon size={24} color={Colors.dark.primary} />}
            isToggle
            value={darkModeEnabled}
            onToggle={toggleDarkMode}
          />
          
          <SettingItem
            title="Privacy Policy"
            icon={<Lock size={24} color={Colors.dark.primary} />}
          />
          
          <SettingItem
            title="About"
            icon={<Info size={24} color={Colors.dark.primary} />}
          />
          
          <SettingItem
            title="Help & Support"
            icon={<HelpCircle size={24} color={Colors.dark.primary} />}
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Safety Tracker v1.0.0</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
});
