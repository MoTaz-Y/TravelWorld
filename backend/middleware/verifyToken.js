import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.body.token;

    if (!token) {
      return next(
        new AppError(
          'Access token is required',
          401,
          httpStatusText.UNAUTHORIZED
        )
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = {
      _id: decoded.id,
      role: decoded.role || 'user',
      email: decoded.email,
      userName: decoded.userName,
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(
        new AppError('Invalid token', 401, httpStatusText.UNAUTHORIZED)
      );
    }
    if (err.name === 'TokenExpiredError') {
      return next(
        new AppError('Token expired', 401, httpStatusText.UNAUTHORIZED)
      );
    }
    return next(
      new AppError(
        'Token verification failed',
        401,
        httpStatusText.UNAUTHORIZED
      )
    );
  }
};

// Verify user (own profile or admin)
const verifyUser = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);

    if (req.user._id === req.params.id || req.user.role === 'admin') {
      next();
    } else {
      return next(
        new AppError(
          'You are not authorized to access this resource',
          403,
          httpStatusText.FORBIDDEN
        )
      );
    }
  });
};

// Verify admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);

    if (req.user.role === 'admin') {
      next();
    } else {
      return next(
        new AppError('Admin access required', 403, httpStatusText.FORBIDDEN)
      );
    }
  });
};

export default { verifyToken, verifyUser, verifyAdmin };
