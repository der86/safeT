import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/colors';
import * as Haptics from 'expo-haptics';

export const EmergencyButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countdownActive, setCountdownActive] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseAnim]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
        
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }, 1000);
    } else if (countdownActive && countdown === 0) {
      triggerEmergency();
      resetState();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdownActive, countdown]);

  const handlePressIn = () => {
    setIsPressed(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleLongPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCountdownActive(true);
  };

  const triggerEmergency = () => {
    // In a real app, this would send alerts to emergency contacts
    Alert.alert(
      "Emergency Alert Sent",
      "Your emergency contacts have been notified with your current location.",
      [{ text: "OK" }]
    );
  };

  const resetState = () => {
    setCountdownActive(false);
    setCountdown(3);
    setIsPressed(false);
  };

  const cancelEmergency = () => {
    if (countdownActive) {
      resetState();
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {countdownActive && (
        <Pressable onPress={cancelEmergency} style={styles.cancelButton}>
          <Text style={styles.cancelText}>
            Cancel Emergency ({countdown})
          </Text>
        </Pressable>
      )}
      
      <Animated.View
        style={[
          styles.pulseContainer,
          {
            transform: [{ scale: pulseAnim }],
            opacity: countdownActive ? 0.8 : 0.4,
          },
        ]}
      />
      
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        delayLongPress={1000}
        style={[
          styles.button,
          isPressed && styles.buttonPressed,
          countdownActive && styles.buttonActive,
        ]}
      >
        <Feather
          name="alert-triangle"
          size={32}
          color={Colors.dark.text}
        />
        <Text style={styles.buttonText}>
          {countdownActive
            ? `Sending Alert (${countdown})`
            : "Hold for Emergency"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  pulseContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.dark.secondary,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonPressed: {
    backgroundColor: Colors.dark.danger,
    transform: [{ scale: 0.95 }],
  },
  buttonActive: {
    backgroundColor: Colors.dark.danger,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.danger,
  },
  cancelText: {
    color: Colors.dark.danger,
    fontWeight: '600',
  },
});