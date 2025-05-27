import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async init() {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, cannot initialize socket');
        return false;
      }

      this.socket = io('http://localhost:5000', {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.setupEventListeners();
      return true;
    } catch (error) {
      console.error('Socket initialization error:', error);
      return false;
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached, giving up');
        this.disconnect();
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    
    this.socket.on(event, callback);
    
    // Store listener for potential cleanup
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback);
      
      // Remove specific callback from listeners
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    } else {
      // Remove all listeners for this event
      this.socket.off(event);
      delete this.listeners[event];
    }
  }

  emit(event, data) {
    if (!this.socket || !this.isConnected) {
      console.log('Socket not connected, cannot emit event:', event);
      return false;
    }
    
    this.socket.emit(event, data);
    return true;
  }

  // Device status update
  updateDeviceStatus(deviceId, status) {
    return this.emit('device:status', { deviceId, status });
  }

  // Location update
  updateLocation(deviceId, location) {
    return this.emit('location:update', { deviceId, location });
  }

  // Emergency alert
  triggerEmergency(deviceId, location, message) {
    return this.emit('alert:emergency', { deviceId, location, message });
  }

  // Audio level update
  updateAudioLevel(deviceId, level) {
    return this.emit('audio:level', { deviceId, level });
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;