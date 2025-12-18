const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME || 'smart_tailoring',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  },
  jwtSecret: process.env.JWT_SECRET || 'replace-me-with-a-secure-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
};

module.exports = env;
