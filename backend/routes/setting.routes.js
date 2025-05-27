const express = require('express');
const {
  getSettings,
  updateSettings,
  toggleSetting,
  resetSettings
} = require('../controllers/settings.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect); // All settings routes are protected

router.route('/')
  .get(getSettings)
  .put(updateSettings);

router.patch('/:setting', toggleSetting);
router.post('/reset', resetSettings);

module.exports = router;