module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      full_name: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      address: { type: DataTypes.TEXT },
      profile_image: { type: DataTypes.STRING(500) },
      email_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      email_verified_at: { type: DataTypes.DATE },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      is_blocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      blocked_at: { type: DataTypes.DATE },
      blocked_by_admin_id: { type: DataTypes.INTEGER.UNSIGNED },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'customers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Customer;
};
