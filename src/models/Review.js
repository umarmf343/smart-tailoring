module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      review_id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      tailor_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      order_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      rating: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
      review_text: { type: DataTypes.TEXT },
      is_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'reviews',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Review;
};
