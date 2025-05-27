const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  followModeEnabled: {
    type: Boolean,
    default: false
  },
  audioMonitoringEnabled: {
    type: Boolean,
    default: false
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  vibrationEnabled: {
    type: Boolean,
    default: true
  },
  darkModeEnabled: {
    type: Boolean,
    default: true
  },
  autoConnectEnabled: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);