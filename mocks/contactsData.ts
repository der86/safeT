import { Contact } from '../types';

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    phone: '(555) 123-4567',
    isEmergency: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    phone: '(555) 987-6543',
    isEmergency: true,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    phone: '(555) 234-5678',
    isEmergency: false,
  },
  {
    id: '4',
    name: 'David Rodriguez',
    phone: '(555) 876-5432',
    isEmergency: false,
  },
];