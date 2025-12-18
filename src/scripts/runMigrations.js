const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../config/env');

const migrationsDir = path.resolve(__dirname, '../../database/migrations');

const loadMigrations = () => {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql') && !file.toLowerCase().includes('rollback'))
    .sort();

  return files.map((file) => ({
    name: file,
    sql: fs.readFileSync(path.join(migrationsDir, file), 'utf8'),
  }));
};

const run = async () => {
  const migrations = loadMigrations();
  // eslint-disable-next-line no-console
  console.log(`Running ${migrations.length} SQL migrations against ${env.db.name}`);

  const adminConnection = await mysql.createConnection({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    port: env.db.port,
    multipleStatements: true,
  });

  await adminConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.db.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await adminConnection.end();

  const connection = await mysql.createConnection({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    port: env.db.port,
    multipleStatements: true,
  });

  for (const migration of migrations) {
    // eslint-disable-next-line no-console
    console.log(`Applying migration: ${migration.name}`);
    await connection.query(migration.sql);
  }

  await connection.end();
  // eslint-disable-next-line no-console
  console.log('Migrations completed successfully');
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed:', error);
  process.exit(1);
});
