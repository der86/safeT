const Settings = require('../models/Settings');

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.id });

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        user: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.id });

    // If settings don't exist, create them
    if (!settings) {
      settings = await Settings.create({
        user: req.user.id,
        ...req.body,
        updatedAt: new Date()
      });
    } else {
      // Update existing settings
      settings = await Settings.findOneAndUpdate(
        { user: req.user.id },
        {
          ...req.body,
          updatedAt: new Date()
        },
        {
          new: true,
          runValidators: true
        }
      );
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Toggle specific setting
// @route   PATCH /api/settings/:setting
// @access  Private
exports.toggleSetting = async (req, res) => {
  try {
    const validSettings = [
      'followModeEnabled',
      'audioMonitoringEnabled',
      'notificationsEnabled',
      'vibrationEnabled',
      'darkModeEnabled',
      'autoConnectEnabled'
    ];

    const setting = req.params.setting;

    if (!validSettings.includes(setting)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid setting name'
      });
    }

    let settings = await Settings.findOne({ user: req.user.id });

    // If settings don't exist, create default settings
    if (!settings) {
      const defaultSettings = {
        user: req.user.id,
        updatedAt: new Date()
      };
      defaultSettings[setting] = true; // Toggle from default (false) to true
      
      settings = await Settings.create(defaultSettings);
    } else {
      // Toggle the specific setting
      settings[setting] = !settings[setting];
      settings.updatedAt = new Date();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Reset settings to default
// @route   POST /api/settings/reset
// @access  Private
exports.resetSettings = async (req, res) => {
  try {
    const defaultSettings = {
      followModeEnabled: false,
      audioMonitoringEnabled: false,
      notificationsEnabled: true,
      vibrationEnabled: true,
      darkModeEnabled: true,
      autoConnectEnabled: true,
      updatedAt: new Date()
    };

    let settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      defaultSettings,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};