const { Op } = require('sequelize');
const Joi = require('joi');
const {
  Order,
  OrderHistory,
  Customer,
  Tailor,
  Measurement,
} = require('../models');

const createOrderSchema = Joi.object({
  tailor_id: Joi.number().integer().required(),
  service_type: Joi.string().allow('', null),
  garment_type: Joi.string().allow('', null),
  quantity: Joi.number().integer().min(1).default(1),
  measurements: Joi.string().allow('', null),
  special_instructions: Joi.string().allow('', null),
  estimated_price: Joi.number().precision(2).min(0).default(0),
  measurement_id: Joi.number().integer().optional(),
  delivery_date: Joi.date().optional(),
  deadline: Joi.date().optional(),
});

const statusUpdateSchema = Joi.object({
  order_status: Joi.string().required(),
  payment_status: Joi.string().optional(),
  final_price: Joi.number().precision(2).min(0).optional(),
  deposit_paid_at: Joi.date().optional(),
  delivery_date: Joi.date().optional(),
  notes: Joi.string().allow('', null),
});

const generateOrderNumber = async () => {
  const base = `ST-${Date.now()}`;
  const existing = await Order.count({ where: { order_number: { [Op.like]: `${base}%` } } });
  return existing ? `${base}-${existing + 1}` : base;
};

const createOrder = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ status: 'error', message: 'Only customers can create orders' });
    }

    const payload = await createOrderSchema.validateAsync(req.body, { abortEarly: false });
    const orderNumber = await generateOrderNumber();

    if (payload.measurement_id) {
      const measurement = await Measurement.findOne({
        where: { id: payload.measurement_id, customer_id: req.user.id },
      });
      if (!measurement) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Measurement not found for this customer' });
      }
    }

    const order = await Order.create({
      ...payload,
      order_number: orderNumber,
      customer_id: req.user.id,
      order_status: 'pending',
    });

    await OrderHistory.create({
      order_id: order.id,
      new_status: 'pending',
      changed_by_id: req.user.id,
      changed_by_type: 'customer',
      notes: 'Order created via Node backend',
    });

    const hydrated = await Order.findByPk(order.id, {
      include: [
        { model: Customer, as: 'customer', attributes: { exclude: ['password'] } },
        { model: Tailor, as: 'tailor', attributes: { exclude: ['password'] } },
      ],
    });

    return res.status(201).json({ status: 'success', order: hydrated });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const whereClause = {};

    if (role === 'customer') {
      whereClause.customer_id = id;
    } else if (role === 'tailor') {
      whereClause.tailor_id = id;
    }

    const orders = await Order.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: [
        { model: Customer, as: 'customer', attributes: { exclude: ['password'] } },
        { model: Tailor, as: 'tailor', attributes: { exclude: ['password'] } },
        { model: OrderHistory, as: 'history' },
      ],
    });

    return res.json({ status: 'success', orders });
  } catch (error) {
    return next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: Customer, as: 'customer', attributes: { exclude: ['password'] } },
        { model: Tailor, as: 'tailor', attributes: { exclude: ['password'] } },
        { model: OrderHistory, as: 'history' },
      ],
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    if (role === 'customer' && order.customer_id !== id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    if (role === 'tailor' && order.tailor_id !== id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    return res.json({ status: 'success', order });
  } catch (error) {
    return next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    if (!['tailor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to update orders' });
    }

    const { orderId } = req.params;
    const payload = await statusUpdateSchema.validateAsync(req.body, { abortEarly: false });

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    if (req.user.role === 'tailor' && order.tailor_id !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const oldStatus = order.order_status;
    Object.assign(order, payload);
    await order.save();

    await OrderHistory.create({
      order_id: order.id,
      old_status: oldStatus,
      new_status: payload.order_status,
      changed_by_id: req.user.id,
      changed_by_type: req.user.role,
      notes: payload.notes,
    });

    const refreshed = await Order.findByPk(order.id, {
      include: [
        { model: Customer, as: 'customer', attributes: { exclude: ['password'] } },
        { model: Tailor, as: 'tailor', attributes: { exclude: ['password'] } },
        { model: OrderHistory, as: 'history' },
      ],
    });

    return res.json({ status: 'success', order: refreshed });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    return next(error);
  }
};

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  updateStatus,
};
