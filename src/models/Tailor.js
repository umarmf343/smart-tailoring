module.exports = (sequelize, DataTypes) => {
  const Tailor = sequelize.define(
    'Tailor',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      shop_name: { type: DataTypes.STRING(255), allowNull: false },
      owner_name: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      shop_address: { type: DataTypes.STRING(255), allowNull: false },
      area: { type: DataTypes.STRING(100), defaultValue: 'Satna' },
      speciality: { type: DataTypes.STRING(255), defaultValue: 'General Tailoring' },
      services_offered: { type: DataTypes.TEXT },
      experience_years: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      price_range: { type: DataTypes.STRING(50), defaultValue: 'medium' },
      rating: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
      total_reviews: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      total_orders: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      profile_image: { type: DataTypes.STRING(500) },
      shop_image: { type: DataTypes.STRING(500) },
      email_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      is_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_blocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      verified_by_admin_id: { type: DataTypes.INTEGER.UNSIGNED },
      verified_at: { type: DataTypes.DATE },
      blocked_by_admin_id: { type: DataTypes.INTEGER.UNSIGNED },
      blocked_at: { type: DataTypes.DATE },
      latitude: { type: DataTypes.DECIMAL(10, 7) },
      longitude: { type: DataTypes.DECIMAL(10, 7) },
      location_updated_at: { type: DataTypes.DATE },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'tailors',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Tailor;
};
