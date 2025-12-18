module.exports = (sequelize, DataTypes) => {
  const MeasurementField = sequelize.define(
    'MeasurementField',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      field_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      display_name: { type: DataTypes.STRING(150), allowNull: false },
      field_category: { type: DataTypes.STRING(50), defaultValue: 'body' },
      data_type: {
        type: DataTypes.ENUM('decimal', 'integer', 'text'),
        allowNull: false,
        defaultValue: 'decimal',
      },
      unit: { type: DataTypes.STRING(20), defaultValue: 'cm' },
      garment_types: { type: DataTypes.JSON },
      is_required: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      min_value: { type: DataTypes.DECIMAL(10, 2) },
      max_value: { type: DataTypes.DECIMAL(10, 2) },
      sort_order: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'measurement_fields',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return MeasurementField;
};
