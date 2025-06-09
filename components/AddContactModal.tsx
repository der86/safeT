import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
// Update the path below to the correct relative path to contactsStore
import { useContactsStore } from '../store/contactsStore';
import Colors from '../constants/colors';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddContactModal = ({ visible, onClose }: AddContactModalProps) => {
  const { addContact } = useContactsStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const handleAddContact = () => {
    if (name.trim() && phone.trim()) {
      addContact({
        name: name.trim(),
        phone: phone.trim(),
        isEmergency,
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setIsEmergency(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Contact</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={Colors.dark.subtext}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={Colors.dark.subtext}
                keyboardType="phone-pad"
              />
            </View>
            
            <Pressable
              onPress={() => setIsEmergency(!isEmergency)}
              style={styles.checkboxContainer}
            >
              <View style={[
                styles.checkbox,
                isEmergency && styles.checkboxActive
              ]} />
              <Text style={styles.checkboxLabel}>
                Add as emergency contact
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleAddContact}
              style={[
                styles.button,
                styles.saveButton,
                (!name.trim() || !phone.trim()) && styles.buttonDisabled
              ]}
              disabled={!name.trim() || !phone.trim()}
            >
              <Text style={styles.buttonText}>Save Contact</Text>
            </Pressable>
            
            <Pressable
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.dark.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.dark.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: Colors.dark.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
});