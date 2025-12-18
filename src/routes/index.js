const express = require('express');
const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');
const measurementRoutes = require('./measurementRoutes');
const tailorRoutes = require('./tailorRoutes');
const customerRoutes = require('./customerRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/measurements', measurementRoutes);
router.use('/tailors', tailorRoutes);
router.use('/customers', customerRoutes);

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = router;
