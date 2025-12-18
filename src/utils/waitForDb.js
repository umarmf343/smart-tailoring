const mysql = require('mysql2/promise');
const env = require('../config/env');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Waits for MySQL to become available before continuing.
 * Helpful for local development and container start-up when the DB may take a few seconds to boot.
 *
 * @param {Object} options
 * @param {number} [options.retries=10] - Number of attempts before failing.
 * @param {number} [options.delay=1000] - Delay between retries in milliseconds.
 */
async function waitForDb({ retries = 10, delay = 1000 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const connection = await mysql.createConnection({
        host: env.db.host,
        user: env.db.user,
        password: env.db.password,
        port: env.db.port,
      });

      await connection.query('SELECT 1');
      await connection.end();
      return;
    } catch (error) {
      lastError = error;
      const remaining = retries - attempt;
      // eslint-disable-next-line no-console
      console.warn(
        `[DB] Connection attempt ${attempt} failed (${error.code || error.message}).` +
          (remaining > 0 ? ` Retrying in ${delay / 1000}s...` : '')
      );
      if (remaining === 0) {
        break;
      }
      await sleep(delay);
    }
  }

  const message = `Unable to connect to MySQL at ${env.db.host}:${env.db.port}. ` +
    'Ensure MySQL is running and the DB_* credentials in your .env are correct.';
  const error = new Error(message);
  error.cause = lastError;
  throw error;
}

module.exports = waitForDb;
