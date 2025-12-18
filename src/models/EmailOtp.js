module.exports = (sequelize, DataTypes) => {
  const EmailOtp = sequelize.define(
    'EmailOtp',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(255), allowNull: false },
      otp_code: { type: DataTypes.STRING(10), allowNull: false },
      purpose: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'registration' },
      user_type: { type: DataTypes.STRING(20) },
      user_id: { type: DataTypes.INTEGER.UNSIGNED },
      attempts: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      is_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      verified_at: { type: DataTypes.DATE },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'email_otp',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return EmailOtp;
};
