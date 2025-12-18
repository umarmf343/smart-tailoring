const { Op } = require('sequelize');
const Joi = require('joi');
const { Tailor } = require('../models');

const filterSchema = Joi.object({
  area: Joi.string().optional(),
  speciality: Joi.string().optional(),
  min_rating: Joi.number().min(0).max(5).optional(),
});

const updateSchema = Joi.object({
  shop_name: Joi.string().min(2).optional(),
  owner_name: Joi.string().min(2).optional(),
  shop_address: Joi.string().min(2).optional(),
  area: Joi.string().optional(),
  speciality: Joi.string().optional(),
  services_offered: Joi.string().optional(),
  experience_years: Joi.number().integer().min(0).optional(),
  price_range: Joi.string().optional(),
});

const verifySchema = Joi.object({
  is_verified: Joi.boolean().required(),
  verified_by_admin_id: Joi.number().integer().optional(),
});

const listTailors = async (req, res, next) => {
  try {
    const filters = await filterSchema.validateAsync(req.query, { abortEarly: false });
    const whereClause = {};

    if (filters.area) whereClause.area = filters.area;
    if (filters.speciality) whereClause.speciality = filters.speciality;
    if (typeof filters.min_rating !== 'undefined') {
      whereClause.rating = { [Op.gte]: filters.min_rating };
    }

    const tailors = await Tailor.findAll({
      where: whereClause,
      order: [['rating', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    return res.json({ status: 'success', tailors });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

const getTailor = async (req, res, next) => {
  try {
    const tailor = await Tailor.findByPk(req.params.tailorId, {
      attributes: { exclude: ['password'] },
    });

    if (!tailor) {
      return res.status(404).json({ status: 'error', message: 'Tailor not found' });
    }

    return res.json({ status: 'success', tailor });
  } catch (error) {
    return next(error);
  }
};

const updateTailorProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'tailor') {
      return res.status(403).json({ status: 'error', message: 'Only tailors can update profiles' });
    }

    const payload = await updateSchema.validateAsync(req.body, { abortEarly: false });
    const tailor = await Tailor.findByPk(req.user.id);

    if (!tailor) {
      return res.status(404).json({ status: 'error', message: 'Tailor not found' });
    }

    await tailor.update(payload);

    return res.json({ status: 'success', tailor: tailor.get({ plain: true }) });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

const verifyTailor = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Only admins can verify tailors' });
    }

    const payload = await verifySchema.validateAsync(req.body, { abortEarly: false });
    const tailor = await Tailor.findByPk(req.params.tailorId);

    if (!tailor) {
      return res.status(404).json({ status: 'error', message: 'Tailor not found' });
    }

    await tailor.update({
      is_verified: payload.is_verified,
      verified_by_admin_id: payload.verified_by_admin_id || req.user.id,
      verified_at: new Date(),
    });

    return res.json({ status: 'success', tailor: tailor.get({ plain: true }) });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

module.exports = {
  listTailors,
  getTailor,
  updateTailorProfile,
  verifyTailor,
};
