module.exports = (sequelize, DataTypes) => {
  const OrderHistory = sequelize.define(
    'OrderHistory',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      order_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      old_status: { type: DataTypes.STRING(50) },
      new_status: { type: DataTypes.STRING(50), allowNull: false },
      changed_by_id: { type: DataTypes.INTEGER.UNSIGNED },
      changed_by_type: {
        type: DataTypes.ENUM('customer', 'tailor', 'system'),
        defaultValue: 'system',
      },
      notes: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'order_history',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return OrderHistory;
};
