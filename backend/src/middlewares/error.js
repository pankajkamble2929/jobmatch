// Centralized error handler
module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};