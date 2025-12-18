const errorHandler = (err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('[API Error]', err);
  const status = err.status || 500;
  return res.status(status).json({
    status: 'error',
    message: err.message || 'Unexpected error occurred',
  });
};

module.exports = errorHandler;
