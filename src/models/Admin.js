module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      full_name: { type: DataTypes.STRING(255) },
      name: { type: DataTypes.STRING(255) },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      role: {
        type: DataTypes.ENUM('super_admin', 'admin', 'moderator'),
        allowNull: false,
        defaultValue: 'admin',
      },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      email_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      email_verified_at: { type: DataTypes.DATE },
      last_login: { type: DataTypes.DATE },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'admins',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Admin;
};
