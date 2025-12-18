const express = require('express');
const {
  listCustomers,
  getProfile,
  updateProfile,
} = require('../controllers/customerController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, listCustomers);
router.get('/me', authenticate, getProfile);
router.get('/:customerId', authenticate, getProfile);
router.patch('/me', authenticate, updateProfile);

module.exports = router;
