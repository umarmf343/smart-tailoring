const express = require('express');
const {
  listTailors,
  getTailor,
  updateTailorProfile,
  verifyTailor,
} = require('../controllers/tailorController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', listTailors);
router.get('/:tailorId', getTailor);
router.patch('/me', authenticate, updateTailorProfile);
router.patch('/:tailorId/verify', authenticate, verifyTailor);

module.exports = router;
