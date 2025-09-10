import appError from '../utils/appError.js';

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(
        new appError('User role not found. Please login again.', 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new appError(
          `Access denied. Required roles: ${roles.join(', ')}. Your role: ${
            req.user.role
          }`,
          403
        )
      );
    }

    next();
  };
};

export default allowedTo;
