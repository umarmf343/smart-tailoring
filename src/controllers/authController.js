const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const env = require('../config/env');
const {
  Admin,
  Customer,
  Tailor,
  AdminActivityLog,
} = require('../models');

const userRoleSchema = Joi.string().valid('admin', 'customer', 'tailor').required();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: userRoleSchema,
});

const customerSchema = Joi.object({
  full_name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
  password: Joi.string().min(8).required(),
  address: Joi.string().allow('', null),
});

const tailorSchema = Joi.object({
  shop_name: Joi.string().min(2).required(),
  owner_name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
  password: Joi.string().min(8).required(),
  shop_address: Joi.string().min(2).required(),
  area: Joi.string().allow('', null),
  speciality: Joi.string().allow('', null),
  services_offered: Joi.string().allow('', null),
  experience_years: Joi.number().integer().min(0).optional(),
});

const adminSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
  full_name: Joi.string().allow('', null),
  role: Joi.string().valid('super_admin', 'admin', 'moderator').default('admin'),
});

const buildToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const sanitizeUser = (user) => {
  const data = user.get({ plain: true });
  delete data.password;
  return data;
};

const handleUniqueViolation = (error, res, next) => {
  if (error?.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 'error',
      message: 'Account already exists with the provided email or phone number.',
    });
  }
  return next(error);
};

const registerCustomer = async (req, res, next) => {
  try {
    const payload = await customerSchema.validateAsync(req.body, { abortEarly: false });
    const hash = await bcrypt.hash(payload.password, env.bcryptRounds);

    const customer = await Customer.create({ ...payload, password: hash });
    const token = buildToken({ id: customer.id, role: 'customer' });

    return res.status(201).json({
      status: 'success',
      token,
      user: sanitizeUser(customer),
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return handleUniqueViolation(error, res, next);
  }
};

const registerTailor = async (req, res, next) => {
  try {
    const payload = await tailorSchema.validateAsync(req.body, { abortEarly: false });
    const hash = await bcrypt.hash(payload.password, env.bcryptRounds);

    const tailor = await Tailor.create({ ...payload, password: hash });
    const token = buildToken({ id: tailor.id, role: 'tailor' });

    return res.status(201).json({
      status: 'success',
      token,
      user: sanitizeUser(tailor),
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return handleUniqueViolation(error, res, next);
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    const payload = await adminSchema.validateAsync(req.body, { abortEarly: false });
    const hash = await bcrypt.hash(payload.password, env.bcryptRounds);

    const admin = await Admin.create({ ...payload, password: hash });
    const token = buildToken({ id: admin.id, role: 'admin' });

    await AdminActivityLog.create({
      admin_id: admin.id,
      action_type: 'admin_created',
      action_description: `Admin ${admin.username} created via Node migration API`,
      target_type: 'admin',
      target_id: admin.id,
    });

    return res.status(201).json({
      status: 'success',
      token,
      user: sanitizeUser(admin),
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return handleUniqueViolation(error, res, next);
  }
};

const fetchUserModel = (role) => {
  if (role === 'admin') return Admin;
  if (role === 'tailor') return Tailor;
  return Customer;
};

const login = async (req, res, next) => {
  try {
    const payload = await loginSchema.validateAsync(req.body, { abortEarly: false });
    const Model = fetchUserModel(payload.role);

    const user = await Model.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(payload.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    if (user.is_blocked || user.is_active === false) {
      return res.status(403).json({ status: 'error', message: 'Account is inactive or blocked' });
    }

    const token = buildToken({ id: user.id, role: payload.role });

    if (payload.role === 'admin') {
      await AdminActivityLog.create({
        admin_id: user.id,
        action_type: 'login',
        action_description: 'Admin login via Node backend',
      });
    }

    return res.json({ status: 'success', token, user: sanitizeUser(user) });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

module.exports = {
  registerCustomer,
  registerTailor,
  registerAdmin,
  login,
};
