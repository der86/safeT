const express = require('express');
const {
  getLocations,
  getLatestLocation,
  addLocation,
  deleteLocationHistory
} = require('../controllers/location.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect); // All location routes are protected

router.route('/:deviceId')
  .get(getLocations)
  .post(addLocation)
  .delete(deleteLocationHistory);

router.get('/:deviceId/latest', getLatestLocation);

module.exports = router;