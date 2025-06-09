import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
// Update the path below to the correct relative path if needed
import { Contact } from '../types';
import Colors from '../constants/colors';
import { useContactsStore } from '../store/contactsStore';

interface ContactItemProps {
  contact: Contact;
}

export const ContactItem = ({ contact }: ContactItemProps) => {
  const { toggleEmergency, removeContact } = useContactsStore();

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <View style={styles.phoneContainer}>
          <Feather name="phone" size={14} color={Colors.dark.subtext} />
          <Text style={styles.phone}>{contact.phone}</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Pressable
          onPress={() => toggleEmergency(contact.id)}
          style={[
            styles.actionButton,
            contact.isEmergency ? styles.starActive : styles.starInactive,
          ]}
        >
          <Feather
            name="star"
            size={20}
            color={contact.isEmergency ? Colors.dark.warning : Colors.dark.inactive}
          />
        </Pressable>
        
        <Pressable
          onPress={() => removeContact(contact.id)}
          style={styles.actionButton}
        >
          <Feather name="trash-2" size={20} color={Colors.dark.danger} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phone: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginLeft: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  starActive: {
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
  },
  starInactive: {
    backgroundColor: 'transparent',
  },
});