const express = require('express');
const {
  createMeasurement,
  listMeasurements,
  listMeasurementFields,
  setDefaultMeasurement,
} = require('../controllers/measurementController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/fields', listMeasurementFields);
router.use(authenticate);
router.post('/', createMeasurement);
router.get('/', listMeasurements);
router.patch('/:measurementId/default', setDefaultMeasurement);

module.exports = router;
