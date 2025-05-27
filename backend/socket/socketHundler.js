const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Device = require('../models/Device');
const Location = require('../models/Location');
const Alert = require('../models/alert');

// Authenticate socket connection using JWT
const authenticateSocket = async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Socket authentication error:', err);
    return null;
  }
};

// Handle socket connections and events
module.exports = async (io, socket) => {
  // Authenticate user
  const user = await authenticateSocket(socket);
  
  if (!user) {
    console.log('Unauthenticated socket connection rejected');
    socket.disconnect(true);
    return;
  }

  console.log(`User ${user.name} (${user._id}) connected via socket: ${socket.id}`);

  // Join user's room for private messages
  socket.join(`user:${user._id}`);

  // Handle device status updates
  socket.on('device:status', async (data) => {
    try {
      const { deviceId, status } = data;
      
      // Verify device belongs to user
      const device = await Device.findOne({
        _id: deviceId,
        user: user._id
      });

      if (!device) {
        return;
      }

      // Update device status
      device.status = {
        ...device.status,
        ...status,
        lastSeen: new Date()
      };
      
      await device.save();

      // Broadcast to all user's connected clients
      io.to(`user:${user._id}`).emit('device:status:updated', {
        deviceId,
        status: device.status
      });

      // Check for low battery alert
      if (status.batteryLevel && status.batteryLevel <= 20) {
        const alert = await Alert.create({
          user: user._id,
          device: deviceId,
          type: 'battery_low',
          message: `Low battery alert: ${status.batteryLevel}%`,
          isResolved: false
        });

        io.to(`user:${user._id}`).emit('alert:new', alert);
      }

      // Check for connection lost
      if (status.isConnected === false) {
        const alert = await Alert.create({
          user: user._id,
          device: deviceId,
          type: 'connection_lost',
          message: 'Device connection lost',
          isResolved: false
        });

        io.to(`user:${user._id}`).emit('alert:new', alert);
      }
    } catch (err) {
      console.error('Error handling device status update:', err);
    }
  });

  // Handle location updates
  socket.on('location:update', async (data) => {
    try {
      const { deviceId, location } = data;
      
      // Verify device belongs to user
      const device = await Device.findOne({
        _id: deviceId,
        user: user._id
      });

      if (!device) {
        return;
      }

      // Create new location record
      const newLocation = await Location.create({
        device: deviceId,
        user: user._id,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 0,
        speed: location.speed || null,
        timestamp: location.timestamp || new Date()
      });

      // Broadcast to all user's connected clients
      io.to(`user:${user._id}`).emit('location:updated', {
        deviceId,
        location: newLocation
      });
    } catch (err) {
      console.error('Error handling location update:', err);
    }
  });

  // Handle emergency alerts
  socket.on('alert:emergency', async (data) => {
    try {
      const { deviceId, location, message } = data;
      
      // Verify device belongs to user
      const device = await Device.findOne({
        _id: deviceId,
        user: user._id
      });

      if (!device) {
        return;
      }

      // Create emergency alert
      const alert = await Alert.create({
        user: user._id,
        device: deviceId,
        type: 'emergency',
        message: message || 'Emergency alert triggered',
        location: location || null,
        isResolved: false
      });

      // Broadcast to all user's connected clients
      io.to(`user:${user._id}`).emit('alert:new', alert);

      // In a real app, this would trigger notifications to emergency contacts
      console.log(`Emergency alert created for user ${user._id}, device ${deviceId}`);
    } catch (err) {
      console.error('Error handling emergency alert:', err);
    }
  });

  // Handle audio level updates
  socket.on('audio:level', async (data) => {
    try {
      const { deviceId, level } = data;
      
      // Verify device belongs to user
      const device = await Device.findOne({
        _id: deviceId,
        user: user._id
      });

      if (!device) {
        return;
      }

      // Only broadcast if audio monitoring is enabled
      if (device.isAudioEnabled) {
        io.to(`user:${user._id}`).emit('audio:level:updated', {
          deviceId,
          level
        });

        // Check for high audio level alert (potential danger)
        if (level > 85) {
          const alert = await Alert.create({
            user: user._id,
            device: deviceId,
            type: 'custom',
            message: 'High noise level detected',
            isResolved: false
          });

          io.to(`user:${user._id}`).emit('alert:new', alert);
        }
      }
    } catch (err) {
      console.error('Error handling audio level update:', err);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${user.name} (${user._id}) disconnected: ${socket.id}`);
  });
};