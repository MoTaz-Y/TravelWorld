export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const statusText = err.statusText || 'error';
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    status: statusText,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
