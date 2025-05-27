const Device = require('../models/Device');

// @desc    Get all devices for a user
// @route   GET /api/devices
// @access  Private
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Private
exports.getDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    // Make sure user owns device
    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this device'
      });
    }

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new device
// @route   POST /api/devices
// @access  Private
exports.createDevice = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const device = await Device.create(req.body);

    res.status(201).json({
      success: true,
      data: device
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update device
// @route   PUT /api/devices/:id
// @access  Private
exports.updateDevice = async (req, res) => {
  try {
    let device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    // Make sure user owns device
    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this device'
      });
    }

    device = await Device.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update device status
// @route   PATCH /api/devices/:id/status
// @access  Private
exports.updateDeviceStatus = async (req, res) => {
  try {
    let device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    // Make sure user owns device
    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this device'
      });
    }

    // Update only status fields
    device.status = {
      ...device.status,
      ...req.body,
      lastSeen: new Date()
    };

    await device.save();

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    // Make sure user owns device
    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this device'
      });
    }

    await device.deleteOne();

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

// @desc    Toggle device tracking
// @route   PATCH /api/devices/:id/tracking
// @access  Private
exports.toggleTracking = async (req, res) => {
  try {
    let device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    // Make sure user owns device
    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this device'
      });
    }

    device.isTracking = !device.isTracking;
    await device.save();

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Toggle device audio
// @route   PATCH /api/devices/:id/audio
// @access  Private
exports.toggleAudio = async (req, res) => {
  try {
    let device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    // Make sure user owns device
    if (device.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this device'
      });
    }

    device.isAudioEnabled = !device.isAudioEnabled;
    await device.save();

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};