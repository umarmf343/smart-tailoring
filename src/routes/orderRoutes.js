const express = require('express');
const {
  createOrder,
  listOrders,
  getOrder,
  updateStatus,
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', listOrders);
router.get('/:orderId', getOrder);
router.patch('/:orderId/status', updateStatus);

module.exports = router;
