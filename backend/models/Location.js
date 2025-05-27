const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.ObjectId,
    ref: 'Device',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  latitude: {
    type: Number,
    required: [true, 'Please add latitude']
  },
  longitude: {
    type: Number,
    required: [true, 'Please add longitude']
  },
  accuracy: {
    type: Number,
    default: 0
  },
  speed: {
    type: Number,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
LocationSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Location', LocationSchema);