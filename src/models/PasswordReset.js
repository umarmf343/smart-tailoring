module.exports = (sequelize, DataTypes) => {
  const PasswordReset = sequelize.define(
    'PasswordReset',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_type: { type: DataTypes.ENUM('customer', 'tailor', 'admin'), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false },
      token: { type: DataTypes.STRING(255), allowNull: false },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'password_resets',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return PasswordReset;
};
