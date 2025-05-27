const Alert = require('../models/alert');
const Device = require('../models/Device');
const Contact = require('../models/Contact');

// @desc    Get all alerts for a user
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    // Get query parameters
    const limit = parseInt(req.query.limit) || 20;
    const isResolved = req.query.isResolved === 'true';
    const type = req.query.type;

    // Build query
    let query = { user: req.user.id };

    if (req.query.isResolved !== undefined) {
      query.isResolved = isResolved;
    }

    if (type) {
      query.type = type;
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('device', 'name deviceId');

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get alerts for a specific device
// @route   GET /api/alerts/device/:deviceId
// @access  Private
exports.getDeviceAlerts = async (req, res) => {
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
    const isResolved = req.query.isResolved === 'true';

    // Build query
    let query = {
      user: req.user.id,
      device: req.params.deviceId
    };

    if (req.query.isResolved !== undefined) {
      query.isResolved = isResolved;
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private
exports.createAlert = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if device exists and belongs to user
    const device = await Device.findById(req.body.device);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to create alerts for this device'
      });
    }

    const alert = await Alert.create(req.body);

    // In a real app, we would send notifications to emergency contacts here
    if (req.body.type === 'emergency') {
      const emergencyContacts = await Contact.find({
        user: req.user.id,
        isEmergency: true
      });
      
      // This is where you would integrate with SMS/notification service
      console.log(`Emergency alert created. Would notify ${emergencyContacts.length} contacts.`);
    }

    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update alert (mark as resolved)
// @route   PUT /api/alerts/:id
// @access  Private
exports.updateAlert = async (req, res) => {
  try {
    let alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    // Make sure user owns alert
    if (alert.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this alert'
      });
    }

    // Only allow updating isResolved status and resolvedAt
    const updateData = {
      isResolved: req.body.isResolved
    };

    if (req.body.isResolved) {
      updateData.resolvedAt = new Date();
    }

    alert = await Alert.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    // Make sure user owns alert
    if (alert.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this alert'
      });
    }

    await alert.deleteOne();

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