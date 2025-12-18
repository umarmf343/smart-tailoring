const Joi = require('joi');
const { Customer } = require('../models');

const updateSchema = Joi.object({
  full_name: Joi.string().min(2).optional(),
  address: Joi.string().allow('', null),
  profile_image: Joi.string().uri().allow('', null),
});

const listCustomers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Only admins can list customers' });
    }

    const customers = await Customer.findAll({
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    return res.json({ status: 'success', customers });
  } catch (error) {
    return next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const customerId = req.user.role === 'customer' ? req.user.id : req.params.customerId;
    const customer = await Customer.findByPk(customerId, {
      attributes: { exclude: ['password'] },
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    if (req.user.role === 'customer' && customer.id !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    return res.json({ status: 'success', customer });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ status: 'error', message: 'Only customers can update profile' });
    }

    const payload = await updateSchema.validateAsync(req.body, { abortEarly: false });
    const customer = await Customer.findByPk(req.user.id);

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    await customer.update(payload);
    return res.json({ status: 'success', customer: customer.get({ plain: true }) });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

module.exports = {
  listCustomers,
  getProfile,
  updateProfile,
};
