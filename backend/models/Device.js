const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a device name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  deviceId: {
    type: String,
    required: [true, 'Please add a device ID'],
    unique: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    isConnected: {
      type: Boolean,
      default: false
    },
    connectionType: {
      type: String,
      enum: ['bluetooth', 'wifi', 'none'],
      default: 'none'
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    signalStrength: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  },
  isTracking: {
    type: Boolean,
    default: false
  },
  isAudioEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Device', DeviceSchema);