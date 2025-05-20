import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../types';
import { mockContacts } from '../mocks/contactsData';

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
      
      addContact: (contact) => set((state) => ({
        contacts: [
          ...state.contacts,
          {
            ...contact,
            id: Date.now().toString(),
          },
        ],
      })),
      
      updateContact: (id, updatedContact) => set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact.id === id ? { ...contact, ...updatedContact } : contact
        ),
      })),
      
      removeContact: (id) => set((state) => ({
        contacts: state.contacts.filter((contact) => contact.id !== id),
      })),
      
      toggleEmergency: (id) => set((state) => ({
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