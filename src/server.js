const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const waitForDb = require('./utils/waitForDb');

const bootstrap = async () => {
  try {
    await waitForDb({ retries: 12, delay: 1000 });
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    // eslint-disable-next-line no-console
    console.log('Database connection established');

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Smart Tailoring Node backend running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

bootstrap();
