import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.error || response.statusText;
    throw new Error(error);
  }
  
  return data;
};

// Create headers with authentication
const createHeaders = async (contentType = 'application/json') => {
  const token = await getToken();
  const headers = {
    'Content-Type': contentType,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API service methods
const apiService = {
  // Auth methods
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: await createHeaders(),
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: await createHeaders(),
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  async logout() {
    await AsyncStorage.removeItem('token');
    return { success: true };
  },
  
  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  // Device methods
  async getDevices() {
    const response = await fetch(`${API_URL}/devices`, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async getDevice(id) {
    const response = await fetch(`${API_URL}/devices/${id}`, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async createDevice(deviceData) {
    const response = await fetch(`${API_URL}/devices`, {
      method: 'POST',
      headers: await createHeaders(),
      body: JSON.stringify(deviceData),
    });
    
    return handleResponse(response);
  },
  
  async updateDevice(id, deviceData) {
    const response = await fetch(`${API_URL}/devices/${id}`, {
      method: 'PUT',
      headers: await createHeaders(),
      body: JSON.stringify(deviceData),
    });
    
    return handleResponse(response);
  },
  
  async updateDeviceStatus(id, statusData) {
    const response = await fetch(`${API_URL}/devices/${id}/status`, {
      method: 'PATCH',
      headers: await createHeaders(),
      body: JSON.stringify(statusData),
    });
    
    return handleResponse(response);
  },
  
  async toggleTracking(id) {
    const response = await fetch(`${API_URL}/devices/${id}/tracking`, {
      method: 'PATCH',
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async toggleAudio(id) {
    const response = await fetch(`${API_URL}/devices/${id}/audio`, {
      method: 'PATCH',
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  // Location methods
  async getLocations(deviceId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_URL}/locations/${deviceId}${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async getLatestLocation(deviceId) {
    const response = await fetch(`${API_URL}/locations/${deviceId}/latest`, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async addLocation(deviceId, locationData) {
    const response = await fetch(`${API_URL}/locations/${deviceId}`, {
      method: 'POST',
      headers: await createHeaders(),
      body: JSON.stringify(locationData),
    });
    
    return handleResponse(response);
  },
  
  // Contact methods
  async getContacts() {
    const response = await fetch(`${API_URL}/contacts`, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async getEmergencyContacts() {
    const response = await fetch(`${API_URL}/contacts/emergency`, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async createContact(contactData) {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: await createHeaders(),
      body: JSON.stringify(contactData),
    });
    
    return handleResponse(response);
  },
  
  async updateContact(id, contactData) {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: await createHeaders(),
      body: JSON.stringify(contactData),
    });
    
    return handleResponse(response);
  },
  
  async toggleEmergencyContact(id) {
    const response = await fetch(`${API_URL}/contacts/${id}/toggle-emergency`, {
      method: 'PATCH',
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async deleteContact(id) {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  // Alert methods
  async getAlerts(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_URL}/alerts${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async createAlert(alertData) {
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: await createHeaders(),
      body: JSON.stringify(alertData),
    });
    
    return handleResponse(response);
  },
  
  async resolveAlert(id) {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: 'PUT',
      headers: await createHeaders(),
      body: JSON.stringify({ isResolved: true }),
    });
    
    return handleResponse(response);
  },
  
  // Settings methods
  async getSettings() {
    const response = await fetch(`${API_URL}/settings`, {
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async updateSettings(settingsData) {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: await createHeaders(),
      body: JSON.stringify(settingsData),
    });
    
    return handleResponse(response);
  },
  
  async toggleSetting(setting) {
    const response = await fetch(`${API_URL}/settings/${setting}`, {
      method: 'PATCH',
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
  
  async resetSettings() {
    const response = await fetch(`${API_URL}/settings/reset`, {
      method: 'POST',
      headers: await createHeaders(),
    });
    
    return handleResponse(response);
  },
};

export default apiService;