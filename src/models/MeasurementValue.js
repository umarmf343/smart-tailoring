module.exports = (sequelize, DataTypes) => {
  const MeasurementValue = sequelize.define(
    'MeasurementValue',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      measurement_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      field_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      value_decimal: { type: DataTypes.DECIMAL(10, 2) },
      value_text: { type: DataTypes.STRING(255) },
    },
    {
      tableName: 'measurement_values',
      timestamps: false,
    }
  );

  return MeasurementValue;
};
