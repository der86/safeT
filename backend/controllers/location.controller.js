const Location = require('../models/Location');
const Device = require('../models/Device');

/**
 * @desc    Get all locations for a device
 * @route   GET /api/locations/:deviceId
 * @access  Private
 */
exports.getLocations = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized access' });
    }

    const limit = parseInt(req.query.limit) || 20;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    const query = {
      device: req.params.deviceId,
      user: req.user.id,
    };

    if (startDate && endDate) {
      query.timestamp = { $gte: startDate, $lte: endDate };
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
      data: locations,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get the latest location for a device
 * @route   GET /api/locations/:deviceId/latest
 * @access  Private
 */
exports.getLatestLocation = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized access' });
    }

    const location = await Location.findOne({
      device: req.params.deviceId,
      user: req.user.id,
    }).sort({ timestamp: -1 });

    if (!location) {
      return res.status(404).json({ success: false, error: 'No location data found' });
    }

    res.status(200).json({ success: true, data: location });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Add a new location for a device
 * @route   POST /api/locations/:deviceId
 * @access  Private
 */
exports.addLocation = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized to update this device' });
    }

    const location = await Location.create({
      device: req.params.deviceId,
      user: req.user.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      accuracy: req.body.accuracy || 0,
      speed: req.body.speed || null,
      timestamp: req.body.timestamp || new Date(),
    });

    // Update last seen
    device.status.lastSeen = new Date();
    await device.save();

    res.status(201).json({ success: true, data: location });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Delete all location history for a device
 * @route   DELETE /api/locations/:deviceId
 * @access  Private
 */
exports.deleteLocationHistory = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);

    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized to delete this data' });
    }

    await Location.deleteMany({
      device: req.params.deviceId,
      user: req.user.id,
    });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
