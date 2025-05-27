const Location = require('../models/Location');
const Device = require('../models/Device');

// @desc    Get locations for a device
// @route   GET /api/locations/:deviceId
// @access  Private
exports.getLocations = async (req, res) => {
  try {
    // Check if device exists and belongs to user
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this device data'
      });
    }

    // Get query parameters
    const limit = parseInt(req.query.limit) || 20;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    // Build query
    let query = {
      device: req.params.deviceId,
      user: req.user.id
    };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: startDate,
        $lte: endDate
      };
    } else if (startDate) {
      query.timestamp = { $gte: startDate };
    } else if (endDate) {
      query.timestamp = { $lte: endDate };
    }

    const locations = await Location.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get latest location for a device
// @route   GET /api/locations/:deviceId/latest
// @access  Private
exports.getLatestLocation = async (req, res) => {
  try {
    // Check if device exists and belongs to user
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this device data'
      });
    }

    const location = await Location.findOne({
      device: req.params.deviceId,
      user: req.user.id
    }).sort({ timestamp: -1 });

    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'No location data found for this device'
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Add location for a device
// @route   POST /api/locations/:deviceId
// @access  Private
exports.addLocation = async (req, res) => {
  try {
    // Check if device exists and belongs to user
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this device data'
      });
    }

    // Create location
    const location = await Location.create({
      device: req.params.deviceId,
      user: req.user.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      accuracy: req.body.accuracy || 0,
      speed: req.body.speed || null,
      timestamp: req.body.timestamp || new Date()
    });

    // Update device's last seen timestamp
    device.status.lastSeen = new Date();
    await device.save();

    res.status(201).json({
      success: true,
      data: location
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete location history for a device
// @route   DELETE /api/locations/:deviceId
// @access  Private
exports.deleteLocationHistory = async (req, res) => {
  try {
    // Check if device exists and belongs to user
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this device data'
      });
    }

    // Delete all locations for this device
    await Location.deleteMany({
      device: req.params.deviceId,
      user: req.user.id
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};