import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface SettingItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isToggle?: boolean;
  value?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
}

export const SettingItem = ({
  title,
  description,
  icon,
  isToggle = false,
  value = false,
  onToggle,
  onPress,
}: SettingItemProps) => {
  return (
    <Pressable
      onPress={isToggle ? onToggle : onPress}
      style={styles.container}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      
      {isToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: Colors.dark.inactive, true: Colors.dark.primary }}
          thumbColor={Colors.dark.text}
        />
      ) : (
        <Feather name="chevron-right" size={20} color={Colors.dark.subtext} />
      )}
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
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
});