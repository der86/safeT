const express = require('express');
const {
  getAlerts,
  getDeviceAlerts,
  createAlert,
  updateAlert,
  deleteAlert
} = require('../controllers/alert.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect); // All alert routes are protected

router.route('/')
  .get(getAlerts)
  .post(createAlert);

router.get('/device/:deviceId', getDeviceAlerts);

router.route('/:id')
  .put(updateAlert)
  .delete(deleteAlert);

module.exports = router;