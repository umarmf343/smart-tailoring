module.exports = (sequelize, DataTypes) => {
  const AdminActivityLog = sequelize.define(
    'AdminActivityLog',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      admin_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      action_type: { type: DataTypes.STRING(100), allowNull: false },
      action_description: { type: DataTypes.TEXT, allowNull: false },
      target_type: { type: DataTypes.STRING(100) },
      target_id: { type: DataTypes.INTEGER.UNSIGNED },
      ip_address: { type: DataTypes.STRING(45) },
      user_agent: { type: DataTypes.STRING(512) },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'admin_activity_log',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return AdminActivityLog;
};
