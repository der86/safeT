import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { ContactItem } from '../../components/ContactItem';
import { AddContactModal } from '../../components/AddContactModal';
import Colors from '../../constants/colors';
// Update the path below if your contactsStore is in a different location
import { useContactsStore } from '../../store/contactsStore';
import { Plus, Star } from 'lucide-react-native';

export default function ContactsScreen() {
  const { contacts } = useContactsStore();
  const [modalVisible, setModalVisible] = useState(false);

  const emergencyContacts = contacts.filter(contact => contact.isEmergency);
  const regularContacts = contacts.filter(contact => !contact.isEmergency);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Emergency Contacts",
          headerRight: () => (
            <Pressable 
              onPress={() => setModalVisible(true)}
              style={styles.addButton}
            >
              <Plus size={24} color={Colors.dark.text} />
            </Pressable>
          ),
        }} 
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {emergencyContacts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Star size={16} color={Colors.dark.warning} fill={Colors.dark.warning} />
                <Text style={styles.sectionTitle}>Emergency Contacts</Text>
              </View>
              
              {emergencyContacts.map(contact => (
                <ContactItem key={contact.id} contact={contact} />
              ))}
            </View>
          )}
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Contacts</Text>
            </View>
            
            {regularContacts.length > 0 ? (
              regularContacts.map(contact => (
                <ContactItem key={contact.id} contact={contact} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No contacts added yet</Text>
              </View>
            )}
          </View>
          
          <Pressable 
            onPress={() => setModalVisible(true)}
            style={styles.addContactButton}
          >
            <Plus size={20} color={Colors.dark.text} />
            <Text style={styles.addContactText}>Add New Contact</Text>
          </Pressable>
        </ScrollView>
        
        <AddContactModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  emptyContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  addContactText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginLeft: 8,
  },
});