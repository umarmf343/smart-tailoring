const express = require('express');
const {
  registerCustomer,
  registerTailor,
  registerAdmin,
  login,
} = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/register/customer', registerCustomer);
router.post('/register/tailor', registerTailor);
router.post('/register/admin', authenticate, authorizeRoles('admin', 'super_admin'), registerAdmin);
router.post('/login', login);

module.exports = router;
