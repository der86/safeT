import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../types';
import { mockContacts } from '../mocks/contactsData';
import axios from 'axios';

interface ContactsState {
  contacts: Contact[];

  // Actions
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  toggleEmergency: (id: string) => void;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set) => ({
      contacts: [...mockContacts],

addContact: async (contact) => {
  try {
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      throw new Error('No auth token found in AsyncStorage');
    }

    const response = await axios.post(
      'http://192.168.1.5:5000/api/contacts',
      contact,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // attach token
        },
      }
    );

    // Save to store if backend returns success
    set((state) => ({
      contacts: [
        ...state.contacts,
        {
          ...response.data.data, // assuming your backend returns { data: contact }
          id: response.data.data._id || Date.now().toString(),
        },
      ],
    }));
  } catch (error) {
    console.error('❌ Failed to save contact to backend:', error);
  }
},

      updateContact: (id, updatedContact) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updatedContact } : contact
          ),
        })),

      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),

      toggleEmergency: (id) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id
              ? { ...contact, isEmergency: !contact.isEmergency }
              : contact
          ),
        })),
    }),
    {
      name: 'contacts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
