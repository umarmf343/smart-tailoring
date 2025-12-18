const Joi = require('joi');
const { Measurement, MeasurementField } = require('../models');

const measurementSchema = Joi.object({
  label: Joi.string().min(2).required(),
  garment_context: Joi.string().default('full'),
  measurements_data: Joi.object().min(1).required(),
  is_default: Joi.boolean().default(false),
  notes: Joi.string().allow('', null),
});

const createMeasurement = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ status: 'error', message: 'Only customers can save measurements' });
    }

    const payload = await measurementSchema.validateAsync(req.body, { abortEarly: false });

    if (payload.is_default) {
      await Measurement.update(
        { is_default: false },
        { where: { customer_id: req.user.id } }
      );
    }

    const measurement = await Measurement.create({ ...payload, customer_id: req.user.id });
    return res.status(201).json({ status: 'success', measurement });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

const listMeasurements = async (req, res, next) => {
  try {
    const whereClause =
      req.user.role === 'customer'
        ? { customer_id: req.user.id }
        : {};

    const measurements = await Measurement.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
    });

    return res.json({ status: 'success', measurements });
  } catch (error) {
    return next(error);
  }
};

const listMeasurementFields = async (_req, res, next) => {
  try {
    const fields = await MeasurementField.findAll({ order: [['sort_order', 'ASC']] });
    return res.json({ status: 'success', fields });
  } catch (error) {
    return next(error);
  }
};

const setDefaultMeasurement = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ status: 'error', message: 'Only customers can update defaults' });
    }

    const { measurementId } = req.params;
    const measurement = await Measurement.findOne({
      where: { id: measurementId, customer_id: req.user.id },
    });

    if (!measurement) {
      return res.status(404).json({ status: 'error', message: 'Measurement not found' });
    }

    await Measurement.update(
      { is_default: false },
      { where: { customer_id: req.user.id } }
    );

    measurement.is_default = true;
    await measurement.save();

    return res.json({ status: 'success', measurement });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createMeasurement,
  listMeasurements,
  listMeasurementFields,
  setDefaultMeasurement,
};
