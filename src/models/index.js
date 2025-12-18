const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = require('./Admin')(sequelize, DataTypes);
const AdminActivityLog = require('./AdminActivityLog')(sequelize, DataTypes);
const Customer = require('./Customer')(sequelize, DataTypes);
const Tailor = require('./Tailor')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const MeasurementField = require('./MeasurementField')(sequelize, DataTypes);
const Measurement = require('./Measurement')(sequelize, DataTypes);
const MeasurementValue = require('./MeasurementValue')(sequelize, DataTypes);
const Review = require('./Review')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const OrderHistory = require('./OrderHistory')(sequelize, DataTypes);
const EmailOtp = require('./EmailOtp')(sequelize, DataTypes);
const PasswordReset = require('./PasswordReset')(sequelize, DataTypes);

Admin.hasMany(AdminActivityLog, { foreignKey: 'admin_id', as: 'activityLogs' });
AdminActivityLog.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

Customer.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
Tailor.hasMany(Order, { foreignKey: 'tailor_id', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Order.belongsTo(Tailor, { foreignKey: 'tailor_id', as: 'tailor' });

Measurement.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Measurement, { foreignKey: 'customer_id', as: 'measurements' });
Order.belongsTo(Measurement, { foreignKey: 'measurement_id', as: 'measurement' });
Measurement.hasMany(MeasurementValue, { foreignKey: 'measurement_id', as: 'values' });
MeasurementValue.belongsTo(Measurement, { foreignKey: 'measurement_id', as: 'measurement' });
MeasurementValue.belongsTo(MeasurementField, { foreignKey: 'field_id', as: 'field' });
MeasurementField.hasMany(MeasurementValue, { foreignKey: 'field_id', as: 'values' });

Review.belongsTo(Tailor, { foreignKey: 'tailor_id', as: 'tailor' });
Review.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Tailor.hasMany(Review, { foreignKey: 'tailor_id', as: 'reviews' });
Customer.hasMany(Review, { foreignKey: 'customer_id', as: 'reviews' });

Order.hasMany(OrderHistory, { foreignKey: 'order_id', as: 'history' });
OrderHistory.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Tailor.belongsTo(Admin, { foreignKey: 'verified_by_admin_id', as: 'verifiedBy' });
Tailor.belongsTo(Admin, { foreignKey: 'blocked_by_admin_id', as: 'blockedBy' });
Customer.belongsTo(Admin, { foreignKey: 'blocked_by_admin_id', as: 'blockedBy' });

module.exports = {
  sequelize,
  Admin,
  AdminActivityLog,
  Customer,
  Tailor,
  Order,
  MeasurementField,
  Measurement,
  MeasurementValue,
  Review,
  Notification,
  OrderHistory,
  EmailOtp,
  PasswordReset,
};
