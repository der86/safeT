const express = require('express');
const {
  getContacts,
  getEmergencyContacts,
  getContact,
  createContact,
  updateContact,
  toggleEmergency,
  deleteContact
} = require('../controllers/contact.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect); // All contact routes are protected

router.route('/')
  .get(getContacts)
  .post(createContact);

router.get('/emergency', getEmergencyContacts);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

router.patch('/:id/toggle-emergency', toggleEmergency);

module.exports = router;