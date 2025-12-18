module.exports = (sequelize, DataTypes) => {
  const Measurement = sequelize.define(
    'Measurement',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      label: { type: DataTypes.STRING(255) },
      garment_context: { type: DataTypes.STRING(50), defaultValue: 'full' },
      measurements_data: { type: DataTypes.JSON, allowNull: false },
      is_default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      notes: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'measurements',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Measurement;
};
