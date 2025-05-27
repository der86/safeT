const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  device: {
    type: mongoose.Schema.ObjectId,
    ref: 'Device',
    required: true
  },
  type: {
    type: String,
    enum: ['emergency', 'battery_low', 'connection_lost', 'geofence', 'custom'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);