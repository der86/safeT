const express = require('express');
const {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  updateDeviceStatus,
  deleteDevice,
  toggleTracking,
  toggleAudio
} = require('../controllers/device.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect); // All device routes are protected

router.route('/')
  .get(getDevices)
  .post(createDevice);

router.route('/:id')
  .get(getDevice)
  .put(updateDevice)
  .delete(deleteDevice);

router.patch('/:id/status', updateDeviceStatus);
router.patch('/:id/tracking', toggleTracking);
router.patch('/:id/audio', toggleAudio);

module.exports = router;